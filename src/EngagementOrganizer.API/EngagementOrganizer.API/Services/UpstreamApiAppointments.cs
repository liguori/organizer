using EngagementOrganizer.API.Infrastructure;
using EngagementOrganizer.API.Models;
using EngagementOrganizer.API.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace EngagementOrganizer.API.Services
{
    public class UpstreamApiAppointments : IUpstreamApiAppointments
    {
        private readonly EngagementOrganizerContext _context;
        private const string UpstreamApiKeyHeaderName = "X-API-Key";
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UpstreamApiAppointments> _logger;
        public UpstreamApiAppointments(EngagementOrganizerContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<UpstreamApiAppointments> logger)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task AddUpstreamAppointmentsAsync(List<AppointmentExtraInfo> appList, int? year, string calendarName, string upstreamCustomTokenInput)
        {
            try
            {
                if (!year.HasValue) return;
                var upstreamApi = _configuration[ConfigurationValues.UpstreamApiUrl];
                var httpClient = _httpClientFactory.CreateClient();

                if (_configuration.GetValue<bool>(ConfigurationValues.UpstreamApiCustomTokenInput))
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", upstreamCustomTokenInput);
                }
                if (!string.IsNullOrWhiteSpace(_configuration[ConfigurationValues.UpstreamApiKey]))
                {
                    httpClient.DefaultRequestHeaders.Add(UpstreamApiKeyHeaderName, _configuration[ConfigurationValues.UpstreamApiKey]);
                }

                var res = await httpClient.GetFromJsonAsync<IEnumerable<UpstreamAppointment>>(upstreamApi + $"?year={year}&calendarName={calendarName}");

                var customers = await _context.Customers.ToListAsync();

                foreach (var ele in res)
                {
                    var matchedCustomer = customers.Where(x => x.ShortDescription.Equals(ele.CustomerShortDescription, StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();

                    appList.Add(new AppointmentExtraInfo
                    {
                        ID = ele.ID,
                        StartDate = ele.StartDate.Date,
                        EndDate = ele.EndDate.Date,
                        Customer = matchedCustomer ?? new Customer { ShortDescription = ele.CustomerShortDescription },
                        Note = ele.Description,
                        IsFromUpstream = true,
                        TypeID = 99,
                        Type = new AppointmentType { ID = 99, Billable = true, RequireCustomer = true },
                        Confirmed = true
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }
    }
}
