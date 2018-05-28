import { Injectable } from '@angular/core';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private _pub: string;

  constructor() { }

  public set pub(pub: File) {
    (async () => {
      try {
        this._pub = await this.readFile(pub);
      } catch (e) {
        this._pub = undefined;
      }
    })();
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

  public async encrypt(file: File) {
    const pub = this.publicKey;
    const plaintext: string = await this.readFile(file);
    const ciphertext = pub.encrypt(plaintext);
    const encrypted = new File([ciphertext], file.name, { type: file.type });
    return encrypted;
  }

}
