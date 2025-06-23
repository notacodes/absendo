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
    isFullNameEnabled?: boolean;
    isFullSubjectEnabled?: boolean;
    isDoNotSaveEnabled?: boolean;
    total_absences?: number;
    time_saved_minutes?: number;
}

interface PdfFile {
    id: string;
    user_id: string;
    file_path: string;
    created_at: string;
    date_of_absence: string;
    reason: string;
    pdf_name: string;
}

function DashboardContent() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [pdfs, setPdfs] = useState<PdfFile[]>([]);
    const [isFullNameEnabled, setIsFullNameEnabled] = useState(false);
    const [isFullSubjectEnabled, setIsFullSubjectEnabled] = useState(false);
    const [isDoNotSaveEnabled, setIsDoNotSaveEnabled] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(false);

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
                    const { data: absencesData, error: absencesError } = await supabase
                        .from("pdf_files")
                        .select("id")
                        .eq("user_id", user.id);

                    if (absencesError) throw absencesError;
                    const enhancedData = {
                        ...data,
                        total_absences: absencesData?.length || 0,
                        time_saved_minutes: (absencesData?.length || 0) * 5
                    };
                    setUserData(enhancedData);

                    setIsFullNameEnabled(data.isFullNameEnabled || false);
                    setIsFullSubjectEnabled(data.isFullSubjectEnabled || false);

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
                        .order("created_at", { ascending: false });

                    if (error) throw error;
                    setPdfs((data || []));
                } catch (err) {
                    console.error("Error fetching PDFs:", err);
                }
            }
        }
        fetchPdfs();
    }, [user]);

    async function updateSetting(field: 'isFullNameEnabled' | 'isFullSubjectEnabled' | 'isDoNotSaveEnabled', value: boolean) {
        if (!user) return;

        setSettingsLoading(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ [field]: value })
                .eq("id", user.id);

            if (error) throw error;

            setUserData(prev => prev ? { ...prev, [field]: value } : null);

        } catch (err) {
            console.error(`Error updating ${field}:`, err);
            if (field === 'isFullNameEnabled') {
                setIsFullNameEnabled(userData?.isFullNameEnabled || false);
            }else if (field === 'isDoNotSaveEnabled') {
                setIsDoNotSaveEnabled(userData?.isDoNotSaveEnabled || false);
            }
            else {
                setIsFullSubjectEnabled(userData?.isFullSubjectEnabled || false);
            }
        } finally {
            setSettingsLoading(false);
            window.location.reload();
            //TO-DO: remove reload and add something to update the Values in DashboardHeader
        }
    }

    const handleFullNameToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsFullNameEnabled(newValue);
        await updateSetting('isFullNameEnabled', newValue);
    };

    const handleFullSubjectToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsFullSubjectEnabled(newValue);
        await updateSetting('isFullSubjectEnabled', newValue);
    };

    const handleDoNotSaveToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsDoNotSaveEnabled(newValue);
        await updateSetting('isDoNotSaveEnabled', newValue);
    }

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

    async function getPdf(pdf:PdfFile) {
        const {data, error} = await supabase
            .storage
            .from('pdf-files')
            .download(pdf.file_path)
        if(!error){
            return data
        }
        console.log("Error");
    }

    function viewPdf(pdfBlob: Blob) {
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    }

    function downloadPDF(pdfBlob: Blob, pdf: PdfFile) {
        if (pdfBlob) {
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = pdf.pdf_name;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            console.error('PDF Blob is null. Cannot download the file.');
        }
    }

    async function deletePdf(pdf: PdfFile) {
        const { error } = await supabase
            .storage
            .from('pdf-files')
            .remove([pdf.file_path]);

        const { status } = await supabase
            .from('pdf_files')
            .delete()
            .eq('id', pdf.id);

        if (!error && status === 204) {
            setPdfs((prev) => prev.filter((p) => p.id !== pdf.id));
        } else {
            console.error("Fehler beim Löschen der PDF:", error);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE');
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <div className="avatar">
                        <div
                            className="w-24 rounded-full bg-primary text-primary-content grid place-items-center text-xl font-bold">
                            <div className="flex items-center justify-center w-full h-full">{getUserShortName()}</div>
                        </div>
                    </div>
                    <h2 className="card-title mt-4">{userData.first_name} {userData.last_name}</h2>
                    <p className="text-sm text-gray-500">{userData.birthday}</p>
                    <p className="text-sm text-gray-500">{userData.first_name_trainer} {userData.last_name_trainer}</p>
                    <div className="card-actions justify-center mt-4">
                        <a className="btn btn-sm btn-outline" href="/profile">Zu deinem Profil</a>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl lg:col-span-1">
                <div className="card-body">
                    <h2 className="card-title">Deine Statistik</h2>

                    <div className="stats stats-vertical lg:stats-horizontal shadow mt-4">
                        <div className="stat">
                            <div className="stat-title">Generierte Absenzen</div>
                            <div className="stat-value text-primary">{userData.total_absences || 0}</div>
                            <div className="stat-desc">Seit der Registrierung</div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Zeit gespart</div>
                            <div className="stat-value text-accent">
                                {userData.time_saved_minutes
                                    ? userData.time_saved_minutes >= 60
                                        ? `${Math.floor(userData.time_saved_minutes / 60)} Std. ${userData.time_saved_minutes % 60} Min.`
                                        : `${userData.time_saved_minutes} Min.`
                                    : '0 Min.'
                                }
                            </div>
                            <div className="stat-desc">Mit Absendo vs. manuell</div>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        <p>Mit Absendo sparst du dir durchschnittlich 5 Minuten pro Absenz</p>
                    </div>
                </div>
            </div>

            {/* Settings Card */}
            <div className="card bg-base-100 shadow-xl lg:col-span-1">
                <div className="card-body">
                    <h2 className="card-title mb-5">Absenz-Einstellungen</h2>
                    {settingsLoading && (
                        <div className="loading loading-spinner loading-sm">
                            <span>Einstellungen werden gespeichert...</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={isFullNameEnabled}
                            onChange={handleFullNameToggle}
                            disabled={settingsLoading}
                            className="toggle"/>
                        <span>Statt Kürzeln werden die Namen der Lehrpersonen vollständig ausgeschrieben</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isFullSubjectEnabled}
                            onChange={handleFullSubjectToggle}
                            disabled={settingsLoading}
                            className="toggle"/>
                        <span>Fächer werden im Absenzformular ausgeschrieben statt abgekürzt dargestellt (Hinweis: Module werden weiterhin abgekürzt)</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isDoNotSaveEnabled}
                            onChange={handleDoNotSaveToggle}
                            disabled={settingsLoading}
                            className="toggle"/>
                        <span>Do NOT SAVE</span>
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
                                <th>Erstellt am</th>
                                <th>Aktionen</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pdfs.slice(0, 5).map((pdf) => (
                                <tr key={pdf.id}>
                                    <td>
                                        <span className="font-medium">
                                            {formatDate(pdf.date_of_absence)}
                                        </span>
                                    </td>
                                    <td>
                                        {pdf.reason}
                                    </td>
                                    <td>
                                        <a
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                const pdfBlob = await getPdf(pdf);
                                                if (pdfBlob) viewPdf(pdfBlob);
                                            }}
                                            className="link link-primary hover:link-hover"
                                            href="#"
                                        >
                                            {pdf.pdf_name}
                                        </a>
                                    </td>
                                    <td className="text-sm text-gray-500">
                                        {formatDate(pdf.created_at)}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-xs btn-secondary"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    const pdfBlob = await getPdf(pdf);
                                                    if (pdfBlob) downloadPDF(pdfBlob, pdf);
                                                }}
                                                title="PDF herunterladen"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                                     fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                                </svg>
                                                Download
                                            </button>
                                            <button
                                                className="btn btn-xs btn-error"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    if (confirm('Bist du sicher, dass Sie diese Absenz löschen möchtest?')) {
                                                        await deletePdf(pdf);
                                                    }
                                                }}
                                                title="PDF löschen"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                                     fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                </svg>
                                                Löschen
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {pdfs.length === 0 ? (
                        <div className="text-center mt-4">
                            <p className="text-gray-500">Keine Absenzen gefunden</p>
                        </div>
                    ) : (
                        <div className="card-actions justify-center mt-4">
                            <a className="btn btn-outline" href="/absences">Alle Absenzen anzeigen</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardContent;