import { Injectable } from '@angular/core';
import * as forge from 'node-forge';

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
    const keyBytes = (<any>forge).random.getBytesSync(16);
    const ivBytes = (<any>forge).random.getBytesSync(16);
    const cipher = forge.cipher.createCipher('AES-CBC', keyBytes);
    cipher.start({ iv: ivBytes });
    cipher.update(forge.util.createBuffer(plaintext, 'binary'));
    cipher.finish();
    const ciphertext = cipher.output.bytes();
    const key = forge.util.bytesToHex(pub.encrypt(keyBytes));
    const iv = forge.util.bytesToHex(ivBytes);
    const encrypted = new File([ciphertext], file.name, { type: file.type });
    return { encrypted, key, iv };
  }

  public async decrypt(file: File, key: string, iv: string) {
    const priv = this.privateKey;
    const ciphertext: string = await this.readFile(file);
    const keyBytes = priv.decrypt(forge.util.hexToBytes(key));
    const ivBytes = forge.util.hexToBytes(iv);
    const decipher = forge.cipher.createDecipher('AES-CBC', keyBytes);
    decipher.start({ iv: ivBytes });
    decipher.update((<any>forge.util).createBuffer(ciphertext, 'binary'));
    decipher.finish();
    const plaintext = decipher.output.bytes().toString();
    const decrypted = new File([plaintext], file.name, { type: file.type });
    return decrypted;
  }

}
