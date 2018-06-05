import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private _pub: string;
  private _priv: string;

  constructor() { }

  public async setPub(pub: File) {
    try {
      this._pub = await this.readFile(pub);
    } catch (e) {
      this._pub = undefined;
    }
  }

  public async setPriv(priv: File) {
    try {
      this._priv = await this.readFile(priv);
    } catch (e) {
      this._priv = undefined;
    }
  }

  private async readFile(file: File): Promise<string> {
    return new Promise<string>(
      (resolve, reject) => {
        if (file === undefined) {
          reject('Cannot read undefined file');
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content: string = ((<any>e.target).result);
            resolve(content);
          };
          reader.readAsText(file);
        }
      }
    );
  }

  private get publicKey() {
    return forge.pki.publicKeyFromPem(this._pub);
  }

  private get privateKey() {
    return forge.pki.privateKeyFromPem(this._priv);
  }

  public async encrypt(file: File) {
    const pub = this.publicKey;
    const plaintext: string = await this.readFile(file);
    const keyBytes = (<any>forge).random.getBytesSync(32);
    const ivBytes = (<any>forge).random.getBytesSync(16);
    const key = forge.util.bytesToHex(keyBytes);
    const iv = forge.util.bytesToHex(ivBytes);
    const mode = CryptoJS.mode.CTR;
    const padding = CryptoJS.pad.NoPadding;
    const ciphertext_b64 = CryptoJS.AES.encrypt(
      plaintext,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode,
        padding
      }
    ).toString();
    const ciphertext_hex = CryptoJS.enc.Base64.parse(ciphertext_b64).toString(CryptoJS.enc.Hex);
    const ciphertext = forge.util.hexToBytes(ciphertext_hex);
    const key_encrypted = forge.util.bytesToHex(pub.encrypt(keyBytes));
    const encrypted = new File([ciphertext], file.name, { type: file.type });
    return { encrypted, key: key_encrypted, iv };
  }

  public async decrypt(file: File, key_encrypted: string, iv: string) {
    const priv = this.privateKey;
    const ciphertext: string = await this.readFile(file);
    const ciphertext_hex = forge.util.bytesToHex(ciphertext);
    const ciphertext_b64 = CryptoJS.enc.Hex.parse(ciphertext_hex).toString(CryptoJS.enc.Base64);
    const keyBytes = priv.decrypt(forge.util.hexToBytes(key_encrypted));
    const key = forge.util.bytesToHex(keyBytes);
    const mode = CryptoJS.mode.CTR;
    const padding = CryptoJS.pad.NoPadding;
    const plaintext_hex = CryptoJS.AES.decrypt(
      ciphertext_b64,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode,
        padding
      }
    ).toString();
    const plaintext = forge.util.hexToBytes(plaintext_hex);
    const decrypted = new File([plaintext], file.name, { type: file.type });
    return decrypted;
  }

}
