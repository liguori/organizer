using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Organizer.API.Models
{
    public class UpstreamAppointment
    {
        public int ID { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CustomerShortDescription { get; set; }
        public bool Billable { get; set; }
        public string SourceCalendar { get; set; }
        public bool HasWarning { get; set; }
    }
}
