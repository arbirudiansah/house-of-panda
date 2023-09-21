import * as crypto from 'crypto';

// Decrypts an Ethereum private key encrypted with AES-512 password-based encryption
export const decryptPrivateKey = (encryptedPrivateKey: string, password: string) => {
    try {
        const encryptedBuffer = Buffer.from(encryptedPrivateKey, 'base64');
        const salt = encryptedBuffer.subarray(0, 32);
        const iv = encryptedBuffer.subarray(32, 48);
        const encrypted = encryptedBuffer.subarray(48);

        const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

        const decipher = crypto.createDecipheriv('aes-256-cbc', key.subarray(0, 32), iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.log("🚀 ~ file: crypto.ts:18 ~ decryptPrivateKey ~ error:", error)
        throw new Error('Wrong password');
    }
};
