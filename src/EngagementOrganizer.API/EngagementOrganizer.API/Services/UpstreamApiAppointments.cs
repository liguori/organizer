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
        private string[] Colors = new[] { "#7e29a3", "#273b84", "#ffa200", "#eff542", "#4287f5", "#d95255", "#4b8773", "#694226", "#52db09", "#7641f2", "#f27341" };
        private string[] TextColors = new[] { "#FFFFFF", "#FFFFFF", "#000000", "#343e85", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF" };

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
                var colorCombination = new Dictionary<string, (string color, string textColor)>();
                var countColor = 0;
                foreach (var ele in res)
                {
                    var colorHex = "";
                    var textColorHex = "";
                    var matchedCustomer = customers.Where(x => x.ShortDescription.Equals(ele.CustomerShortDescription.Split(new[] { '\r', '\n' }).FirstOrDefault(), StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
                    if (colorCombination.ContainsKey(ele.CustomerShortDescription.ToLower().Trim()))
                    {
                        var currentCombinationToUse = colorCombination[ele.CustomerShortDescription.ToLower().Trim()];
                        colorHex = currentCombinationToUse.color;
                        textColorHex = currentCombinationToUse.textColor;
                    }
                    else
                    {
                        colorHex = Colors[countColor];
                        textColorHex = TextColors[countColor];
                        colorCombination.Add(ele.CustomerShortDescription.ToLower().Trim(), (colorHex, textColorHex));
                        countColor++;
                        if (countColor >= Colors.Length) countColor = 0;
                    }


                    appList.Add(new AppointmentExtraInfo
                    {
                        ID = ele.ID,
                        StartDate = ele.StartDate.Date,
                        EndDate = ele.EndDate.Date,
                        Customer = matchedCustomer ?? new Customer { ShortDescription = ele.CustomerShortDescription, Color = colorHex, TextColor = textColorHex },
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
