import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from './services/crypto.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    CryptoService
  ]
})
export class CryptoModule { }
