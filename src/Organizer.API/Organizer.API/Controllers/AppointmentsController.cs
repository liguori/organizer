using AutoMapper;
using Organizer.API.Infrastructure;
using Organizer.API.Models;
using Organizer.API.Services.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace Organizer.API.Controllers
{
    [Authorize()]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly OrganizerContext _context;
        private readonly IMapper _mapper;
        private readonly IWarningChecker _warningChecker;
        private readonly IUpstreamApiAppointments _upstreamAppointments;
        public readonly IConfiguration _configuration;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(OrganizerContext context, IMapper mapper, IWarningChecker warningChecker, IConfiguration configuration, IUpstreamApiAppointments upstreamAppointment, ILogger<AppointmentsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _warningChecker = warningChecker;
            _configuration = configuration;
            _upstreamAppointments = upstreamAppointment;
            _logger = logger;
        }

        // GET: api/Appointments/Backup
        [HttpGet("Backup")]
        public async Task<ActionResult> GetBackup()
        {
            return File(await System.IO.File.ReadAllBytesAsync(_configuration["DatabasePath"]), "application/octet-stream", "Database.db");
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentExtraInfo>>> GetAppointments(int? year, string calendarName, CalendarDisplay display, [FromHeader] string upstreamCustomTokenInput)
        {
            var stopwatch = Stopwatch.StartNew();
            
            var appointment = _context.Appointments.Include(x => x.Customer).Include(x => x.Type).AsQueryable();
            if (year.HasValue) appointment = appointment.Where(x => x.StartDate.Year == year);
            if (display == CalendarDisplay.Event || (display == CalendarDisplay.Calendar && !string.IsNullOrWhiteSpace(calendarName)))
            {
                if (!string.IsNullOrWhiteSpace(calendarName))
                    appointment = appointment.Where(x => x.CalendarName == calendarName);
                else
                    appointment = appointment.Where(x => x.CalendarName == "" || x.CalendarName == null);
            }
            
            var dbQueryTime = Stopwatch.StartNew();
            var appList = await appointment.OrderBy(x => x.StartDate).ToListAsync();
            dbQueryTime.Stop();
            _logger.LogInformation("DB query time: {DbQueryMs}ms for {AppointmentCount} appointments", dbQueryTime.ElapsedMilliseconds, appList.Count);
            
            var mapTime = Stopwatch.StartNew();
            var appointmentList = _mapper.Map<List<AppointmentExtraInfo>>(appList);
            mapTime.Stop();
            _logger.LogInformation("Mapping time: {MapMs}ms", mapTime.ElapsedMilliseconds);
            
            var warningTime = Stopwatch.StartNew();
            _warningChecker.PerformCheck(appointmentList);
            warningTime.Stop();
            _logger.LogInformation("Warning check time: {WarningMs}ms", warningTime.ElapsedMilliseconds);
            
            var upstreamTime = Stopwatch.StartNew();
            await _upstreamAppointments.AddUpstreamAppointmentsAsync(appointmentList, year, calendarName, display, upstreamCustomTokenInput);
            upstreamTime.Stop();
            _logger.LogInformation("Upstream appointments time: {UpstreamMs}ms", upstreamTime.ElapsedMilliseconds);
            
            var colorTime = Stopwatch.StartNew();
            SetProjectColor(appointmentList);
            colorTime.Stop();
            _logger.LogInformation("SetProjectColor time: {ColorMs}ms", colorTime.ElapsedMilliseconds);
            
            stopwatch.Stop();
            _logger.LogInformation("Total GetAppointments time: {TotalMs}ms for year={Year}, calendarName={CalendarName}, display={Display}", 
                stopwatch.ElapsedMilliseconds, year, calendarName, display);
            
            return appointmentList;
        }

        // GET: api/Appointments/calendars
        [HttpGet("calendars")]
        public async Task<ActionResult<IEnumerable<Calendar>>> GetCalendars()
        {
            return await _context.Calendars.ToListAsync();
        }

        // GET: api/Appointments/calendar/calendarName
        [HttpGet("calendar/{calendarName}")]
        public async Task<ActionResult<Calendar>> GetAppointment(string calendarName)
        {
            var calendar = await _context.Calendars.FirstOrDefaultAsync(x => x.CalendarName == calendarName);

            if (calendar == null)
            {
                return NotFound();
            }

            return calendar;
        }


        // DELETE: api/calendar/{calendarname}
        [HttpDelete("calendar/{calendarName}")]
        public async Task<ActionResult<Calendar>> DeleteCalendar(string calendarName)
        {
            var calendar = await _context.Calendars.FirstOrDefaultAsync(x => x.CalendarName == calendarName);
            if (calendar == null)
            {
                return NotFound();
            }

            _context.Calendars.Remove(calendar);
            await _context.SaveChangesAsync();

            return calendar;
        }

        // POST: api/calendar/
        [HttpPost("calendar")]
        public async Task<IActionResult> PostCalendar(Calendar calendar)
        {
            var currentCalendar = await _context.Calendars.FirstOrDefaultAsync(x => x.CalendarName == calendar.CalendarName);
            if (currentCalendar == null)
            {
                _context.Calendars.Add(calendar);
                await _context.SaveChangesAsync();
            }
            return Ok(calendar);
        }

        // PUT: api/calendar/calendarName
        [HttpPut("calendar/{calendarName}")]
        public async Task<IActionResult> PutCalendar(string calendarName, Calendar calendar)
        {
            if (calendarName != calendar.CalendarName)
            {
                return BadRequest();
            }
            _context.Entry(calendar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CalendarExists(calendarName))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // GET: api/Appointments/upstreamCustomToken
        [HttpGet("upstreamCustomToken")]
        public async Task<ActionResult<bool>> GetAppointmentsUpstreamCustomToken()
        {
            return _configuration.GetValue<bool>(ConfigurationValues.UpstreamApiCustomTokenInput);
        }

        void SetProjectColor(List<AppointmentExtraInfo> appList)
        {
            // Pre-compute customer projects and colors to avoid repeated LINQ queries in the loop
            var customerProjectsDict = appList
                .Where(x => !string.IsNullOrWhiteSpace(x.Project) && x.CustomerID.HasValue)
                .GroupBy(x => x.CustomerID.Value)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(x => x.Project).Distinct().ToList()
                );

            var customerColorsDict = appList
                .Where(x => !string.IsNullOrWhiteSpace(x.Project) && x.CustomerID.HasValue && x.Customer?.ProjectColors != null)
                .GroupBy(x => x.CustomerID.Value)
                .ToDictionary(
                    g => g.Key,
                    g => g.First().Customer?.ProjectColors?.Split(";")
                );

            var appListToSetProjectColors = appList.Where(x => !string.IsNullOrWhiteSpace(x.Project) && x.CustomerID.HasValue);
            
            foreach (var currentAppointmentToSetProjectColor in appListToSetProjectColors)
            {
                var customerId = currentAppointmentToSetProjectColor.CustomerID.Value;
                
                if (customerProjectsDict.TryGetValue(customerId, out var currentCustomerProjects) &&
                    customerColorsDict.TryGetValue(customerId, out var currentCustomerColors))
                {
                    for (int i = 0; i < currentCustomerProjects.Count; i++)
                    {
                        if (currentAppointmentToSetProjectColor.Project == currentCustomerProjects[i] && 
                            currentCustomerColors?.Length > i)
                        {
                            currentAppointmentToSetProjectColor.ProjectColor = currentCustomerColors[i];
                            break;
                        }
                    }
                }
            }
        }

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // PUT: api/Appointments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        {
            if (id != appointment.ID)
            {
                return BadRequest();
            }
            appointment.StartDate = appointment.StartDate.Date;
            appointment.EndDate = appointment.EndDate.Date;
            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
        {
            appointment.StartDate = appointment.StartDate.Date;
            appointment.EndDate = appointment.EndDate.Date;
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointment", new { id = appointment.ID }, appointment);
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Appointment>> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return appointment;
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.ID == id);
        }

        private bool CalendarExists(string name)
        {
            return _context.Calendars.Any(e => e.CalendarName == name);
        }
    }
}
