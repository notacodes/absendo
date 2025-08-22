
export type EncryptedPayload = {
    ciphertext: string;
    iv: string;
};

// --- Base64-Helper ---
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...bytes));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// --- 🔐 AES-Encryption ---
export async function encryptWithKey(
    plaintext: string,
    key: CryptoKey
): Promise<EncryptedPayload> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
    );

    return {
        ciphertext: arrayBufferToBase64(ciphertextBuffer),
        iv: arrayBufferToBase64(iv)
    };
}

export async function decryptWithKey(
    payload: EncryptedPayload,
    key: CryptoKey
): Promise<string> {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: base64ToArrayBuffer(payload.iv)
        },
        key,
        base64ToArrayBuffer(payload.ciphertext)
    );

    return new TextDecoder().decode(decryptedBuffer);
}

// --- 🔑 Backup-Token erstellen ---
export function generateBackupToken(): string {
    const bytes = window.crypto.getRandomValues(new Uint8Array(32)); // 256 Bit
    return arrayBufferToBase64(bytes.buffer);
}

// --- 🔑 AES-Schlüssel direkt aus Token ---
export async function deriveKeyFromToken(
    backupToken: string
): Promise<CryptoKey> {
    const raw = base64ToArrayBuffer(backupToken);
    return window.crypto.subtle.importKey(
        "raw",
        raw,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
}

// --- 🔐 Passwort → AES-Schlüssel (zum Schutz des Tokens) ---
export async function importKeyFromPassword(
    password: string,
    salt: string
): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new TextEncoder().encode(salt),
            iterations: 100_000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// --- 🔐 Backup-Token verschlüsseln (für Supabase) ---
export async function encryptBackupTokenWithPassword(
    backupToken: string,
    password: string,
    salt: string
): Promise<EncryptedPayload> {
    const key = await importKeyFromPassword(password, salt);
    return encryptWithKey(backupToken, key);
}

// --- 🔓 Backup-Token entschlüsseln (aus Supabase) ---
export async function decryptBackupTokenWithPassword(
    payload: EncryptedPayload,
    password: string,
    salt: string
): Promise<string> {
    const key = await importKeyFromPassword(password, salt);
    return decryptWithKey(payload, key);
}
