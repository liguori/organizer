import { test, Page, Route } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import {
  getMockAppointments2026,
  mockCalendars,
  mockCustomers,
  mockAppointmentTypes
} from '../fixtures/mock-data';

const DOCS_DIR = path.join(__dirname, '..', '..', 'docs');
const API_BASE = 'http://localhost:5541';

/** Intercept all Organizer API calls with mock data */
async function setupApiMocks(page: Page) {
  // GET /api/Appointments?year=...
  await page.route(`${API_BASE}/api/Appointments**`, async (route: Route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(getMockAppointments2026())
    });
  });

  // GET /api/Appointments/Calendars
  await page.route(`${API_BASE}/api/Appointments/Calendars`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCalendars)
    });
  });

  // GET /api/Appointments/UpstreamCustomToken
  await page.route(`${API_BASE}/api/Appointments/UpstreamCustomToken`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'false'
    });
  });

  // GET /api/Customers
  await page.route(`${API_BASE}/api/Customers**`, async (route: Route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCustomers)
    });
  });

  // GET /api/AppointmentTypes
  await page.route(`${API_BASE}/api/AppointmentTypes**`, async (route: Route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAppointmentTypes)
    });
  });

  // GET /api/Utilization (if exists)
  await page.route(`${API_BASE}/api/Utilization**`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });
}

/** Set light theme via localStorage */
async function setLightTheme(page: Page) {
  await page.evaluate(() => {
    window.localStorage.setItem('organizer-theme', 'false');
  });
}

/** Set dark theme via localStorage */
async function setDarkTheme(page: Page) {
  await page.evaluate(() => {
    window.localStorage.setItem('organizer-theme', 'true');
  });
}

/** Wait for the calendar to finish loading (no progress bar, content rendered) */
async function waitForCalendarLoad(page: Page) {
  // Wait for progress bar to disappear; ignore timeout if it never appears
  await page.waitForSelector('#loader-placeholder mat-progress-bar', { state: 'detached', timeout: 30000 }).catch(() => {
    // Progress bar may not appear at all if load is instantaneous - safe to ignore
  });
  // Wait for calendar content to be present
  await page.waitForSelector('app-calendar', { timeout: 15000 }).catch(() => {
    // Selector may not be immediately available on slow renders - safe to ignore
  });
  // Allow Angular change detection and animations to settle
  await page.waitForTimeout(800);
}

/** Save screenshot to docs directory */
async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(DOCS_DIR, filename);
  await page.screenshot({ path: outputPath, fullPage: false });
}

