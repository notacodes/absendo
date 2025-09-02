import { supabase } from "../supabaseClient";

class SaltManager {
  private static instance: SaltManager;
  private localStoragePrefix = "absendo_salt";

  private constructor() {}

  static getInstance(): SaltManager {
    if (!SaltManager.instance) {
      SaltManager.instance = new SaltManager();
    }
    return SaltManager.instance;
  }

  private storeSaltInLocalStorage(userId: string, salt: string) {
    localStorage.setItem(this.localStoragePrefix + userId, salt);
  }

  private getSaltFromLocalStorage(userId: string): string | null {
    return localStorage.getItem(this.localStoragePrefix + userId);
  }

  async getSaltForUser(userId: string): Promise<string> {
    const localSalt = this.getSaltFromLocalStorage(userId);
    if (localSalt) return localSalt;

    const { data, error } = await supabase
        .from("profiles")
        .select("encryption_salt")
        .eq("id", userId)
        .single();

    if (error) {
      console.error("Error fetching salt from DB:", error);
      throw error;
    }

    if (data?.encryption_salt) {
      this.storeSaltInLocalStorage(userId, data.encryption_salt);
      return data.encryption_salt;
    }

    const newSalt = this.generateSalt();
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ encryption_salt: newSalt })
        .eq("id", userId);

    if (updateError) {
      console.error("Error saving salt to DB:", updateError);
      throw updateError;
    }

    this.storeSaltInLocalStorage(userId, newSalt);
    return newSalt;
  }

  clearSaltForUser(userId: string) {
    localStorage.removeItem(this.localStoragePrefix + userId);
  }
  generateSalt(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export default SaltManager;
