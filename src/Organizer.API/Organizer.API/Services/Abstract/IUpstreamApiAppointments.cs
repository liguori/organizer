using Organizer.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Organizer.API.Services.Abstract
{
    public interface IUpstreamApiAppointments
    {
        Task AddUpstreamAppointmentsAsync(List<AppointmentExtraInfo> appList, int? year, string calendarName,CalendarDisplay display, string upstreamCustomTokenInput);
    }
}
