import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  public title = 'Downloading...';
  public downloaded = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      async params => {
        const id: string = params.id;
        if (id !== undefined) {
          const data = await this.fileService.download(id);
          const metadata = await this.fileService.downloadMetadata(id);
          this.createDownloadLink(data, metadata);
          this.downloaded = true;
          this.title = (<any>metadata).filename;
        }
      }
    );
  }

  private createDownloadLink(data, metadata) {
    const filename = metadata.filename;
    const type = metadata.mimetype;
    const blob = new Blob([data], { type });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(elem.href);
        document.body.removeChild(elem);
      }, 0);
    }

  }
}
