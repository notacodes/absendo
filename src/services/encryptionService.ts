import CryptoJS from 'crypto-js';

interface EncryptionResult {
  encryptedData: string;
  salt: string;
}

interface DecryptionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

class EncryptionService {
  private static instance: EncryptionService;
  private userKey: string | null = null;

  private constructor() {}

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Initialize encryption with user password
   * This should be called after user authentication
   */
  initializeKey(userPassword: string, userEmail: string): void {
    // Use PBKDF2 to derive a key from user password and email
    this.userKey = CryptoJS.PBKDF2(userPassword + userEmail, 'absendo-salt', {
      keySize: 256 / 32,
      iterations: 10000
    }).toString();
  }

  /**
   * Initialize encryption for OAuth users without password
   * Uses user ID and email as base for key derivation
   */
  initializeKeyForOAuth(userId: string, userEmail: string): void {
    // For OAuth users, derive key from user ID and email
    // This is less secure but necessary for OAuth flow
    this.userKey = CryptoJS.PBKDF2(userId + userEmail, 'absendo-oauth-salt', {
      keySize: 256 / 32,
      iterations: 10000
    }).toString();
  }

  /**
   * Clear the encryption key (on logout)
   */
  clearKey(): void {
    this.userKey = null;
  }

  /**
   * Check if encryption is initialized
   */
  isInitialized(): boolean {
    return this.userKey !== null;
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(data: Record<string, unknown>): EncryptionResult | null {
    if (!this.userKey) {
      console.error('Encryption key not initialized');
      return null;
    }

    try {
      const dataString = JSON.stringify(data);
      const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
      const key = CryptoJS.PBKDF2(this.userKey, salt, {
        keySize: 256 / 32,
        iterations: 1000
      });

      const encrypted = CryptoJS.AES.encrypt(dataString, key.toString()).toString();
      
      return {
        encryptedData: encrypted,
        salt: salt
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string, salt: string): DecryptionResult {
    if (!this.userKey) {
      return {
        success: false,
        error: 'Encryption key not initialized'
      };
    }

    try {
      const key = CryptoJS.PBKDF2(this.userKey, salt, {
        keySize: 256 / 32,
        iterations: 1000
      });

      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key.toString());
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedData) {
        return {
          success: false,
          error: 'Failed to decrypt data - invalid key or corrupted data'
        };
      }

      return {
        success: true,
        data: JSON.parse(decryptedData)
      };
    } catch (error) {
      return {
        success: false,
        error: `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Encrypt profile data specifically
   */
  encryptProfileData(profileData: Record<string, unknown>): Record<string, unknown> {
    if (!this.isInitialized()) {
      console.warn('Encryption not initialized, storing data unencrypted');
      return profileData;
    }

    const sensitiveFields = [
      'first_name',
      'last_name', 
      'birthday',
      'calendar_url',
      'first_name_trainer',
      'last_name_trainer',
      'phone_number_trainer',
      'email_trainer'
    ];

    const sensitiveData: Record<string, unknown> = {};
    const nonSensitiveData: Record<string, unknown> = {};

    // Separate sensitive and non-sensitive data
    Object.keys(profileData).forEach(key => {
      if (sensitiveFields.includes(key)) {
        sensitiveData[key] = profileData[key];
      } else {
        nonSensitiveData[key] = profileData[key];
      }
    });

    // Encrypt sensitive data
    const encryptionResult = this.encrypt(sensitiveData);
    if (!encryptionResult) {
      console.error('Failed to encrypt profile data');
      return profileData; // Fallback to unencrypted
    }

    return {
      ...nonSensitiveData,
      encrypted_data: encryptionResult.encryptedData,
      encryption_salt: encryptionResult.salt,
      is_encrypted: true
    };
  }

  /**
   * Decrypt profile data
   */
  decryptProfileData(profileData: Record<string, unknown>): Record<string, unknown> {
    if (!profileData.is_encrypted) {
      return profileData; // Data is not encrypted
    }

    if (!this.isInitialized()) {
      console.error('Cannot decrypt data - encryption not initialized');
      return profileData; // Return encrypted data as-is
    }

    const decryptionResult = this.decrypt(
      profileData.encrypted_data as string,
      profileData.encryption_salt as string
    );

    if (!decryptionResult.success) {
      console.error('Failed to decrypt profile data:', decryptionResult.error);
      return profileData; // Return encrypted data as-is
    }

    // Merge decrypted sensitive data with non-sensitive data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { encrypted_data: _encrypted_data, encryption_salt: _encryption_salt, is_encrypted: _is_encrypted, ...nonSensitiveData } = profileData;
    return {
      ...nonSensitiveData,
      ...(decryptionResult.data || {})
    };
  }
}

export default EncryptionService;