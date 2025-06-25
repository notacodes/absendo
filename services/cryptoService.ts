import CryptoJS from 'crypto-js';

const encryptionKey: string = import.meta.env.VITE_ENCRYPTION_KEY || '';

export function encryptText(textToEncrypt: string ): string {
    if (!encryptionKey) {
        throw new Error('Verschlüsselungsschlüssel ist nicht definiert.');
    }
    if (!textToEncrypt) {
        console.warn('Der zu verschlüsselnde Text ist leer.');
    }

    try {
        const ciphertext = CryptoJS.AES.encrypt(textToEncrypt, encryptionKey).toString();
        return ciphertext;
    } catch (error) {
        console.error('Fehler bei der Verschlüsselung:', error);
        throw new Error('Verschlüsselung fehlgeschlagen. Bitte überprüfen Sie den Text und den Schlüssel.');
    }
}

export function decryptText(textToDecrypt: string): string {
    if (!encryptionKey) {
        throw new Error('Verschlüsselungsschlüssel ist nicht definiert.');
    }
    if (!textToDecrypt) {
        console.warn('Der zu entschlüsselnde Text ist leer.');
        return '';
    }

    try {
        const bytes = CryptoJS.AES.decrypt(textToDecrypt, encryptionKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (originalText === '') {
            console.warn('Entschlüsselung ergab einen leeren String. Möglicherweise ist der Schlüssel falsch oder der Text ist beschädigt.');
        }

        return originalText;
    } catch (error) {
        console.error('Fehler bei der Entschlüsselung:', error);
        throw new Error('Entschlüsselung fehlgeschlagen. Überprüfen Sie, ob der Text und der Schlüssel korrekt sind.');
    }
}