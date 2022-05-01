using Organizer.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Organizer.API.Services.Abstract
{
    public interface IWarningChecker
    {
        void PerformCheck(List<AppointmentExtraInfo> appList);
    }
}
