import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  private file: File;

  constructor() { }

  ngOnInit() {
  }

  public onFileChange($event) {
    this.file = $event.target.files[0];
    console.log(this.file);
  }

  public get filename(): string {
    return this.file ? this.file.name : '';
  }
  public get disabled(): boolean {
    return this.file === undefined;
  }

  public onSubmit($event): void {
    $event.preventDefault();
    console.log(`Uploading ${this.filename}`);
  }
}
