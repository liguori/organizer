import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CustomDialogService } from './custom-dialog.service';
import { CustomDialogComponent } from './custom-dialog.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

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
    ]
})
export class CustomDialogModule {}
