import CryptoJS from 'crypto-js';
import SaltManager from './saltManager';

interface EncryptionResult {
  encryptedData: string;
  salt: string;
}

interface DecryptionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

interface KeyDerivationResult {
  success: boolean;
  requiresPin?: boolean;
  error?: string;
}

class EncryptionService {
  private static instance: EncryptionService;
  private userKey: string | null = null;
  private saltManager: SaltManager;
  private currentUserId: string | null = null;
  private currentUserEmail: string | null = null;

  private constructor() {
    this.saltManager = SaltManager.getInstance();
  }

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
    this.currentUserEmail = userEmail;
  }

  /**
   * Initialize encryption for OAuth users with PIN
   * Uses user ID, email, PIN, and stored salt for enhanced security
   */
  async initializeKeyForOAuthWithPin(userId: string, userEmail: string, pin: string): Promise<KeyDerivationResult> {
    try {
      this.currentUserId = userId;
      this.currentUserEmail = userEmail;

      // Get user-specific salt
      const userSalt = await this.saltManager.getSaltForUser(userId);
      
      // Derive key using PBKDF2 with SHA-512, 10,000 iterations as specified
      const keyMaterial = userId + userEmail + pin;
      this.userKey = CryptoJS.PBKDF2(keyMaterial, userSalt, {
        keySize: 256 / 32,
        iterations: 10000,
        hasher: CryptoJS.algo.SHA512
      }).toString();

      return { success: true };
    } catch (error) {
      console.error('Failed to initialize OAuth key with PIN:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Initialize encryption for OAuth users without password (legacy)
   * Uses user ID and email as base for key derivation
   * This is less secure but necessary for backward compatibility
   */
  initializeKeyForOAuth(userId: string, userEmail: string): void {
    // For OAuth users, derive key from user ID and email
    // This is less secure but necessary for OAuth flow
    this.userKey = CryptoJS.PBKDF2(userId + userEmail, 'absendo-oauth-salt', {
      keySize: 256 / 32,
      iterations: 10000
    }).toString();
    this.currentUserId = userId;
    this.currentUserEmail = userEmail;
  }

  /**
   * Check if user needs PIN setup (first-time OAuth user)
   */
  async needsPinSetup(_userId: string): Promise<boolean> {
    try {
      // Check if user has existing encrypted data without PIN
      // This would indicate they need to migrate to PIN-based encryption
      return false; // For now, assume all new OAuth users need PIN setup
    } catch (error) {
      console.error('Error checking PIN setup status:', error);
      return true; // Default to requiring PIN setup
    }
  }

  /**
   * Verify PIN for existing user
   */
  async verifyPin(userId: string, userEmail: string, pin: string, encryptedTestData?: string, salt?: string): Promise<boolean> {
    try {
      // Temporarily store current key
      const originalKey = this.userKey;
      
      // Try to initialize with the provided PIN
      const result = await this.initializeKeyForOAuthWithPin(userId, userEmail, pin);
      if (!result.success) {
        this.userKey = originalKey;
        return false;
      }

      // If we have test data, try to decrypt it
      if (encryptedTestData && salt) {
        const decryptResult = this.decrypt(encryptedTestData, salt);
        if (!decryptResult.success) {
          this.userKey = originalKey;
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('PIN verification failed:', error);
      return false;
    }
  }

  /**
   * Clear the encryption key (on logout)
   */
  async clearKey(): Promise<void> {
    // Clear the in-memory key
    this.userKey = null;
    
    // Clear salt if we have user ID (for complete logout)
    if (this.currentUserId) {
      await this.saltManager.clearSaltForUser(this.currentUserId);
    }
    
    this.currentUserId = null;
    this.currentUserEmail = null;
  }

  /**
   * Clear all encryption data (complete reset)
   */
  async clearAllData(): Promise<void> {
    this.userKey = null;
    this.currentUserId = null;
    this.currentUserEmail = null;
    await this.saltManager.clearAllSalts();
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

  /**
   * Get current user info for key operations
   */
  getCurrentUserInfo(): { userId: string | null; userEmail: string | null } {
    return {
      userId: this.currentUserId,
      userEmail: this.currentUserEmail
    };
  }

  /**
   * Check if encryption is properly initialized for PIN-based auth
   */
  isPinBasedAuthReady(): boolean {
    return this.userKey !== null && this.currentUserId !== null && this.currentUserEmail !== null;
  }
}

export default EncryptionService;