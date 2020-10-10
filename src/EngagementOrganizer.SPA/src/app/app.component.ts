import { Component, OnInit } from '@angular/core';
import { ThemeVariables } from './themes/themesVariables';
import { StyleManager } from './themes/style-manager';
import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Engagement Organizer';

  constructor(
    private styleManager: StyleManager) {
  }

  themeToggle: boolean;
  apiBackupUrl: string = AppConfig.settings.api.url + "/api/Appointments/Backup?X-API-Key=" + AppConfig.settings.api.key;

  ngOnInit() {
    this.themeToggle = this.getStoredThemeState();
    this.initializeTheme();
  }

  getCalendarCurrentYearUrl() {
    return 'calendar/' + new Date().getFullYear().toString();
  }

  getCustomerCurrentYearUrl() {
    return 'customer/' + new Date().getFullYear().toString();
  }

  toggleDarkLight() {
    this.themeToggle = !this.themeToggle;
    this.setStoredThemeState(this.themeToggle);
    this.initializeTheme();
  }

  initializeTheme() {
    var variablesToUse: any;
    var themeName: string;
    if (this.themeToggle == true) {
      variablesToUse = ThemeVariables.darkTheme;
      themeName = 'purple-green';
    } else {
      variablesToUse = ThemeVariables.lightTheme;
      themeName = 'indigo-pink';
    }
    this.styleManager.setStyle('theme', `assets/${themeName}.css`);
    var themeWrapper = document.querySelector('.theme-wrapper') as HTMLElement;
    for (let key in variablesToUse) {
      themeWrapper.style.setProperty('--' + key, variablesToUse[key]);
    }
  }

  setStoredThemeState(theme: boolean) {
    try {
      window.localStorage["engagement-organizer-theme"] = JSON.stringify(theme);
    } catch (err) {
    }
  }

  getStoredThemeState(): boolean {
    try {
      return JSON.parse(window.localStorage["engagement-organizer-theme"] || null);
    } catch {
      return null;
    }
  }

  clearStorage() {
    try {
      window.localStorage.removeItem('engagement-organizer-theme');
    } catch { }
  }
}