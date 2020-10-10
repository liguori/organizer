using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EngagementOrganizer.API.Infrastructure;
using EngagementOrganizer.API.Models;
using EngagementOrganizer.API.Services.Abstract;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Authorization;

namespace EngagementOrganizer.API.Controllers
{
    [Authorize()]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly EngagementOrganizerContext _context;
        private readonly IMapper _mapper;
        private readonly IWarningChecker _warningChecker;

        public AppointmentsController(EngagementOrganizerContext context, IMapper mapper, IWarningChecker warningChecker)
        {
            _context = context;
            _mapper = mapper;
            _warningChecker = warningChecker;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentExtraInfo>>> GetAppointments(int? year)
        {
            var appointment = _context.Appointments.Include(x => x.Customer).Include(x => x.Type).AsQueryable();
            if (year.HasValue) appointment = appointment.Where(x => x.StartDate.Year == year);
            var appList = await appointment.OrderBy(x => x.StartDate).ToListAsync();
            var appointmentList = _mapper.Map<List<AppointmentExtraInfo>>(appList);
            _warningChecker.PerformCheck(appointmentList);
            SetProjectColor(appointmentList);
            return appointmentList;
        }


        void SetProjectColor(List<AppointmentExtraInfo> appList)
        {
            var customerProjects = appList.Where(x => !string.IsNullOrWhiteSpace(x.Project) && x.CustomerID.HasValue)
                                      .Select(x => new { CustomerID = x.CustomerID.Value, x.Project })
                                      .GroupBy(x => new { x.CustomerID, x.Project })
                                      .GroupBy(x => x.Key.CustomerID);


            var customerColors = appList.Where(x => !string.IsNullOrWhiteSpace(x.Project) && x.CustomerID.HasValue)
                                      .Select(x => new { x.CustomerID, Colors = x?.Customer?.ProjectColors?.Split(";") })
                                      .GroupBy(x => x.CustomerID);

            var appListToSetProjectColors = appList.Where(x => !string.IsNullOrWhiteSpace(x.Project) && x.CustomerID.HasValue);
            foreach (var currentAppointmentToSetProjectColor in appListToSetProjectColors)
            {
                var currentCustomerProjects = customerProjects.Where(x => x.Key == currentAppointmentToSetProjectColor.CustomerID).First().ToList().Select(x => x.Key.Project).ToList();
                var currentCustomerColors = customerColors.Where(x => x.Key == currentAppointmentToSetProjectColor.CustomerID).First().ToList().Select(x => x.Colors).ToList().First();

                for (int i = 0; i < currentCustomerProjects.Count; i++)
                {
                    if (currentAppointmentToSetProjectColor.Project == currentCustomerProjects[i] && currentCustomerColors?.Length > i)
                    {
                        currentAppointmentToSetProjectColor.ProjectColor = currentCustomerColors[i];
                        break;
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
    }
}
