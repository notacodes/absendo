/**
 * Salt Manager for client-side salt storage
 * Uses IndexedDB as primary storage with LocalStorage fallback
 */

interface UserSalt {
  userId: string;
  salt: string;
  createdAt: number;
}

class SaltManager {
  private static instance: SaltManager;
  private dbName = 'AbsendoSaltDB';
  private dbVersion = 1;
  private storeName = 'salts';
  private localStoragePrefix = 'absendo_salt_';

  private constructor() {}

  static getInstance(): SaltManager {
    if (!SaltManager.instance) {
      SaltManager.instance = new SaltManager();
    }
    return SaltManager.instance;
  }

  /**
   * Initialize IndexedDB
   */
  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'userId' });
          store.createIndex('userId', 'userId', { unique: true });
        }
      };
    });
  }

  /**
   * Generate a cryptographically secure salt
   */
  private generateSalt(): string {
    const array = new Uint8Array(32); // 256 bits
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get or create salt for a user
   */
  async getSaltForUser(userId: string): Promise<string> {
    try {
      // Try IndexedDB first
      const salt = await this.getSaltFromIndexedDB(userId);
      if (salt) return salt;

      // Fallback to LocalStorage
      const localSalt = this.getSaltFromLocalStorage(userId);
      if (localSalt) {
        // Migrate to IndexedDB if possible
        await this.storeSaltInIndexedDB(userId, localSalt);
        return localSalt;
      }

      // Generate new salt
      const newSalt = this.generateSalt();
      await this.storeSalt(userId, newSalt);
      return newSalt;
    } catch (error) {
      console.error('Error managing salt:', error);
      // Emergency fallback - generate temporary salt
      return this.generateSalt();
    }
  }

  /**
   * Store salt for a user
   */
  private async storeSalt(userId: string, salt: string): Promise<void> {
    // Try IndexedDB first
    try {
      await this.storeSaltInIndexedDB(userId, salt);
    } catch (error) {
      console.warn('IndexedDB failed, using LocalStorage:', error);
      this.storeSaltInLocalStorage(userId, salt);
    }
  }

  /**
   * Get salt from IndexedDB
   */
  private async getSaltFromIndexedDB(userId: string): Promise<string | null> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(userId);

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result as UserSalt | undefined;
          resolve(result?.salt || null);
        };
      });
    } catch (error) {
      console.warn('IndexedDB get failed:', error);
      return null;
    }
  }

  /**
   * Store salt in IndexedDB
   */
  private async storeSaltInIndexedDB(userId: string, salt: string): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    const saltData: UserSalt = {
      userId,
      salt,
      createdAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(saltData);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get salt from LocalStorage
   */
  private getSaltFromLocalStorage(userId: string): string | null {
    try {
      return localStorage.getItem(this.localStoragePrefix + userId);
    } catch (error) {
      console.warn('LocalStorage get failed:', error);
      return null;
    }
  }

  /**
   * Store salt in LocalStorage
   */
  private storeSaltInLocalStorage(userId: string, salt: string): void {
    try {
      localStorage.setItem(this.localStoragePrefix + userId, salt);
    } catch (error) {
      console.warn('LocalStorage set failed:', error);
    }
  }

  /**
   * Clear salt for a user (logout)
   */
  async clearSaltForUser(userId: string): Promise<void> {
    try {
      // Clear from IndexedDB
      try {
        const db = await this.initDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.delete(userId);
      } catch (error) {
        console.warn('IndexedDB clear failed:', error);
      }

      // Clear from LocalStorage
      try {
        localStorage.removeItem(this.localStoragePrefix + userId);
      } catch (error) {
        console.warn('LocalStorage clear failed:', error);
      }
    } catch (error) {
      console.error('Error clearing salt:', error);
    }
  }

  /**
   * Clear all salts (complete logout/reset)
   */
  async clearAllSalts(): Promise<void> {
    try {
      // Clear IndexedDB
      try {
        const db = await this.initDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.clear();
      } catch (error) {
        console.warn('IndexedDB clear all failed:', error);
      }

      // Clear LocalStorage
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(this.localStoragePrefix)) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('LocalStorage clear all failed:', error);
      }
    } catch (error) {
      console.error('Error clearing all salts:', error);
    }
  }
}

export default SaltManager;