import { Component, OnInit } from '@angular/core';
import { ThemeVariables } from './themes/themesVariables';
import { StyleManager } from './themes/style-manager';
import { AppConfig } from './app.config';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'Organizer';
  loading = false;

  constructor(
    private styleManager: StyleManager,
    private router: Router) {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  currentTheme: string;
  apiBackupUrl: string = AppConfig.settings.api.url + "/api/Appointments/Backup?X-API-Key=" + AppConfig.settings.api.key;

  ngOnInit() {
    this.currentTheme = this.getStoredThemeState();
    this.initializeTheme();
  }

  getCalendarCurrentYearUrl() {
    return 'calendar/' + new Date().getFullYear().toString();
  }

  getCustomerCurrentYearUrl() {
    return 'customer/' + new Date().getFullYear().toString();
  }

  getUtilizationCurrentYearUrl() {
    return 'utilization/' + new Date().getFullYear().toString();
  }

  toggleDarkLight() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setStoredThemeState(this.currentTheme);
    this.initializeTheme();
  }

  togglePurple() {
    this.currentTheme = this.currentTheme === 'purple' ? 'light' : 'purple';
    this.setStoredThemeState(this.currentTheme);
    this.initializeTheme();
  }

  initializeTheme() {
    var variablesToUse: any;
    var themeName: string;
    if (this.currentTheme === 'dark') {
      variablesToUse = ThemeVariables.darkTheme;
      themeName = 'purple-green';
    } else if (this.currentTheme === 'purple') {
      variablesToUse = ThemeVariables.purpleTheme;
      themeName = 'deeppurple-amber';
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

  setStoredThemeState(theme: string) {
    try {
      window.localStorage["organizer-theme"] = JSON.stringify(theme);
    } catch (err) {
    }
  }

  getStoredThemeState(): string {
    try {
      return JSON.parse(window.localStorage["organizer-theme"] || null) || 'light';
    } catch {
      return 'light';
    }
  }

  clearStorage() {
    try {
      window.localStorage.removeItem('organizer-theme');
    } catch { }
  }
}