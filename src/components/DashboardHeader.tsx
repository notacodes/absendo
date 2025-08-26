import {useEffect, useState} from 'react';
import {supabase} from "../supabaseClient.ts";
import {User} from "@supabase/supabase-js";
import {generatePdf} from "../../services/pdfService";
import EncryptionService from "../services/encryptionService.ts";

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

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
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

                    // Decrypt the data if it's encrypted
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
        }
        fetchUserData();
    }, [user]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        reason: '',
        fileName: '',
        is_excused: true,
        isFullNameEnabled: isFullNameEnabled,
        isFullSubjectEnabled: isFullSubjectEnabled,
        isDoNotSaveEnabled: isDoNotSaveEnabled,
    });
    const [, setIsGenerating] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(1);
        setFormData({
            date: '',
            reason: '',
            fileName: 'Absenz',
            is_excused: true,
            isFullNameEnabled: isFullNameEnabled,
            isFullSubjectEnabled: isFullSubjectEnabled,
            isDoNotSaveEnabled: isDoNotSaveEnabled,
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.location.reload();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const goToNextStep = () => {
        if (currentStep === 1) {
            setIsGenerating(true);
            setCurrentStep(2);
            getPDF();
            setIsGenerating(true);
        }

    };

    function addPDFExtension(fileName: string) {
        if (!fileName.endsWith('.pdf')) {
            return fileName + '.pdf';
        }
        return fileName;
    }

    async function getPDF() {
        if (!user) {
            setErrorMessage('Du bist nicht eingeloggt. Bitte logge dich ein.');
            setIsGenerating(false);
            return;
        }
        setFormData({
            ...formData,
            isFullNameEnabled: isFullNameEnabled,
            isFullSubjectEnabled: isFullSubjectEnabled,
            isDoNotSaveEnabled: isDoNotSaveEnabled,
            fileName: addPDFExtension(formData.fileName)
        });
        try {
            const blob = await generatePdf(userData, formData);
            if(blob){
                setPdfBlob(blob);
                setIsGenerating(false);
                setCurrentStep(3);
            }else{
                setIsGenerating(false);
                setErrorMessage('PDF konnte nicht generiert werden. Prüfe deine Kalender-URL oder versuche es später erneut.');
                return;
            }
        } catch (err: unknown) {
            setIsGenerating(false);
            setErrorMessage('Fehler beim Generieren der Absenz: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    }

    function downloadPDF() {
        if (pdfBlob) {
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = formData.fileName;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            console.error('PDF Blob is null. Cannot download the file.');
        }
    }

    function viewPDF() {
        if (pdfBlob instanceof Blob) {
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
        } else {
            console.error('Invalid PDF Blob. Cannot open the file.');
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Absendo Dashboard</h1>
                <button className="btn btn-primary btn-xl" onClick={openModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    Neue Absenz
                </button>
            </div>

            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Neue Absenz erstellen</h3>
                        <ul className="steps w-full mb-6">
                            <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Daten eingeben</li>
                            <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Generieren</li>
                            <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>Download</li>
                        </ul>

                        {currentStep === 1 && (
                            <div className="form-control">
                                <div className="mb-4">
                                    <label className="label mb-2">
                                        <span className="label-text">Typ der Absenz</span>
                                    </label>
                                    <div className="flex gap-6">
                                        <label className="label cursor-pointer justify-start">
                                            <input
                                                type="radio"
                                                name="is_excused"
                                                value="true"
                                                className="radio"
                                                checked={formData.is_excused}
                                                onChange={() => setFormData({...formData, is_excused: true})}
                                            />
                                            <span>Entschuldigt</span>
                                        </label>
                                        <label className="label cursor-pointer justify-start">
                                            <input
                                                type="radio"
                                                name="is_excused"
                                                value="false"
                                                className="radio"
                                                checked={!formData.is_excused}
                                                onChange={() => setFormData({...formData, is_excused: false})}
                                            />
                                            <span>Urlaubsgesuch</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="label">
                                        <span className="label-text">Name der Datei</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fileName"
                                        value={formData.fileName}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                <label className="label">
                                        <span className="label-text">Datum</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="label">
                                        <span className="label-text">Grund</span>
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        className="textarea textarea-bordered w-full"
                                        rows={1}
                                        placeholder="Grund für die Absenz eingeben..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-ghost" onClick={closeModal}>Abbrechen</button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={goToNextStep}
                                        disabled={!formData.date || !formData.reason}
                                    >
                                        Weiter
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="radial-progress animate-spin"
                                     style={{"--value": "70"} as React.CSSProperties}></div>
                                <p className="mt-4 text-lg">Absenz wird generiert...</p>
                                {errorMessage && (
                                    <div className="alert alert-error mb-4 mt-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errorMessage}</span>
                                        <a href="/contact" className="btn btn-sm btn-secondary ml-4">Bug melden</a>
                                        <button className="btn btn-sm btn-ghost ml-2" onClick={() => { setErrorMessage(null); closeModal(); }}>Schließen</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div>
                                <div className="flex flex-col items-center justify-center py-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                         stroke="currentColor" className="w-24 h-24 text-success mb-4">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M9 12.75L11.25 15 15 9.75" />
                                    </svg>
                                    <h3 className="text-2xl font-bold text-center mb-2">PDF erfolgreich generiert!</h3>
                                    <p className="text-center text-base-content/70 mb-6">Ihre Absenz wurde als PDF-Dokument erstellt.</p>
                                    <button className="btn btn-secondary" onClick={viewPDF}>Vorschau</button>
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-ghost" onClick={closeModal}>Schliessen</button>
                                    <button className="btn btn-primary" onClick={downloadPDF}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                             stroke="currentColor" className="w-6 h-6 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                        Herunterladen
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardHeader;
