import {useEffect, useState} from 'react';
import {supabase} from "../supabaseClient.ts";
import {User} from "@supabase/supabase-js";

function DashboardHeader() {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        reason: '',
        is_excused: true,
        isFullNameEnabled: true
    });
    const [, setIsGenerating] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(1);
        setFormData({
            date: '',
            reason: '',
            is_excused: true,
            isFullNameEnabled: true
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
            getPDF()
                .then(() => {
                    setIsGenerating(false);
                    setCurrentStep(3);
                })
                .catch((error) => {
                    console.error('Error generating PDF:', error);
                });
        }

    };

    async function getPDF() {
        if (!user) {
            alert('User not logged in');
            return;
        }
        const response = await fetch('https://srv770938.hstgr.cloud:3001/absendo/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: formData.date,
                user_id: user.id,
                reason: formData.reason,
                is_excused: formData.is_excused,
                isFullNameEnabled: formData.isFullNameEnabled
            })
        });
        if (!response.ok) {
            alert('Failed to download PDF');
            return;
        }
        const blob = await response.blob();
        setPdfBlob(blob);

    }

    function downloadPDF() {
        if (pdfBlob) {
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'filled-formdfd.pdf';
            a.click();
            URL.revokeObjectURL(url);
            closeModal();
        } else {
            console.error('PDF Blob is null. Cannot download the file.');
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Absendo Dashboard</h1>
                <button className="btn btn-primary" onClick={openModal}>
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
                                <div className="radial-progress animate-spin" style={{ "--value": "70" } as React.CSSProperties}></div>
                                <p className="mt-4 text-lg">Absenz wird generiert...</p>
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
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-ghost" onClick={closeModal}>Abbrechen</button>
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