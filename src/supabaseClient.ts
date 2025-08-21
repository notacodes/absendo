import { createClient, User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import EncryptionService from './services/encryptionService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useIsUserLoggedIn() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check the current user session
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();

        // Listen for auth state changes
        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            
            // Handle encryption key for OAuth users
            if (session?.user && session.user.app_metadata?.provider) {
                // This is an OAuth user, initialize encryption with user ID
                const encryptionService = EncryptionService.getInstance();
                encryptionService.initializeKeyForOAuth(session.user.id, session.user.email || '');
            }
            
            // Clear encryption key on logout
            if (!session?.user) {
                const encryptionService = EncryptionService.getInstance();
                encryptionService.clearKey();
            }
        });

        return () => {
            subscription.subscription.unsubscribe();
        };
    }, []);

    return user;
}