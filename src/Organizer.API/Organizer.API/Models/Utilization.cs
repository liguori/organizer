using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Organizer.API.Models
{
    public class Utilization
    {
        public List<UtilizationRow> UtilizationMonths { get; set; }

        public List<UtilizationRow> UtilizationQuarter { get; set; }

        public List<UtilizationRow> UtilizationHalf { get; set; }

        public UtilizationRow UtilizationYear {get; set;}
    }

    public class UtilizationRow
    {
        public int MonthNumber { get; set; }
        public string Description { get; set; }

        public double BillableHours { get; set; }

        public int ToBeBilledHours { get; set; }

        public double BilledHours { get; set; }

        public double PercentageBilledHours
        {
            get
            {
                if (BillableHours == 0) return 0;
                return Math.Round((BilledHours / BillableHours) * 100, 2);
            }
        }

        public int Target { get; set; }

        public int DaysToTarget { get; set; }
    }
}
