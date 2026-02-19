import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import EncryptionService from "../services/encryptionService";
import { UserProfile } from "../types/userProfile";

interface UserProfileContextValue {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    refreshProfile: () => Promise<void>;
    updateProfileFields: (fields: Partial<UserProfile>) => Promise<void>;
}

interface UserProfileProviderProps {
    user: User | null;
    children: React.ReactNode;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ user, children }: UserProfileProviderProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const encryptionService = useMemo(() => EncryptionService.getInstance(), []);

    const refreshProfile = useCallback(async () => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profileError) throw profileError;

            const decryptedData = encryptionService.decryptProfileData(data) as unknown as UserProfile;
            setProfile(decryptedData);
        } catch (fetchError) {
            const message = fetchError instanceof Error ? fetchError.message : "Profil konnte nicht geladen werden";
            setError(message);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, [encryptionService, user]);

    const updateProfileFields = useCallback(async (fields: Partial<UserProfile>) => {
        if (!user) {
            throw new Error("User not available");
        }

        const { error: updateError } = await supabase
            .from("profiles")
            .update(fields)
            .eq("id", user.id);

        if (updateError) {
            throw updateError;
        }

        setProfile((previous) => {
            if (!previous) return previous;
            return { ...previous, ...fields };
        });
    }, [user]);

    useEffect(() => {
        void refreshProfile();
    }, [refreshProfile]);

    const contextValue = useMemo<UserProfileContextValue>(() => ({
        user,
        profile,
        loading,
        error,
        refreshProfile,
        updateProfileFields,
    }), [user, profile, loading, error, refreshProfile, updateProfileFields]);

    return (
        <UserProfileContext.Provider value={contextValue}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile(): UserProfileContextValue {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error("useUserProfile must be used inside UserProfileProvider");
    }
    return context;
}
