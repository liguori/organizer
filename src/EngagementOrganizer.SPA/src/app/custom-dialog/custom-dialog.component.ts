import { Component, OnInit, Inject } from '@angular/core';
import { CustomDialogConfig } from './custom-dialog-config.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss']
})
export class CustomDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public config: CustomDialogConfig) { }

  ngOnInit() {
  }

  // TODO(Chan4077): Rename this function
  /**
   * Returns the value of a variable or its default equivalant
   * @returns The value of the variable/its default equivalant if it is untruthy
   */
  getValOrDefaultVal(val: any, defaultVal: any): any {
    return val ? val : defaultVal;
  }

  /**
   * Checks if the dialog message is HTML
   */
  get isDialogMsgHtml(): boolean {
    console.log(typeof this.config.dialogMsg);
    return typeof this.config.dialogMsg === 'object';
  }

}
