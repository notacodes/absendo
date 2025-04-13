import { useState } from 'react';

interface FormData {
    first_name: string;
    last_name: string;
    birthday: string;
    class: string;
    calendar_url: string;
    first_name_trainer: string;
    last_name_trainer: string;
    phone_number_trainer: string;
    email_trainer: string;
}

interface FormErrors {
    first_name?: string;
    last_name?: string;
    birthday?: string;
    class?: string;
    calendar_url?: string;
    first_name_trainer?: string;
    last_name_trainer?: string;
    phone_number_trainer?: string;
    email_trainer?: string;
}

export default function AbsendoOnboarding() {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        first_name: '',
        last_name: '',
        birthday: '',
        class: '',
        calendar_url: '',
        first_name_trainer: '',
        last_name_trainer: '',
        phone_number_trainer: '',
        email_trainer: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [complete, setComplete] = useState<boolean>(false);

    const totalSteps = 3;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name as keyof FormErrors]) {
            const newErrors = { ...errors };
            delete newErrors[name as keyof FormErrors];
            setErrors(newErrors);
        }
    };

    const validateStep = (stepNumber: number): boolean => {
        const newErrors: FormErrors = {};

        if (stepNumber === 1) {
            if (!formData.first_name.trim()) newErrors.first_name = 'Vorname ist erforderlich';
            if (!formData.last_name.trim()) newErrors.last_name = 'Nachname ist erforderlich';
            if (!formData.birthday) newErrors.birthday = 'Geburtsdatum ist erforderlich';
            if (!formData.class.trim()) newErrors.class = 'Klasse ist erforderlich';
        } else if (stepNumber === 2) {
            if (!formData.calendar_url.trim()) newErrors.calendar_url = 'Kalender-URL ist erforderlich';
            if (formData.calendar_url && !formData.calendar_url.startsWith('http')) {
                newErrors.calendar_url = 'Gültige URL erforderlich (beginnt mit ttps://)';
            }
        } else if (stepNumber === 3) {
            if (!formData.first_name_trainer.trim()) newErrors.first_name_trainer = 'Vorname des Ausbilders ist erforderlich';
            if (!formData.last_name_trainer.trim()) newErrors.last_name_trainer = 'Nachname des Ausbilders ist erforderlich';
            if (!formData.phone_number_trainer.trim()) newErrors.phone_number_trainer = 'Telefonnummer ist erforderlich';
            if (!formData.email_trainer.trim()) {
                newErrors.email_trainer = 'E-Mail ist erforderlich';
            } else if (!/\S+@\S+\.\S+/.test(formData.email_trainer)) {
                newErrors.email_trainer = 'Gültige E-Mail-Adresse erforderlich';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            if (step < totalSteps) {
                setStep(step + 1);
            } else {
                submitForm();
            }
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const submitForm = () => {
        setLoading(true);

        //TO-DO: Datenbank Verbindung hier
        // Bool onboarding_complete in Datenbank true setzen

        setTimeout(() => {
            console.log('Formular übermittelt:', formData);
            setLoading(false);
            setComplete(true);
        }, 1500);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <div className="w-full max-w-2xl bg-base-100 rounded-lg shadow-xl p-8">
                <div className="text-center mb-10">
                    <h1 className="font-bold text-3xl text-primary mb-2">Absendo</h1>
                    <p className="text-gray-600">Dein automatischer Absenzformular-Ausfüller</p>
                </div>

                <div className="mb-8">
                    <ul className="steps steps-horizontal w-full">
                        {Array.from({ length: totalSteps }).map((_, idx) => (
                            <li
                                key={idx}
                                className={`step ${idx + 1 <= step ? 'step-primary' : ''}`}
                                data-content={idx + 1 <= step ? "✓" : (idx + 1).toString()}
                            >
                                {idx === 0 ? 'Persönliche Daten' :
                                    idx === 1 ? 'Kalender' : 'Ausbilder'}
                            </li>
                        ))}
                    </ul>
                </div>

                {complete ? (
                    <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Onboarding abgeschlossen!</h2>
                        <p className="text-gray-600 mb-6">Vielen Dank für deine Angaben. Absendo ist jetzt bereit für dich.</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/dashboard'}>
                            Zum Dashboard
                        </button>
                    </div>
                ) : (
                    <form>
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-700 mb-6">Deine persönlichen Daten</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Vorname</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="Dein Vorname"
                                            className={`input input-bordered w-full ${errors.first_name ? 'input-error' : ''}`}
                                        />
                                        {errors.first_name && <span className="text-error text-xs mt-1">{errors.first_name}</span>}
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Nachname</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            placeholder="Dein Nachname"
                                            className={`input input-bordered w-full ${errors.last_name ? 'input-error' : ''}`}
                                        />
                                        {errors.last_name && <span className="text-error text-xs mt-1">{errors.last_name}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Geburtsdatum</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                            className={`input input-bordered w-full ${errors.birthday ? 'input-error' : ''}`}
                                        />
                                        {errors.birthday && <span className="text-error text-xs mt-1">{errors.birthday}</span>}
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Klasse</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="class"
                                            value={formData.class}
                                            onChange={handleChange}
                                            placeholder="z.B. INA19a"
                                            className={`input input-bordered w-full ${errors.class ? 'input-error' : ''}`}
                                        />
                                        {errors.class && <span className="text-error text-xs mt-1">{errors.class}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-700 mb-6">Kalender-Einstellungen</h2>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Kalender-URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="calendar_url"
                                        value={formData.calendar_url}
                                        onChange={handleChange}
                                        placeholder="https://kalender.beispiel.com/dein-kalender"
                                        className={`input input-bordered w-full ${errors.calendar_url ? 'input-error' : ''}`}
                                    />
                                    {errors.calendar_url && <span className="text-error text-xs mt-1">{errors.calendar_url}</span>}
                                    <label className="label">
                                        <span className="label-text-alt text-gray-500">Dies ist die URL, von der Absendo deine Absenzen auslesen wird</span>
                                    </label>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">So findest du deine Kalender-URL</h3>
                                            <div className="mt-2 text-sm text-blue-700">
                                                <p>1. Öffne deine Kalender-App</p>
                                                <p>2. Gehe zu den Kalendereinstellungen</p>
                                                <p>3. Suche nach "iCal-URL" oder "Kalender teilen"</p>
                                                <p>4. Kopiere die URL und füge sie hier ein</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-700 mb-6">Ausbilder-Informationen</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Vorname des Ausbilders</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name_trainer"
                                            value={formData.first_name_trainer}
                                            onChange={handleChange}
                                            placeholder="Vorname"
                                            className={`input input-bordered w-full ${errors.first_name_trainer ? 'input-error' : ''}`}
                                        />
                                        {errors.first_name_trainer && <span className="text-error text-xs mt-1">{errors.first_name_trainer}</span>}
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Nachname des Ausbilders</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name_trainer"
                                            value={formData.last_name_trainer}
                                            onChange={handleChange}
                                            placeholder="Nachname"
                                            className={`input input-bordered w-full ${errors.last_name_trainer ? 'input-error' : ''}`}
                                        />
                                        {errors.last_name_trainer && <span className="text-error text-xs mt-1">{errors.last_name_trainer}</span>}
                                    </div>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Telefonnummer des Ausbilders</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone_number_trainer"
                                        value={formData.phone_number_trainer}
                                        onChange={handleChange}
                                        placeholder="+41 79 123 45 67"
                                        className={`input input-bordered w-full ${errors.phone_number_trainer ? 'input-error' : ''}`}
                                    />
                                    {errors.phone_number_trainer && <span className="text-error text-xs mt-1">{errors.phone_number_trainer}</span>}
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">E-Mail des Ausbilders</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email_trainer"
                                        value={formData.email_trainer}
                                        onChange={handleChange}
                                        placeholder="ausbilder@beispiel.com"
                                        className={`input input-bordered w-full ${errors.email_trainer ? 'input-error' : ''}`}
                                    />
                                    {errors.email_trainer && <span className="text-error text-xs mt-1">{errors.email_trainer}</span>}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-between">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="btn btn-outline"
                                disabled={step === 1}
                            >
                                Zurück
                            </button>

                            <button
                                type="button"
                                onClick={nextStep}
                                className={`btn ${step === totalSteps ? 'btn-success' : 'btn-primary'}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Wird verarbeitet...
                                    </>
                                ) : (
                                    step === totalSteps ? 'Fertigstellen' : 'Weiter'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}