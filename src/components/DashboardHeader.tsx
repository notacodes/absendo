import {useEffect, useState, useCallback} from 'react';
import {supabase} from "../supabaseClient.ts";
import {User} from "@supabase/supabase-js";
import EncryptionService from "../services/encryptionService.ts";
import NewAbsenceModal from "./NewAbsenceModal.tsx";

interface UserProfile {
    isFullNameEnabled?: boolean;
    isFullSubjectEnabled?: boolean;
    isDoNotSaveEnabled?: boolean;
}

function DashboardHeader() {

    const [user, setUser] = useState<User | null>(null);
    const [isFullNameEnabled, setIsFullNameEnabled] = useState(true);
    const [isFullSubjectEnabled, setIsFullSubjectEnabled] = useState(false);
    const [isDoNotSaveEnabled, setIsDoNotSaveEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userData, setUserData] = useState<UserProfile | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    const fetchUserData = useCallback(async () => {
        if (user) {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (error) throw error;

                const encryptionService = EncryptionService.getInstance();
                const decryptedData = encryptionService.decryptProfileData(data) as unknown as UserProfile;
                setUserData(decryptedData);

                setIsFullNameEnabled(decryptedData.isFullNameEnabled || true);
                setIsFullSubjectEnabled(decryptedData.isFullSubjectEnabled || false);
                setIsDoNotSaveEnabled(decryptedData.isDoNotSaveEnabled || false);

            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchUserData();
    }, [user, fetchUserData]);

    const openModal = async () => {
        await fetchUserData();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.location.reload();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap">
                <h1 className="text-2xl font-bold">Absendo Dashboard</h1>
                <button className="btn btn-primary btn-xl sm:mt-0 mt-4" onClick={openModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    Neue Absenz
                </button>
            </div>

            <NewAbsenceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                user={user}
                userData={userData}
                isFullNameEnabled={isFullNameEnabled}
                isFullSubjectEnabled={isFullSubjectEnabled}
                isDoNotSaveEnabled={isDoNotSaveEnabled}
            />
        </div>
    );
}

export default DashboardHeader;
