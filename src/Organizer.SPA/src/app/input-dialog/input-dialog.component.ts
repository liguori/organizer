import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface InputDialogData {
  title: string;
  label: string;
  value: string;
  placeholder?: string;
}

@Component({
    selector: 'app-input-dialog',
    templateUrl: './input-dialog.component.html',
    styleUrls: ['./input-dialog.component.scss'],
    standalone: false
})
export class InputDialogComponent {
  inputValue: string;

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData
  ) {
    this.inputValue = data.value || '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onClear(): void {
    this.dialogRef.close('');
  }

  onSave(): void {
    this.dialogRef.close(this.inputValue);
  }
}
