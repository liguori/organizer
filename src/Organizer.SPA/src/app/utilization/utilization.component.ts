import { Component, OnInit, Input, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  Utilization,
  UtilizationRow,
  UtilizationService
} from '../api/OrganizerApiClient';

/** Status CSS class names for styling cells */
type StatusClass = 'status-danger' | 'status-success-dark' | 'status-success' | 'status-warning' | '';

/** Default target percentage for utilization */
const DEFAULT_TARGET = 72;

/** Hours per work day for calculations */
const HOURS_PER_DAY = 8;

@Component({
  selector: 'app-utilization',
  templateUrl: './utilization.component.html',
  styleUrls: ['./utilization.component.scss'],
  standalone: false
})
export class UtilizationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly utilizationService = inject(UtilizationService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() utilization: Utilization | null = null;

  selectedYear = new Date().getFullYear();
  target = DEFAULT_TARGET;
  includeNotConfirmed = true;

  ngOnInit(): void {
    this.initializeYear();
    this.loadUtilization();
  }

  /**
   * Initialize the selected year from route params or current date
   */
  private initializeYear(): void {
    const yearParam = this.route.snapshot.params['year?'];
    const parsedYear = yearParam ? parseInt(yearParam, 10) : NaN;
    
    if (!isNaN(parsedYear)) {
      this.selectedYear = parsedYear;
    }

    // Auto-advance to next year if we're past August
    const now = new Date();
    if (this.selectedYear === now.getFullYear() && now.getMonth() > 7) {
      this.selectedYear++;
    }
  }

  /**
   * Change the selected year and reload data
   */
  changeYear(value: string | number): void {
    const newYear = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!isNaN(newYear) && newYear > 1900 && newYear < 2200) {
      this.selectedYear = newYear;
      this.loadUtilization();
    }
  }

  /**
   * Handle include not confirmed toggle
   */
  changeIncludeNotConfirmed(): void {
    this.loadUtilization();
  }

  /**
   * Load utilization data from the API
   */
  private loadUtilization(): void {
    this.utilization = null; // Show loading state
    
    this.utilizationService
      .apiUtilizationYearGet(this.selectedYear, this.includeNotConfirmed)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (util) => {
          this.utilization = util;
          this.recalculateTargets(this.target);
        },
        error: (err) => {
          console.error('Failed to load utilization data:', err);
        }
      });
  }

  /**
   * Recalculate all target values based on new target percentage
   */
  recalculateTargets(value: string | number): void {
    const newTarget = typeof value === 'string' ? parseInt(value, 10) : value;
    
    if (isNaN(newTarget) || newTarget < 0 || newTarget > 100) {
      return;
    }
    
    this.target = newTarget;
    
    if (!this.utilization) return;

    // Process all utilization rows
    this.utilization.utilizationMonths?.forEach(row => this.calculateTargetForRow(row));
    this.utilization.utilizationQuarter?.forEach(row => this.calculateTargetForRow(row));
    this.utilization.utilizationHalf?.forEach(row => this.calculateTargetForRow(row));
    
    if (this.utilization.utilizationYear) {
      this.calculateTargetForRow(this.utilization.utilizationYear);
    }
  }

  /**
   * Calculate target metrics for a single utilization row
   */
  private calculateTargetForRow(row: UtilizationRow): void {
    const billableHours = row.billableHours ?? 0;
    const billedHours = row.billedHours ?? 0;
    
    row.toBeBilledHours = Number((billableHours * (this.target / 100)).toFixed(2));
    
    // Avoid division by zero
    row.target = row.toBeBilledHours > 0
      ? Number(((billedHours / row.toBeBilledHours) * 100).toFixed(2))
      : 0;
    
    row.daysToTarget = Number(((row.toBeBilledHours - billedHours) / HOURS_PER_DAY).toFixed(2));
  }

  /**
   * Get CSS class for billed hours cell based on target achievement
   */
  getBilledHoursClass(row: UtilizationRow): StatusClass {
    const billedHours = row.billedHours ?? 0;
    const toBeBilledHours = row.toBeBilledHours ?? 0;
    
    return billedHours < toBeBilledHours ? 'status-danger' : 'status-success-dark';
  }

  /**
   * Get CSS class for target cell based on achievement percentage
   */
  getTargetClass(row: UtilizationRow): StatusClass {
    const target = row.target ?? 0;
    
    if (target > 110) return 'status-success-dark';
    if (target > 100) return 'status-success';
    if (target > 70) return 'status-warning';
    return 'status-danger';
  }

  /**
   * Get CSS class for days to target cell
   */
  getDaysToTargetClass(row: UtilizationRow): StatusClass {
    const daysToTarget = row.daysToTarget ?? 0;
    
    return daysToTarget > 0 ? 'status-danger' : 'status-success-dark';
  }
}
