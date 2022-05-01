using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Organizer.API.Authentication
{
    public static class AuthenticationBuilderExtensions
    {
        public static AuthenticationBuilder AddApiKeyAuth(this AuthenticationBuilder builder, Action<ApiKeyAuthOptions> configureOptions)
        {
            return builder.AddScheme<ApiKeyAuthOptions, CustomAuthHandler>(ApiKeyAuthOptions.ApiKeySchemaName, configureOptions);
        }
    }

    public class ApiKeyAuthOptions : AuthenticationSchemeOptions
    {
        public const string ApiKeySchemaName = "ApiKeyAuthentication";
        public StringValues AuthKeys { get; set; }
        public const string HeaderName = "X-API-Key";
    }

    public class CustomAuthHandler : AuthenticationHandler<ApiKeyAuthOptions>
    {
        public CustomAuthHandler(IOptionsMonitor<ApiKeyAuthOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            StringValues authorization;
            if (!Request.Headers.TryGetValue(ApiKeyAuthOptions.HeaderName, out authorization))
            {
                if (!Request.Query.TryGetValue(ApiKeyAuthOptions.HeaderName, out authorization))
                {
                    return Task.FromResult(AuthenticateResult.Fail("Cannot read authorization header."));
                }
            }
            if ((authorization).Any(key => Options.AuthKeys.All(ak => ak != key)))
            {
                return Task.FromResult(AuthenticateResult.Fail("Invalid auth key."));
            }
            var identities = new List<ClaimsIdentity> { new ClaimsIdentity("CutomApiKeyAuthenticatedApp") };
            var ticket = new AuthenticationTicket(new ClaimsPrincipal(identities), ApiKeyAuthOptions.ApiKeySchemaName);
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
