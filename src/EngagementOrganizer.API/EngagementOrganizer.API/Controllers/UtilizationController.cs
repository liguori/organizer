using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EngagementOrganizer.API.Infrastructure;
using EngagementOrganizer.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace EngagementOrganizer.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UtilizationController : ControllerBase
    {
        private readonly EngagementOrganizerContext _context;
        private readonly ILogger _logger;

        public UtilizationController(EngagementOrganizerContext context, ILogger<UtilizationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Utilization
        [HttpGet]
        public async Task<ActionResult<Utilization>> GetUtilization()
        {
            return await GetUtilization(DateTime.Now.Year);
        }

        // GET: api/Customers/5
        [HttpGet("{year}")]
        public async Task<ActionResult<Utilization>> GetUtilization(int year)
        {
            var DateStart = new DateTime(year - 1, 7, 1);
            var DateEnd = new DateTime(year, 6, 30);
            var appointments = _context.Appointments.Where(a => a.Confirmed == true && a.Type.Billable == true && a.EndDate >= DateStart && a.StartDate <= DateEnd).ToList();
            var utilization = new Utilization()
            {
                UtilizationMonths = new List<UtilizationRow>(),
                UtilizationQuarter = new List<UtilizationRow>(),
                UtilizationHalf = new List<UtilizationRow>()
            };
            var FY_month = 1;
            while (DateStart < DateEnd)
            {

                var daysInMonth = DateTime.DaysInMonth(DateStart.Year, DateStart.Month);
                _logger.LogInformation($"Month: {DateStart.ToString("MMM")} DaysInMonth: {daysInMonth}");
                var countAppointment = 0;
                var workerDays = 0;
                for (int i = 1; i <= daysInMonth; i++)
                {
                    var currentDate = new DateTime(DateStart.Year, DateStart.Month, i);
                    if (currentDate.DayOfWeek != DayOfWeek.Sunday && currentDate.DayOfWeek != DayOfWeek.Saturday)
                    {
                        countAppointment = countAppointment + appointments.Where(a =>
                            (a.EndDate >= currentDate && a.StartDate <= currentDate)
                        ).Count();
                        workerDays++;
                    }
                    _logger.LogInformation($"Day: {currentDate.ToString("dd/MM/yyyy")} BillableDays: {countAppointment}");

                }
                _logger.LogInformation($"Month: {DateStart.ToString("MMM")} Billable: {workerDays * 8}h BIlled: {countAppointment * 8}h");
                UtilizationRow monthUtil = new UtilizationRow()
                {
                    MonthNumber = FY_month,
                    Description = DateStart.ToString("MMM"),
                    BillableHours = workerDays * 8,
                    BilledHours = countAppointment * 8
                };

                utilization.UtilizationMonths.Add(monthUtil);

                if (FY_month % 3 == 0)
                {
                    UtilizationRow quarterUtil = new UtilizationRow()
                    {
                        Description = $"Q{FY_month / 3}",
                        BillableHours = utilization.UtilizationMonths.Where(u => u.MonthNumber <= FY_month && u.MonthNumber > FY_month - 3).Sum(u => u.BillableHours),
                        BilledHours = utilization.UtilizationMonths.Where(u => u.MonthNumber <= FY_month && u.MonthNumber > FY_month - 3).Sum(u => u.BilledHours)
                    };
                    utilization.UtilizationQuarter.Add(quarterUtil);
                }
                if (FY_month % 6 == 0)
                {
                    UtilizationRow halfUtil = new UtilizationRow()
                    {
                        Description = $"H{FY_month / 6}",
                        BillableHours = utilization.UtilizationMonths.Where(u => u.MonthNumber <= FY_month && u.MonthNumber > FY_month - 6).Sum(u => u.BillableHours),
                        BilledHours = utilization.UtilizationMonths.Where(u => u.MonthNumber <= FY_month && u.MonthNumber > FY_month - 6).Sum(u => u.BilledHours)
                    };
                    utilization.UtilizationHalf.Add(halfUtil);
                }

                DateStart = DateStart.AddMonths(1);
                FY_month++;
            }

            utilization.UtilizationYear = new UtilizationRow()
            {
                Description = $"FY{year}",
                BillableHours = utilization.UtilizationMonths.Sum(u => u.BillableHours),
                BilledHours = utilization.UtilizationMonths.Sum(u => u.BilledHours)
            };

            return utilization;
        }


    }
}
