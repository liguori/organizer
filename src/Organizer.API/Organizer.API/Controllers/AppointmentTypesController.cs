using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Organizer.API.Infrastructure;
using Organizer.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace Organizer.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentTypesController : ControllerBase
    {
        private readonly OrganizerContext _context;

        public AppointmentTypesController(OrganizerContext context)
        {
            _context = context;
        }

        // GET: api/AppointmentTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentType>>> GetAppointmentTypes(CancellationToken cancellationToken)
        {
            return await _context.AppointmentType.ToListAsync(cancellationToken);
        }

        // GET: api/AppointmentTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentType>> GetAppointmentType(int id, CancellationToken cancellationToken)
        {
            var appointmentType = await _context.AppointmentType.FindAsync(new object[] { id }, cancellationToken);

            if (appointmentType == null)
            {
                return NotFound();
            }

            return appointmentType;
        }

        // PUT: api/AppointmentTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointmentType(int id, AppointmentType appointmentType, CancellationToken cancellationToken)
        {
            if (id != appointmentType.ID)
            {
                return BadRequest();
            }

            _context.Entry(appointmentType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentTypeExists(id))
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

        // POST: api/AppointmentTypes
        [HttpPost]
        public async Task<ActionResult<AppointmentType>> PostAppointmentType(AppointmentType appointmentType, CancellationToken cancellationToken)
        {
            _context.AppointmentType.Add(appointmentType);
            await _context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction("GetAppointmentType", new { id = appointmentType.ID }, appointmentType);
        }

        // DELETE: api/AppointmentTypes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<AppointmentType>> DeleteAppointmentType(int id, CancellationToken cancellationToken)
        {
            var appointmentType = await _context.AppointmentType.FindAsync(new object[] { id }, cancellationToken);
            if (appointmentType == null)
            {
                return NotFound();
            }

            _context.AppointmentType.Remove(appointmentType);
            await _context.SaveChangesAsync(cancellationToken);

            return appointmentType;
        }

        private bool AppointmentTypeExists(int id)
        {
            return _context.AppointmentType.Any(e => e.ID == id);
        }
    }
}
