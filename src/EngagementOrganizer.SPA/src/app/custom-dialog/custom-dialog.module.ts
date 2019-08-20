import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {
  MatButtonModule,
  MatDialogModule
} from '@angular/material';
import { CustomDialogService } from './custom-dialog.service';
import { CustomDialogComponent } from './custom-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    CustomDialogService
  ],
  declarations: [
    CustomDialogComponent
  ],
  exports: [
    CustomDialogComponent
  ],
  entryComponents: [
    CustomDialogComponent
  ]
})
export class CustomDialogModule {}
