import {
  Component,
  OnInit,
  Input
} from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import {
  Utilization,
  UtilizationRow,
  UtilizationService
} from "../api/OrganizerApiClient";
import { DateTimeUtils } from '../utils/dateTimeUtils';

@Component({
    selector: "app-utilization",
    templateUrl: "./utilization.component.html",
    styleUrls: ["./utilization.component.scss"],
    standalone: false
})
export class UtilizationComponent implements OnInit {
  @Input()
  utilization: Utilization;

  public selectedYear: number;
  public target: number;
  public includeNotConfirmed: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilizationService: UtilizationService
  ) {
    this.target = 72;
  }

  ngOnInit() {
    this.selectedYear = Number.parseInt(this.route.snapshot.params["year?"]);
    var now = new Date();
    if (this.selectedYear == now.getFullYear() && now.getMonth() > 7) this.selectedYear++;
    this.getUtilization();
  }

  changeYear(value) {
    this.selectedYear = Number.parseInt(value);
    this.getUtilization();
  }

  changeIncludeNotConfirmed() {
    this.getUtilization();
  }

  getUtilization() {
    this.utilizationService
      .apiUtilizationYearGet(this.selectedYear, this.includeNotConfirmed)
      .subscribe(util => {
        this.utilization = util;
        this.recalculateTargets(this.target);
      });
  }

  recalculateTargets(value) {
    this.target = Number.parseInt(value);
    for (
      var i = 0, len = this.utilization.utilizationMonths.length;
      i < len;
      i++
    ) {
      this.calculateTarget(this.utilization.utilizationMonths[i]);
    }
    for (
      var i = 0, len = this.utilization.utilizationQuarter.length;
      i < len;
      i++
    ) {
      this.calculateTarget(this.utilization.utilizationQuarter[i]);
    }
    for (
      var i = 0, len = this.utilization.utilizationHalf.length;
      i < len;
      i++
    ) {
      this.calculateTarget(this.utilization.utilizationHalf[i]);
    }
    this.calculateTarget(this.utilization.utilizationYear);
  }

  calculateTarget(util: UtilizationRow) {
    util.toBeBilledHours = Number(
      (util.billableHours * (this.target / 100)).toFixed(2)
    );
    util.target = Number(
      ((util.billedHours / util.toBeBilledHours) * 100).toFixed(2)
    );
    util.daysToTarget = Number(
      ((util.toBeBilledHours - util.billedHours) / 8).toFixed(2)
    );
  }

  getBilledHoursClass(util: UtilizationRow): String {
    if (util.billedHours < util.toBeBilledHours) {
      return 'red-cell';
    } else {
      return 'dark-green-cell';
    }
  }

  getTargetClass(util: UtilizationRow): String {
    if (util.target > 110) {
      return 'dark-green-cell';
    } else if (util.target > 100 && util.target < 110) {
      return 'green-cell';
    } else if (util.target > 70 && util.target < 100) {
      return 'yellow-cell';
    } else {
      return 'red-cell';
    }
  }

  getDaysToTargetClass(util: UtilizationRow): String {
    if (util.daysToTarget > 0) {
      return 'red-cell';
    } else {
      return 'dark-green-cell';
    }
  }
}
