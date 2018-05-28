import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MicroUploadComponent } from './micro-upload.component';
import { UploadComponent } from './pages/upload/upload.component';
import { DownloadComponent } from './pages/download/download.component';
import { HeaderComponent } from './partials/header/header.component';
import { FileService } from './services/file.service';
import { HttpClientModule } from '@angular/common/http';
import { CryptoModule } from '../../modules/crypto/crypto.module';

const routes: Routes = [
  {
    path: '',
    component: MicroUploadComponent,
    children: [
      {
        path: '',
        component: UploadComponent
      },
      {
        path: ':id',
        component: DownloadComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    CryptoModule
  ],
  declarations: [MicroUploadComponent, UploadComponent, DownloadComponent, HeaderComponent],
  providers: [
    FileService
  ]
})
export class MicroUploadModule { }
