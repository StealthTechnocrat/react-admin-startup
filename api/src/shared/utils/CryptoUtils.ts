import crypto from "crypto";
import { encryptionConfig } from "../../config";
import { log } from "console";

class CryptoUtils {
  private static readonly ALGORITHM = "aes-256-cbc";

  public static KEY = generateKey(
    encryptionConfig.encryptionPassword as string,
    32
  );
  public static IV = generateKey(
    encryptionConfig.encryptionPassword as string,
    16
  );

  public static async encrypt(
    text: string,
    key: Buffer,
    iv: Buffer
  ): Promise<string> {
    try {
      const cipher = crypto.createCipheriv(CryptoUtils.ALGORITHM, key, iv);
      let encrypted = cipher.update(text, "utf8", "base64");
      encrypted += cipher.final("base64");
      return encrypted;
    } catch (error) {
      throw new Error(
        `Encryption failed: ${error instanceof Error ? error.message : ""}`
      );
    }
  }

  public static async decrypt(value: string): Promise<string> {
    try {
      const decipher = crypto.createDecipheriv(
        CryptoUtils.ALGORITHM,
        CryptoUtils.KEY,
        CryptoUtils.IV
      );
      let decrypted = decipher.update(value, "base64", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (error) {
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : ""}`
      );
    }
  }
}



function generateKey(password: string, length: number): Buffer {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest()
    .subarray(0, length);
}

export default CryptoUtils;
