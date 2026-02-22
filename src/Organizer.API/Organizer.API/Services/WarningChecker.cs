using Organizer.API.Models;
using Organizer.API.Services.Abstract;
using System;
using System.Collections.Generic;

namespace Organizer.API.Services
{
    public class WarningChecker : IWarningChecker
    {
        const int DayLeftToCheck = 10;

        public void PerformCheck(List<AppointmentExtraInfo> appList)
        {
            foreach (var app in appList)
            {
                if ((app.StartDate - DateTime.Now).Days < DayLeftToCheck)
                {
                    if (!app.Confirmed)
                    {
                        app.Warning = true;
                        app.WarningDescription += "Waiting for confirmation. ";
                    }
                    if(app.RequireTravel && !app.TravelBooked)
                    {
                        app.Warning = true;
                        app.WarningDescription += "Travel not booked. ";
                    }
                }
            }
        }
    }
}
