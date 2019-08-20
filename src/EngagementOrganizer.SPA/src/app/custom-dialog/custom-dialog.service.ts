import { Injectable } from '@angular/core';
import { CustomDialogComponent } from './custom-dialog.component';
import { CustomDialogConfig } from './custom-dialog-config.interface';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

@Injectable()
/**
 * A service used for opening a custom dialog with options specified
 */
export class CustomDialogService {
  constructor(private dialog: MatDialog) {}
  /**
   * Retrieves the default custom dialog config
   * @param dialogType The dialog's type
   * @returns The default custom dialog config
   */
  private _getDefaultCustomDialogConfig(dialogType?: 'alert' | 'confirm'): CustomDialogConfig {
    return {
      dialogTitle: dialogType === 'alert' ? 'Alert' : 'Confirm',
      dialogType: dialogType ? dialogType : 'alert'
    };
  }
  /**
   * Opens an alert dialog
   * @param config Configuration options for the custom dialog
   * @param dialogConfig Configuration options for the internal dialog config
   * @returns The dialog reference of the currently-opened dialog
   */
  openAlertDialog(
    config?: CustomDialogConfig,
    dialogConfig?: MatDialogConfig<CustomDialogConfig>): MatDialogRef<CustomDialogComponent, string> {
    let _config: CustomDialogConfig;
    let _dialogConfig: MatDialogConfig<CustomDialogConfig>;
    if (config) {
      _config = config;
    } else {
      _config = this._getDefaultCustomDialogConfig('alert');
    }

    if (dialogConfig) {
      _dialogConfig = dialogConfig;
      if (_config && !_dialogConfig.data) {
        _dialogConfig.data = _config;
      } else {
        _dialogConfig.data = this._getDefaultCustomDialogConfig('confirm');
      }
    } else {
      _dialogConfig = {
        data: _config
      }
    }
    return this.dialog.open<CustomDialogComponent, CustomDialogConfig, string>(CustomDialogComponent, _dialogConfig);
  }
  /**
   * Opens a confirmation dialog
   * @param config Configuration options for the custom dialog
   * @param dialogConfig Configuration options for the internal dialog config
   * @returns The dialog reference of the currently-opened dialog
   */
  openConfirmDialog(
    config?: CustomDialogConfig,
    dialogConfig?: MatDialogConfig<CustomDialogConfig>): MatDialogRef<CustomDialogComponent, string> {
    let _config: CustomDialogConfig;
    let _dialogConfig: MatDialogConfig<CustomDialogConfig>;
    if (config) {
      _config = config;
    } else {
      _config = this._getDefaultCustomDialogConfig('confirm');
    }

    if (dialogConfig) {
      _dialogConfig = dialogConfig;
      if (_config && !_dialogConfig.data) {
        _dialogConfig.data = _config;
      } else {
        _dialogConfig.data = this._getDefaultCustomDialogConfig('confirm');
      }
    } else {
      _dialogConfig = {
        data: _config
      }
    }
    return this.dialog.open<CustomDialogComponent, CustomDialogConfig, string>(CustomDialogComponent, _dialogConfig);
  }
}