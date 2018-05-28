import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MicroUploadComponent } from './micro-upload.component';
import { UploadComponent } from './pages/upload/upload.component';

const routes: Routes = [
  {
    path: '',
    component: MicroUploadComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MicroUploadComponent, UploadComponent]
})
export class MicroUploadModule { }
