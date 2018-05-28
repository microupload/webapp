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
      console.log(this._priv);
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
    const ciphertext = pub.encrypt(plaintext);
    const encrypted = new File([ciphertext], file.name, { type: file.type });
    return encrypted;
  }

  public async decrypt(file: File) {
    const priv = this.privateKey;
    const ciphertext: string = await this.readFile(file);
    const plaintext = priv.decrypt(ciphertext);
    const decrypted = new File([plaintext], file.name, { type: file.type });
    return decrypted;
  }

}
