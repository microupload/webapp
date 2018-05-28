import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../services/file.service';
import { CryptoService } from '../../../../modules/crypto/services/crypto.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  public title = 'Downloading...';
  public downloaded = false;
  public priv: File;

  private data: any;
  private metadata: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private crypto: CryptoService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      async params => {
        const id: string = params.id;
        if (id !== undefined) {
          this.data = await this.fileService.download(id);
          this.metadata = await this.fileService.downloadMetadata(id);
          this.title = (<any>this.metadata).filename;
        }
      }
    );
  }

  public async onKeyChange($event) {
    this.priv = $event.target.files[0];
    await this.crypto.setPriv(this.priv);

    this.createDownloadLink(this.data, this.metadata);
  }

  public get privname(): string {
    return this.priv ? this.priv.name : '';
  }

  private async createDownloadLink(data, metadata) {
    const filename = metadata.filename;
    const type = metadata.mimetype;
    const blob = await this.crypto.decrypt( new File([data], metadata.filename, { type }) );
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
