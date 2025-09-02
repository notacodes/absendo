import { useEffect, useState, useCallback } from 'react';
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

  const handlePinSetup = useCallback(async (pin: string) => {
    if (!user) return;

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await encryptionService.initializeKeyForOAuthWithPin(
        user.id,
        user.email || '',
        pin
      );

      if (result.success) {
        const { error } = await supabase.from('profiles').update({ has_pin: true }).eq('id', user.id);
        if(error){
          setAuthState({
            isAuthenticated: false,
            needsPinSetup: false,
            needsPinEntry: false,
            isLoading: false,
            error: "Pin Setup fehlgeschlagen"
          });
        }
        setAuthState({
          isAuthenticated: true,
          needsPinSetup: false,
          needsPinEntry: false,
          isLoading: false,
          error: null
        });
        sessionStorage.setItem("userPin", pin);
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
  }, [user, encryptionService]);

  const handlePinEntry = useCallback(async (pin: string) => {
    if (!user) return;

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: profileData } = await supabase
        .from('profiles')
        .select('encrypted_data')
        .eq('id', user.id)
        .single();
      const userSalt = await encryptionService.saltManager.getSaltForUser(user.id);
      const isValidPin = await encryptionService.verifyPin(
        user.id,
        user.email || '',
        pin,
        profileData?.encrypted_data,
        userSalt
      );

      if (isValidPin) {
        setAuthState({
          isAuthenticated: true,
          needsPinSetup: false,
          needsPinEntry: false,
          isLoading: false,
          error: null
        });
        sessionStorage.setItem("userPin", pin);
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
  }, [user, encryptionService]);

  const handleCancel = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    const checkAuthenticationStatus = async (user: User) => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
  
        if(encryptionService.isInitialized()){
          setAuthState({
            isAuthenticated: true,
            needsPinSetup: false,
            needsPinEntry: false,
            isLoading: false,
            error: null
          });
          return
        }
  
        const savedPin = sessionStorage.getItem("userPin");
        if(savedPin){
          setAuthState({
            isAuthenticated: true,
            needsPinSetup: false,
            needsPinEntry: false,
            isLoading: false,
            error: null
          });
          await handlePinEntry(savedPin);
          return;
        }
  
        if (await encryptionService.isPinBasedAuthReady(user.id)) {
          setAuthState({
            isAuthenticated: true,
            needsPinSetup: false,
            needsPinEntry: true,
            isLoading: false,
            error: null
          });
          return;
        }
          setAuthState({
            isAuthenticated: false,
            needsPinSetup: true,
            needsPinEntry: false,
            isLoading: false,
            error: null
          });
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setAuthState({
          isAuthenticated: false,
          needsPinSetup: true,
          needsPinEntry: false,
          isLoading: false,
          error: 'Fehler:' + error
        });
      }
    };

    if (user) {
      checkAuthenticationStatus(user);
    } else {
      setAuthState({
        isAuthenticated: false,
        needsPinSetup: false,
        needsPinEntry: false,
        isLoading: false,
        error: null,
      });
    }
  }, [user, encryptionService, handlePinEntry]);

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

  if (authState.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentifizierungsfehler</h1>
        <p className="mb-4">Ein unerwarteter Fehler ist aufgetreten.</p>
        {authState.error && (
          <p className="mb-4 text-red-600">{authState.error}</p>
        )}
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
