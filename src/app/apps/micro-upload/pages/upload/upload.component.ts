import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  private file: File;
  public link: string;

  constructor(private fileService: FileService) { }

  ngOnInit() {
  }

  public onFileChange($event) {
    this.removeLink();
    this.file = $event.target.files[0];
    console.log(this.file);
  }

  public get filename(): string {
    return this.file ? this.file.name : '';
  }
  public get disabled(): boolean {
    return this.file === undefined;
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
