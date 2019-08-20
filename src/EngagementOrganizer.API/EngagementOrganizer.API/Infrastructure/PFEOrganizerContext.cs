using Microsoft.EntityFrameworkCore;
using EngagementOrganizer.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace EngagementOrganizer.API.Infrastructure
{
    public class EngagementOrganizerContext : DbContext
    {
        public EngagementOrganizerContext(DbContextOptions<EngagementOrganizerContext> options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        public DbSet<Customer> Customers { get; set; }


        public DbSet<Appointment> Appointments { get; set; }


        public DbSet<EngagementOrganizer.API.Models.AppointmentType> AppointmentType { get; set; }
    }
}
