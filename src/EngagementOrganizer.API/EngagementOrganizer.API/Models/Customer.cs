using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EngagementOrganizer.API.Models
{
    public class Customer
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string ShortDescription { get; set; }

        public string Color { get; set; }

        public string TextColor { get; set; }
        
        public string ProjectColors { get; set; }

        public string Referral { get; set; }

        public string Address{ get; set; }

        public string Note{ get; set; }
    }
}
