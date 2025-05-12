import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";

interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    birthday: string;
    first_name_trainer: string;
    last_name_trainer: string;
}

interface PdfFile {
    id: string;
    date_of_absence: string;
    reason: string;
    pdf_name: string;
}

function DashboardContent() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [pdfs, setPdfs] = useState<PdfFile[]>([]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(user);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchUserData() {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .single();

                    if (error) throw error;
                    setUserData(data);
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        }
        fetchUserData();
    }, [user]);

    useEffect(() => {
        async function fetchPdfs() {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from("pdf_files")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("date_of_absence", { ascending: false });

                    if (error) throw error;
                    setPdfs(data || []);
                } catch (err) {
                    console.error("Error fetching PDFs:", err);
                }
            }
        }
        fetchPdfs();
    }, [user]);

    function getUserShortName() {
        if (!userData) return "NN";
        const first = userData.first_name?.charAt(0).toUpperCase() || "";
        const last = userData.last_name?.charAt(0).toUpperCase() || "";
        return `${first}${last}`;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (!userData) {
        return <div className="text-center text-red-500 mt-10">Benutzerdaten konnten nicht geladen werden.</div>;
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <div className="avatar">
                        <div className="w-24 rounded-full bg-primary text-primary-content grid place-items-center text-xl font-bold">
                            <div className="flex items-center justify-center w-full h-full">{getUserShortName()}</div>
                        </div>
                    </div>
                    <h2 className="card-title mt-4">{userData.first_name} {userData.last_name}</h2>
                    <p className="text-sm text-gray-500">{userData.birthday}</p>
                    <p className="text-sm text-gray-500">{userData.first_name_trainer} {userData.last_name_trainer}</p>
                    <div className="card-actions justify-center mt-4">
                        <button className="btn btn-sm btn-outline"><a href="/Profile">Deine Daten ändern</a></button>
                    </div>
                </div>
            </div>

            {/* Coming Soon Card */}
            <div className="card bg-base-100 shadow-xl lg:col-span-2">
                <div className="card-body">
                    <h2 className="card-title">Absenz-Einstellungen</h2>
                    <div className="divider"></div>
                    <div className="bg-base-200 rounded-lg p-8 text-center w-full border-2 border-dashed border-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-primary mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <h3 className="text-2xl font-bold text-center mb-2">Coming Soon!</h3>
                    </div>
                </div>
            </div>

            {/* PDF Table */}
            <div className="card bg-base-100 shadow-xl lg:col-span-3">
                <div className="card-body">
                    <h2 className="card-title mb-4">Letzte Absenzen</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Grund</th>
                                <th>Formular</th>
                                <th>Aktionen</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pdfs.map((pdf) => (
                                <tr key={pdf.id}>
                                    <td>{pdf.date_of_absence}</td>
                                    <td>{pdf.reason}</td>
                                    <td><a href="#" className="link link-primary">{pdf.pdf_name}</a></td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-xs btn-outline btn-info">Details</button>
                                            <button className="btn btn-xs btn-outline">Duplizieren</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-actions justify-center mt-4">
                        <button className="btn btn-outline">Alle Absenzen anzeigen</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardContent;
