using EngagementOrganizer.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EngagementOrganizer.API.Services.Abstract
{
    public interface IWarningChecker
    {
        void PerformCheck(List<AppointmentExtraInfo> appList);
    }
}
