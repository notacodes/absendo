import { useState } from "react";
import {supabase} from "../supabaseClient.ts";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        grund: "feature",
        nachricht: "",
    });
    const [gesendet, setGesendet] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        console.log("Formular gesendet:", formData);

        const { error } = await supabase
            .from('feedback')
            .insert([
                {
                    name: formData.name,
                    email: formData.email,
                    grund: formData.grund,
                    nachricht: formData.nachricht,
                },
            ]);

        if (error) {
            console.error("Fehler beim Senden an Supabase:", error.message);
            return;
        }

        setGesendet(true);

        setTimeout(() => {
            setGesendet(false);
            setFormData({
                name: "",
                email: "",
                grund: "feature",
                nachricht: "",
            });
        }, 3000);
    };

    return (
        <div className="flex items-center justify-center">
        <div className="max-w-md mx-auto bg-base-100 rounded-lg shadow-lg p-6 mt-8 ">
            <h2 className="text-2xl font-bold mb-6 text-center">Kontaktformular</h2>

            {gesendet ? (
                <div className="alert alert-success mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Danke für deine Nachricht! Ich melden mich bald bei dir.</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Wie heisst du?</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Deine E-Mail</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Worum geht's?</span>
                        </label>
                        <select
                            name="grund"
                            value={formData.grund}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="feature">Ich habe eine Idee für ein neues Feature</option>
                            <option value="bug">Hab einen Bug gefunden</option>
                            <option value="hilfe">Ich benötige Unterstützung bei einem Problem</option>
                            <option value="sonstiges">Etwas anderes...</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Deine Nachricht</span>
                        </label>
                        <textarea
                            name="nachricht"
                            value={formData.nachricht}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full h-32"
                            required
                            placeholder="Schreib etwas..."
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Abschicken
                    </button>
                </form>
            )}
        </div>
        </div>
    );
}