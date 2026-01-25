import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

export interface MobileFiltersData {
  // Add any data you need to pass to the bottom sheet
}

@Component({
  selector: 'app-mobile-filters',
  templateUrl: './mobile-filters.component.html',
  styleUrls: ['./mobile-filters.component.scss'],
  standalone: false
})
export class MobileFiltersComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<MobileFiltersComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: MobileFiltersData
  ) {}

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}
