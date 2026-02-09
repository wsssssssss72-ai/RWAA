
import { Injectable } from '@angular/core';

declare var CryptoJS: any;

@Injectable({ providedIn: 'root' })
export class CryptoService {
  decrypt(encryptedString: string): string {
    if (!encryptedString) return "";
    try {
      const t = CryptoJS.enc.Utf8.parse("638udh3829162018");
      const a = CryptoJS.enc.Utf8.parse("fedcba9876543210");
      return CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(encryptedString.split(':')[0]) },
        t,
        { iv: a, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      ).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Decryption failed", e);
      return "";
    }
  }
}
