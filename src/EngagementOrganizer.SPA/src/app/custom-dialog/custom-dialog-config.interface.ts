import { ThemePalette } from '@angular/material';
import { SafeHtml } from '@angular/platform-browser';

/**
 * Configuration for a custom dialog
 */
export interface CustomDialogConfig {
  /**
   * The color of the cancel button
   *
   * Note: If the dialog's type is an alert dialog, this value will be ignored
   */
  cancelBtnColor?: ThemePalette;
  /**
   * The label of the cancel button
   *
   * Note: If the dialog's type is an alert dialog, this value will be ignored
   */
  cancelBtnLabel?: string;
  /**
   * The color of the okay button
   */
  okBtnColor?: ThemePalette;
  /**
   * The label of the okay button
   */
  okBtnLabel?: string;
  /**
   * The message of the dialog
   *
   * Note that HTML can also be passed as well, which can be done by calling {@link DomSanitizer#bypassSecurityTrustHtml}.
   * @see https://angular.io/api/platform-browser/DomSanitizer#bypassSecurityTrustHtml
   */
  dialogMsg?: SafeHtml | string;
  /**
   * The title of the dialog
   */
  dialogTitle: string;
  /**
   * The type of dialog to display
   *
   * Valid values:
   * - `alert`: Shows an alert dialog
   * - `confirm`: Shows a confirmation dialog
   *
   * Default value: `alert`
   */
  dialogType?: 'alert' | 'confirm';
}
