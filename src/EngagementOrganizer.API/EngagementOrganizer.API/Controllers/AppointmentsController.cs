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

namespace EngagementOrganizer.API.Controllers
{
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
            var appList = await appointment.OrderBy(x=>x.StartDate).ToListAsync();
            var appointmentList = _mapper.Map<List<AppointmentExtraInfo>>(appList);
            _warningChecker.PerformCheck(appointmentList);
            return appointmentList;
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
