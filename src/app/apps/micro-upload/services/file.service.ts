import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CryptoService } from '../../../modules/crypto/services/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient,
    private crypto: CryptoService
  ) { }

  public async upload(file: File) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    const formData = new FormData();
    const { encrypted, key, iv } = await this.crypto.encrypt(file);
    formData.append('file', encrypted, file.name);
    formData.append('iv', iv);
    formData.append('key', key);
    formData.append('filename', file.name);
    formData.append('mimetype', file.type);
    formData.append('size', `${file.size}`);
    const uploadUrl = `${environment.api}/upload`;
    const response = await this.http.post(uploadUrl, formData, { headers }).toPromise();
    return response;
  }

  public async download(id: string) {
    const uploadUrl = `${environment.api}/download/${id}`;
    const response = await this.http.get(uploadUrl, { responseType: 'blob' }).toPromise();
    return response;
  }

  public async downloadMetadata(id: string) {
    const uploadUrl = `${environment.api}/metadata/${id}`;
    const response = await this.http.get(uploadUrl, { responseType: 'json' }).toPromise();
    return response;
  }

}
