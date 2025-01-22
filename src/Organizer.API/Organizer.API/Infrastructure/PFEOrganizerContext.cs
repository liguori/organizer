using Organizer.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Organizer.API.Infrastructure
{
    public class OrganizerContext : DbContext
    {
        public OrganizerContext(DbContextOptions<OrganizerContext> options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AppointmentType>().HasData(
                 new AppointmentType { ID = 1, Description = "Delivery", Billable = true, RequireCustomer = true },
                 new AppointmentType { ID = 2, Description = "Sickness", Billable = true, RequireCustomer = false, Color = "#ffe95b", TextColor = "#000000", ShortDescription = "SICK" },
                 new AppointmentType { ID = 3, Description = "Shadowing", Billable = false, RequireCustomer = true },
                 new AppointmentType { ID = 4, Description = "Holiday", Billable = false, RequireCustomer = false, Color = "#cecece", TextColor = "#000000", ShortDescription = "H" },
                 new AppointmentType { ID = 5, Description = "National Celebration", Billable = false, RequireCustomer = false, Color = "#efb8b8", TextColor = "#000000", ShortDescription = "CEL" },
                 new AppointmentType { ID = 6, Description = "Company Event", Billable = false, RequireCustomer = false, Color = "#3087c1", TextColor = "#ffffff", ShortDescription = "COM" },
                 new AppointmentType { ID = 7, Description = "Blocker", Billable = false, RequireCustomer = false, Color = "#97ff8c", TextColor = "#000000", ShortDescription = "B" },
                 new AppointmentType { ID = 8, Description = "Concert", Billable = false, RequireCustomer = false, Color = "#ffa200", TextColor = "#000000", ShortDescription = "CON" },
                 new AppointmentType { ID = 9, Description = "Travel", Billable = false, RequireCustomer = false, Color = "#4b8773", TextColor = "#FFFFFF", ShortDescription = "TRV" },
                 new AppointmentType { ID = 99, Description = "Upstream Calendar", Billable = true, RequireCustomer = false, Color = "#0000ff", TextColor = "#ffffff", ShortDescription = "Upstream" }
            );
            modelBuilder.Entity<Calendar>().HasKey(x => x.CalendarName);
        }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<AppointmentType> AppointmentType { get; set; }

        public DbSet<Calendar> Calendars { get; set; }
    }
}
