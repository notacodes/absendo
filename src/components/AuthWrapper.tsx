import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import EncryptionService from '../services/encryptionService';
import PinEntry from './PinEntry';

interface AuthWrapperProps {
  children: React.ReactNode;
  user: User | null;
}

interface AuthState {
  isAuthenticated: boolean;
  needsPinSetup: boolean;
  needsPinEntry: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthWrapper = ({ children, user }: AuthWrapperProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    needsPinSetup: false,
    needsPinEntry: false,
    isLoading: true,
    error: null
  });

  const encryptionService = EncryptionService.getInstance();

  useEffect(() => {
    if (user) {
      checkAuthenticationStatus(user);
    } else {
      setAuthState({
        isAuthenticated: false,
        needsPinSetup: false,
        needsPinEntry: false,
        isLoading: false,
        error: null
      });
    }
  }, [user]);

  const checkAuthenticationStatus = async (user: User) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check if user authenticated with OAuth
      const isOAuthUser = user.app_metadata?.provider !== 'email';
      
      if (!isOAuthUser) {
        // Email/password users don't need PIN
        setAuthState({
          isAuthenticated: true,
          needsPinSetup: false,
          needsPinEntry: false,
          isLoading: false,
          error: null
        });
        return;
      }

      // Check if encryption is already initialized
      if (encryptionService.isPinBasedAuthReady()) {
        setAuthState({
          isAuthenticated: true,
          needsPinSetup: false,
          needsPinEntry: false,
          isLoading: false,
          error: null
        });
        return;
      }

      // Check if user has encrypted data (to determine if they need PIN setup or entry)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_encrypted, encrypted_data')
        .eq('id', user.id)
        .single();

      if (profileData?.is_encrypted) {
        // User has encrypted data, needs to enter PIN
        setAuthState({
          isAuthenticated: false,
          needsPinSetup: false,
          needsPinEntry: true,
          isLoading: false,
          error: null
        });
      } else {
        // New user or user without encrypted data, needs PIN setup
        setAuthState({
          isAuthenticated: false,
          needsPinSetup: true,
          needsPinEntry: false,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setAuthState({
        isAuthenticated: false,
        needsPinSetup: true,
        needsPinEntry: false,
        isLoading: false,
        error: 'Authentifizierungsfehler aufgetreten'
      });
    }
  };

  const handlePinSetup = async (pin: string) => {
    if (!user) return;

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await encryptionService.initializeKeyForOAuthWithPin(
        user.id,
        user.email || '',
        pin
      );

      if (result.success) {
        setAuthState({
          isAuthenticated: true,
          needsPinSetup: false,
          needsPinEntry: false,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'PIN-Setup fehlgeschlagen'
        }));
      }
    } catch (error) {
      console.error('PIN setup failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'PIN-Setup fehlgeschlagen'
      }));
    }
  };

  const handlePinEntry = async (pin: string) => {
    if (!user) return;

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Get user's encrypted data to verify PIN
      const { data: profileData } = await supabase
        .from('profiles')
        .select('encrypted_data, encryption_salt')
        .eq('id', user.id)
        .single();

      const isValidPin = await encryptionService.verifyPin(
        user.id,
        user.email || '',
        pin,
        profileData?.encrypted_data,
        profileData?.encryption_salt
      );

      if (isValidPin) {
        setAuthState({
          isAuthenticated: true,
          needsPinSetup: false,
          needsPinEntry: false,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Ungültige PIN. Bitte versuchen Sie es erneut.'
        }));
      }
    } catch (error) {
      console.error('PIN verification failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'PIN-Überprüfung fehlgeschlagen'
      }));
    }
  };

  const handleCancel = async () => {
    // Sign out the user if they cancel PIN entry
    await supabase.auth.signOut();
  };

  // Show loading spinner
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg" />
          <p className="mt-4 text-lg">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  // Show PIN setup for first-time OAuth users
  if (authState.needsPinSetup) {
    return (
      <>
        {children}
        <PinEntry
          isOpen={true}
          onSubmit={handlePinSetup}
          onCancel={handleCancel}
          error={authState.error || undefined}
          loading={authState.isLoading}
          isFirstTime={true}
        />
      </>
    );
  }

  // Show PIN entry for returning OAuth users
  if (authState.needsPinEntry) {
    return (
      <>
        {children}
        <PinEntry
          isOpen={true}
          onSubmit={handlePinEntry}
          onCancel={handleCancel}
          error={authState.error || undefined}
          loading={authState.isLoading}
          isFirstTime={false}
        />
      </>
    );
  }

  // Show children if authenticated
  if (authState.isAuthenticated) {
    return <>{children}</>;
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentifizierungsfehler</h1>
        <p className="mb-4">Ein unerwarteter Fehler ist aufgetreten.</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/login'}
        >
          Zur Anmeldung
        </button>
      </div>
    </div>
  );
};

export default AuthWrapper;