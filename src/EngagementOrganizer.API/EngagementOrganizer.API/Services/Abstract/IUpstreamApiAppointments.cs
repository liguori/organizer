using EngagementOrganizer.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EngagementOrganizer.API.Services.Abstract
{
    public interface IUpstreamApiAppointments
    {
        Task AddUpstreamAppointmentsAsync(List<AppointmentExtraInfo> appList, int? year, string calendarName, string upstreamCustomTokenInput);
    }
}
