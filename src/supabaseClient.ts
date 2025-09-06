import { createClient, User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import EncryptionService from './services/encryptionService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced logout function that clears encryption keys
export const secureLogout = async (): Promise<void> => {
  try {
    // Clear encryption keys first
    const encryptionService = EncryptionService.getInstance();
    await encryptionService.clearKey();
    
    // Then sign out from Supabase
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error during secure logout:', error);
    // Still try to sign out even if encryption cleanup fails
    await supabase.auth.signOut();
  }
};

export function useIsUserLoggedIn() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Only try to check user if we have valid Supabase config
        if (supabaseUrl === 'https://placeholder.supabase.co') {
            setUser(null);
            return;
        }

        // Check the current user session
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.warn('Supabase auth check failed:', error);
                setUser(null);
            }
        };

        checkUser();

        // Listen for auth state changes
        const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
            const newUser = session?.user || null;
            setUser(newUser);
            
            // Clear encryption keys on sign out
            if (event === 'SIGNED_OUT') {
                const encryptionService = EncryptionService.getInstance();
                await encryptionService.clearKey();
            }
        });

        return () => {
            subscription.subscription.unsubscribe();
        };
    }, []);

    return user;
}