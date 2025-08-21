import React, { useState } from 'react';
import { supabase} from "../supabaseClient.ts";
import EncryptionService from "../services/encryptionService.ts";

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const { error: signUpError } = await supabase.auth.signUp({ email, password,
                options: {
                    emailRedirectTo: 'https://absendo.app/welcome',
                }
            })
            if (signUpError) throw signUpError;
            if (!error) {
                // Initialize encryption key for new user after successful signup
                const encryptionService = EncryptionService.getInstance();
                encryptionService.initializeKey(password, email);
                
                window.location.href = '/email-verification';
            }

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed.');
        }
    };

    async function signInWithGithub() {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: 'https://absendo.app/welcome'
            }
        });
    }

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://absendo.app/welcome'
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="card w-96 bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold mb-4">
                        Hallo 👋, registriere dich, um fortzufahren
                    </h2>

                    <button className="btn btn-primary w-full mb-3 flex items-center gap-2" onClick={signInWithGoogle}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.04.69-2.37 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.52 7.62 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.62 1 4.01 3.48 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Weiter mit Google
                    </button>

                    <button className="btn btn-secondary w-full mb-3 flex items-center gap-2" onClick={signInWithGithub}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="currentColor"
                                d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.809 1.304 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"
                            />
                        </svg>
                        Weiter mit GitHub
                    </button>

                    <div className="divider">OR</div>

                    <form
                        className="form-control mb-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Email"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                                className="input input-bordered w-full"
                            />
                        </div>

                        {error ? (
                            <div role="alert" className="alert alert-error mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        ) : null}

                        <button className="btn btn-primary w-full">
                            Sign up
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </form>
                </div>
                <div className="card-footer text-center mb-4">
                    <p className="text-sm">
                        <p>Du hast schon einen Account? <a href="/login" className="link">Log in!</a></p>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default SignupForm;
