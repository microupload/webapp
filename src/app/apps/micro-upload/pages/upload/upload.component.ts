import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { environment } from '../../../../../environments/environment.prod';
import { CryptoService } from '../../../../modules/crypto/services/crypto.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  private file: File;
  private pub: File;
  public link: string;

  constructor(
    private fileService: FileService,
    private crypo: CryptoService
  ) { }

  ngOnInit() {
  }

  public onFileChange($event) {
    this.removeLink();
    this.file = $event.target.files[0];
  }

  public onKeyChange($event) {
    this.removeLink();
    this.pub = $event.target.files[0];
    this.crypo.pub = this.pub;
  }

  public get filename(): string {
    return this.file ? this.file.name : '';
  }

  public get pubname(): string {
    return this.pub ? this.pub.name : '';
  }

  public get disabled(): boolean {
    return this.file === undefined || this.pub === undefined;
  }

  public async onSubmit($event) {
    $event.preventDefault();
    console.log(`Uploading ${this.filename}`);
    const metadata: any = await this.fileService.upload(this.file);
    console.log(metadata);
    this.generateLink(metadata.id);
  }

  public generateLink(token: string) {
    this.link = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/micro-upload/${token}`;
  }

  public removeLink() {
    this.link = undefined;
  }

}
