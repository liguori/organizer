import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CustomDialogService } from './custom-dialog.service';
import { CustomDialogComponent } from './custom-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

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