test.describe('App Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('Calendar Year View - Light Theme', async ({ page }) => {
    await page.goto('/#/calendar/2026');
    await setLightTheme(page);
    await page.reload();
    await setupApiMocks(page);
    await waitForCalendarLoad(page);
    await saveScreenshot(page, 'CalendarView.png');
  });

  test('Calendar Year View - Dark Theme', async ({ page }) => {
    await page.goto('/#/calendar/2026');
    await setDarkTheme(page);
    await page.reload();
    await setupApiMocks(page);
    await waitForCalendarLoad(page);
    await saveScreenshot(page, 'CalendarView_Dark.png');
  });

  test('Calendar Month View', async ({ page }) => {
    await page.goto('/#/calendar/2026');
    await setLightTheme(page);
    await page.reload();
    await setupApiMocks(page);
    await waitForCalendarLoad(page);

    // Switch to month view
    const viewSelect = page.locator('#calendar-view-filter mat-select');
    await viewSelect.click();
    await page.locator('mat-option', { hasText: 'Month' }).click();
    await waitForCalendarLoad(page);
    await saveScreenshot(page, 'CalendarMonthlyView.png');
  });

  test('Calendar Multiple Customer Filter', async ({ page }) => {
    await page.goto('/#/calendar/2026');
    await setLightTheme(page);
    await page.reload();
    await setupApiMocks(page);
    await waitForCalendarLoad(page);

    // Open customer filter and select multiple customers
    const customerSelect = page.locator('#calendar-customer-filter mat-select');
    await customerSelect.click();
    // Wait for the dropdown panel to open
    await page.waitForSelector('mat-option', { timeout: 5000 });
    const options = page.locator('mat-option');
    const count = await options.count();
    // Select first two customer options (skip any search option)
    for (let i = 0; i < Math.min(count, 2); i++) {
      const optionText = await options.nth(i).textContent();
      if (optionText && optionText.trim().length > 0) {
        await options.nth(i).click();
      }
    }
    // Close dropdown
    await page.keyboard.press('Escape');
    // Wait for dropdown to close before screenshot
    await page.waitForSelector('.mat-mdc-select-panel', { state: 'detached', timeout: 5000 }).catch(() => {
      // Panel may not be detached immediately - safe to ignore
    });
    await saveScreenshot(page, 'CalendarMultiCustomerFilter.png');
  });

  test('Calendar Multiple Calendars', async ({ page }) => {
    await page.goto('/#/calendar/2026');
    await setLightTheme(page);
    await page.reload();
    await setupApiMocks(page);
    await waitForCalendarLoad(page);

    // Open calendar selector to show multiple calendars
    const calendarSelect = page.locator('#calendar-project-filter').first();
    if (await calendarSelect.count() > 0) {
      await calendarSelect.click();
      // Wait for input to receive focus
      await calendarSelect.waitFor({ state: 'visible' });
    }
    await saveScreenshot(page, 'CalendarMultiple.png');
  });

  test('Appointment Editing', async ({ page }) => {
    await page.goto('/#/calendar/2026');
    await setLightTheme(page);
    await page.reload();
    await setupApiMocks(page);
    await waitForCalendarLoad(page);

    // Capture Available Days dialog first
    const availabilityButton = page.locator('button[title="Availability"]');
    if (await availabilityButton.count() > 0) {
      await availabilityButton.click();
      // Wait for the dialog to be rendered
      await page.waitForSelector('mat-dialog-container', { timeout: 5000 });
      await saveScreenshot(page, 'AvailableDays.png');
      // Close dialog and wait for it to be gone
      await page.keyboard.press('Escape');
      await page.waitForSelector('mat-dialog-container', { state: 'detached', timeout: 5000 });
    }

    // Click on a calendar day cell (with actual date, not padding) to open the appointment editor dialog
    const calendarDay = page.locator('.day.day-year:not(.no-day)').first();
    if (await calendarDay.count() > 0) {
      await calendarDay.click();
      // Wait for the appointment editor dialog to open
      await page.waitForSelector('mat-dialog-container', { timeout: 5000 });
      const dialog = page.locator('mat-dialog-container');
      if (await dialog.count() > 0) {
        await saveScreenshot(page, 'AppointmentEditing.png');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('Customer Summary', async ({ page }) => {
    await page.goto('/#/customer/2026');
    await setLightTheme(page);
    await page.reload();
    await setupApiMocks(page);
    // Wait for customer view to be rendered
    await page.waitForSelector('app-customer-view, app-customer', { timeout: 15000 }).catch(() => {
      // Component selector may differ - safe to ignore, screenshot will capture whatever is rendered
    });
    // Allow Angular change detection and animations to settle
    await page.waitForTimeout(1000);
    await saveScreenshot(page, 'CustomerSummary.png');
  });
});

test.describe('Mobile Screenshots', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('Calendar Mobile View', async ({ page }) => {
    await page.goto('/#/calendar/2026');
    await setLightTheme(page);
    await page.reload();
    await setupApiMocks(page);
    await waitForCalendarLoad(page);
    await saveScreenshot(page, 'CalendarMobileView.png');
  });

  test('Calendar Mobile Filters', async ({ page }) => {
    await page.goto('/#/calendar/2026');
    await setLightTheme(page);
    await page.reload();
    await setupApiMocks(page);
    await waitForCalendarLoad(page);

    // Open mobile filters FAB (only visible on mobile viewport)
    const mobileFab = page.locator('.mobile-filters-fab');
    if (await mobileFab.isVisible()) {
      await mobileFab.click();
      // Wait for the mobile filters dialog to open
      await page.waitForSelector('mat-dialog-container, .mobile-filters', { timeout: 5000 }).catch(() => {
        // Dialog selector may differ - safe to ignore
      });
      await saveScreenshot(page, 'CalendarMobileFilters.png');
      await page.keyboard.press('Escape');
    } else {
      // Fallback: just capture the mobile calendar view
      await saveScreenshot(page, 'CalendarMobileFilters.png');
    }
  });
});
