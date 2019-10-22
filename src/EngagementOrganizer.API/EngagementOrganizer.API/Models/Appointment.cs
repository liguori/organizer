using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EngagementOrganizer.API.Models
{
    public class Appointment
    {
        public int ID { get; set; }

        public Customer Customer { get; set; }

        public int? CustomerID { get; set; }

        public AppointmentType Type { get; set; }

        public string Project { get; set; }

        public int TypeID { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Note { get; set; }

        public bool Confirmed { get; set; }

        public bool RequireTravel { get; set; }

        public bool TravelBooked { get; set; }
    }
}
