import crypto from "crypto";

class Crypto {
    private static readonly ALGORITHM = "aes-256-cbc";
    private static readonly KEY = Crypto.generateKey(process.env["ENCRYPTION_PASSWORD"] as string, 32);
    private static readonly IV = Crypto.generateKey(process.env["ENCRYPTION_PASSWORD"] as string, 16);

    private static generateKey(password: string, length: number): Buffer {
        const keyArray = new Uint8Array(length);
        const textBytes = new TextEncoder().encode(password);
        for (let i = 0; i < textBytes.length; i++) {
            keyArray[i] = textBytes[i];
        }
        for (let i = textBytes.length; i < length; i++) {
            keyArray[i] = 0;
        }
        return Buffer.from(keyArray);
    }

    public static async encrypt(text: string): Promise<string> {
        try {
            const cipher = crypto.createCipheriv(Crypto.ALGORITHM, Crypto.KEY, Crypto.IV);
            let encrypted = cipher.update(text, "utf8", "base64");
            encrypted += cipher.final("base64");
            return encrypted;
        } catch (error) {
            throw new Error(`Encryption failed: ${error instanceof Error ? error.message : ""}`);
        }
    }

    public static async decrypt(value: string | null | undefined): Promise<string> {
        try {
            if (!value) {
                throw new Error("Decryption failed: Input value is null or undefined");
            }
    
            const decipher = crypto.createDecipheriv(Crypto.ALGORITHM, Crypto.KEY, Crypto.IV);
            let decrypted = decipher.update(value, "base64", "utf8");
            decrypted += decipher.final("utf8");
    
            return decrypted;
        } catch (error) {
            console.error("Decryption Error:", error);
            throw new Error(`Decryption failed: ${error instanceof Error ? error.message : ""}`);
        }
    }
    
}

export default Crypto;
