using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EngagementOrganizer.API.Models
{
    public class AppointmentType
    {
        public int ID { get; set; }

        public string Description { get; set; }

        public bool Billable { get; set; }

        public bool RequireCustomer { get; set; }

        public string Color { get; set; }

        public string TextColor { get; set; }

        public string ShortDescription { get; set; }
    }
}
