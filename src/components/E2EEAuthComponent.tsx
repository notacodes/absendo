import {useEffect, useState} from 'react';
import { AlertCircle, Key, Shield, Copy, Check, Eye, EyeOff } from 'lucide-react';
import {
    EncryptedPayload,
    generateBackupToken,
    deriveKeyFromToken,
    encryptBackupTokenWithPassword,
    decryptBackupTokenWithPassword
} from '../../services/cryptoService.ts';
import {supabase} from "../supabaseClient.ts";


// Mock Supabase functions
const mockSupabase = {
    async saveEncryptedToken(userId: string, payload: EncryptedPayload, salt: string) {
        // Simulate saving to Supabase
        const data = { userId, payload, salt };
        localStorage.setItem(`e2ee_${userId}`, JSON.stringify(data));

        const { error } = await supabase
            .from('user_keys')
            .insert(
                { user_id: userId, token_cipher: payload, salt: salt }
            )
        return { success: true };
    },

    async loadEncryptedToken(userId: string) {
        // Simulate loading from Supabase
        const data = localStorage.getItem(`e2ee_${userId}`);
        if (!data) return null;
        return JSON.parse(data);
    }
};

export default function E2EEAuthComponent() {
    const [currentView, setCurrentView] = useState('login'); // 'register', 'login', 'recovery'
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Form states
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [backupToken, setBackupToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showBackupToken, setShowBackupToken] = useState(false);

    // Results
    const [generatedBackupToken, setGeneratedBackupToken] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
    const [copied, setCopied] = useState(false);
    const [cryptoKey, setCryptoKey] = useState(null);

    const resetForm = () => {
        setPassword('');
        setConfirmPassword('');
        setBackupToken('');
        setMessage('');
        setGeneratedBackupToken('');
        setCryptoKey(null);
    };

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        fetchUser();
        if( user) {

        }
    }, []);

    const handleRegister = async () => {
        if (!userId || !password) {
            setMessage('Bitte füllen Sie alle Felder aus');
            setMessageType('error');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwörter stimmen nicht überein');
            setMessageType('error');
            return;
        }

        setLoading(true);
        try {
            // 1. Generate backup token
            const backupToken = generateBackupToken();

            // 2. Generate salt and encrypt backup token
            const salt = generateBackupToken(); // Using same function for salt
            const encryptedPayload = await encryptBackupTokenWithPassword(backupToken, password, salt);

            // 3. Save to Supabase
            await mockSupabase.saveEncryptedToken(userId, encryptedPayload, salt);

            // 4. Show backup token to user
            setGeneratedBackupToken(backupToken);
            setMessage('Registrierung erfolgreich! Speichern Sie den Backup-Token sicher ab.');
            setMessageType('success');

        } catch (error) {
            setMessage('Fehler bei der Registrierung: ' + error.message);
            setMessageType('error');
        }
        setLoading(false);
    };

    const handleLogin = async () => {
        if (!userId || !password) {
            setMessage('Bitte füllen Sie alle Felder aus');
            setMessageType('error');
            return;
        }

        setLoading(true);
        try {
            // 1. Load encrypted token from Supabase
            const data = await mockSupabase.loadEncryptedToken(userId);
            if (!data) {
                setMessage('Benutzer nicht gefunden');
                setMessageType('error');
                return;
            }

            // 2. Decrypt backup token with password
            const decryptedToken = await decryptBackupTokenWithPassword(
                data.payload,
                password,
                data.salt
            );

            // 3. Import E2EE key from token
            const key = await deriveKeyFromToken(decryptedToken);
            setCryptoKey(key);

            setMessage('Login erfolgreich! E2EE-Schlüssel geladen.');
            setMessageType('success');

        } catch (error) {
            setMessage('Login fehlgeschlagen: Falsches Passwort oder Benutzer existiert nicht');
            setMessageType('error');
        }
        setLoading(false);
    };

    const handleRecovery = async () => {
        if (!backupToken) {
            setMessage('Bitte geben Sie den Backup-Token ein');
            setMessageType('error');
            return;
        }

        setLoading(true);
        try {
            // Import E2EE key directly from backup token
            const key = await deriveKeyFromToken(backupToken);
            setCryptoKey(key);

            setMessage('Wiederherstellung erfolgreich! E2EE-Schlüssel wiederhergestellt.');
            setMessageType('success');

        } catch (error) {
            setMessage('Wiederherstellung fehlgeschlagen: Ungültiger Backup-Token');
            setMessageType('error');
        }
        setLoading(false);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const switchView = (view) => {
        setCurrentView(view);
        resetForm();
    };

    return (
        <div data-theme="retro" className="min-h-screen bg-base-200 p-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-3xl font-bold text-primary mb-2">
                        <Shield className="w-8 h-8" />
                        E2EE Auth
                    </div>
                    <p className="text-base-content/70">End-to-End verschlüsselte Authentifizierung</p>
                </div>

                {/* Tab Navigation */}
                <div className="tabs tabs-boxed mb-6 bg-base-100">
                    <button
                        className={`tab ${currentView === 'login' ? 'tab-active' : ''}`}
                        onClick={() => switchView('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`tab ${currentView === 'register' ? 'tab-active' : ''}`}
                        onClick={() => switchView('register')}
                    >
                        Registrierung
                    </button>
                    <button
                        className={`tab ${currentView === 'recovery' ? 'tab-active' : ''}`}
                        onClick={() => switchView('recovery')}
                    >
                        Wiederherstellung
                    </button>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        {/* Registration Form */}
                        {currentView === 'register' && (
                            <>
                                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                                    <Key className="w-6 h-6" />
                                    Neues Konto erstellen
                                </h2>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Benutzer-ID</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ihre-benutzer-id"
                                        className="input input-bordered w-full"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Passwort</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Sicheres Passwort"
                                            className="input input-bordered w-full pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-control mb-6">
                                    <label className="label">
                                        <span className="label-text">Passwort bestätigen</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Passwort wiederholen"
                                        className="input input-bordered w-full"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary w-full mb-4"
                                    onClick={handleRegister}
                                    disabled={loading}
                                >
                                    {loading && <span className="loading loading-spinner loading-sm"></span>}
                                    Konto erstellen
                                </button>

                                {generatedBackupToken && (
                                    <div className="alert alert-warning">
                                        <AlertCircle className="w-5 h-5" />
                                        <div className="flex-1">
                                            <div className="font-bold">Wichtig: Backup-Token</div>
                                            <div className="text-sm mb-2">Speichern Sie diesen Token sicher ab!</div>
                                            <div className="flex items-center gap-2">
                                                <code className="bg-base-200 p-2 rounded text-xs break-all flex-1">
                                                    {generatedBackupToken}
                                                </code>
                                                <button
                                                    className="btn btn-sm btn-ghost"
                                                    onClick={() => copyToClipboard(generatedBackupToken)}
                                                >
                                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Login Form */}
                        {currentView === 'login' && (
                            <>
                                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                                    <Shield className="w-6 h-6" />
                                    Anmelden
                                </h2>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Benutzer-ID</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ihre-benutzer-id"
                                        className="input input-bordered w-full"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    />
                                </div>

                                <div className="form-control mb-6">
                                    <label className="label">
                                        <span className="label-text">Passwort</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Ihr Passwort"
                                            className="input input-bordered w-full pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary w-full mb-4"
                                    onClick={handleLogin}
                                    disabled={loading}
                                >
                                    {loading && <span className="loading loading-spinner loading-sm"></span>}
                                    Anmelden
                                </button>

                                <div className="text-center">
                                    <button
                                        className="link link-primary text-sm"
                                        onClick={() => switchView('recovery')}
                                    >
                                        Passwort vergessen? Mit Backup-Token wiederherstellen
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Recovery Form */}
                        {currentView === 'recovery' && (
                            <>
                                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                                    <Key className="w-6 h-6" />
                                    Konto wiederherstellen
                                </h2>

                                <div className="alert alert-info mb-4">
                                    <AlertCircle className="w-5 h-5" />
                                    <div>
                                        <div className="font-bold">Backup-Token verwenden</div>
                                        <div className="text-sm">Geben Sie den Token ein, den Sie bei der Registrierung erhalten haben.</div>
                                    </div>
                                </div>

                                <div className="form-control mb-6">
                                    <label className="label">
                                        <span className="label-text">Backup-Token</span>
                                    </label>
                                    <div className="relative">
                    <textarea
                        placeholder="Ihr Backup-Token..."
                        className="textarea textarea-bordered w-full h-24 pr-10"
                        value={backupToken}
                        onChange={(e) => setBackupToken(e.target.value)}
                    />
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2"
                                            onClick={() => setShowBackupToken(!showBackupToken)}
                                        >
                                            {showBackupToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary w-full mb-4"
                                    onClick={handleRecovery}
                                    disabled={loading}
                                >
                                    {loading && <span className="loading loading-spinner loading-sm"></span>}
                                    Konto wiederherstellen
                                </button>

                                <div className="text-center">
                                    <button
                                        className="link link-primary text-sm"
                                        onClick={() => switchView('login')}
                                    >
                                        Zurück zum Login
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Messages */}
                        {message && (
                            <div className={`alert ${
                                messageType === 'success' ? 'alert-success' :
                                    messageType === 'error' ? 'alert-error' :
                                        'alert-info'
                            } mt-4`}>
                                <AlertCircle className="w-5 h-5" />
                                <span>{message}</span>
                            </div>
                        )}

                        {/* Crypto Key Status */}
                        {cryptoKey && (
                            <div className="alert alert-success mt-4">
                                <Shield className="w-5 h-5" />
                                <div>
                                    <div className="font-bold">E2EE aktiviert</div>
                                    <div className="text-sm">Ihr Verschlüsselungsschlüssel ist bereit.</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="card bg-base-100 shadow-lg mt-6">
                    <div className="card-body p-4">
                        <h3 className="font-bold text-lg mb-2">Wie funktioniert E2EE?</h3>
                        <div className="text-sm space-y-2">
                            <p><strong>Registrierung:</strong> Generiert einen Backup-Token, verschlüsselt ihn mit Ihrem Passwort und speichert ihn sicher.</p>
                            <p><strong>Login:</strong> Entschlüsselt den Token mit Ihrem Passwort und stellt den Verschlüsselungsschlüssel wieder her.</p>
                            <p><strong>Wiederherstellung:</strong> Verwendet den Backup-Token direkt, falls Sie Ihr Passwort vergessen haben.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}