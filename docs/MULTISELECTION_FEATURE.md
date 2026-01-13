# Multiselection Feature

This document describes the multiselection feature that allows bulk creation and deletion of appointments.

## Overview

The multiselection feature enables users to:
1. **Bulk Create**: Select multiple days and create appointments on all selected days with the same details
2. **Bulk Delete**: Select multiple appointments and delete them all at once

## How to Use

### Entering Selection Mode

1. Click the **"MULTI-SELECT"** button in the toolbar
2. The button will change to **"EXIT SELECTION"** to indicate you're in selection mode
3. Additional bulk action buttons will appear

### Bulk Creating Appointments

1. Enter selection mode by clicking **"MULTI-SELECT"**
2. Click on the calendar days where you want to create appointments
   - Selected days will be highlighted with a blue border and background
3. Click the **"CREATE (n)"** button, where n is the number of selected days
4. Fill in the appointment details in the dialog
   - The dialog title will show "BULK APPOINTMENT CREATION (n days)"
5. Click **"SAVE"** to create individual appointments for each selected day
6. Selection mode will automatically exit after creation

### Bulk Deleting Appointments

1. Enter selection mode by clicking **"MULTI-SELECT"**
2. Click on the appointments you want to delete
   - Selected appointments will be highlighted with a blue border and shadow
3. Click the **"DELETE (n)"** button, where n is the number of selected appointments
4. Confirm the deletion in the dialog
5. All selected appointments will be deleted simultaneously
6. Selection mode will automatically exit after deletion

### Clearing Selection

- Click the clear icon (X) button to deselect all items without exiting selection mode
- Click **"EXIT SELECTION"** to exit selection mode and clear all selections

## Visual Indicators

- **Selected Days**: Blue border and light blue background (#b3e5fc)
- **Selected Appointments**: Blue border with shadow effect
- **Button Counters**: The CREATE and DELETE buttons show the number of selected items in parentheses

## Notes

- You can select multiple days and multiple appointments in the same selection session
- The CREATE button only works with selected days
- The DELETE button only works with selected appointments
- Individual appointments created through bulk creation can be edited or deleted separately later
- Selection mode is persistent until you exit it or complete a bulk operation
