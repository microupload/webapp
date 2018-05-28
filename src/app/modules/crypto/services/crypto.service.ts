import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private _pub: string;

  constructor() { }

  public set pub(pub: File) {
    if (pub === undefined) {
      this._pub = undefined;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        this._pub = (<any>e.target).result;
      };
      reader.readAsText(pub);
    }
  }

  private get pubkey(): string {
    return this._pub;
  }

}
