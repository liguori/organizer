using AutoMapper;
using EngagementOrganizer.API.Authentication;
using EngagementOrganizer.API.Infrastructure;
using EngagementOrganizer.API.Services;
using EngagementOrganizer.API.Services.Abstract;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Reflection;

namespace EngagementOrganizer.API
{
    public class Startup
    {
        const string ApiKeys = "ApiKeys";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();


            // Add the ApiKey Authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = ApiKeyAuthOptions.ApiKeySchemaName;
                options.DefaultChallengeScheme = ApiKeyAuthOptions.ApiKeySchemaName;
            })
            .AddApiKeyAuth(options => options.AuthKeys = Configuration[ApiKeys].Split(","));

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Engagement Organizer", Version = "v1" });
                //Add API Key Informations
                c.AddSecurityDefinition(ApiKeyAuthOptions.ApiKeySchemaName, new OpenApiSecurityScheme
                {
                    Description = "Api key needed to access the endpoints. " + ApiKeyAuthOptions.HeaderName + ": My_API_Key",
                    In = ParameterLocation.Header,
                    Name = ApiKeyAuthOptions.HeaderName,
                    Type = SecuritySchemeType.ApiKey
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Name = ApiKeyAuthOptions.HeaderName,
                            Type = SecuritySchemeType.ApiKey,
                            In = ParameterLocation.Header,
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = ApiKeyAuthOptions.ApiKeySchemaName
                            },
                         },
                         new string[] {}
                     }
                });
            });

            services.AddDbContext<EngagementOrganizerContext>(
                options => options.UseSqlite($"Data Source={Configuration["DatabasePath"]}", sqlOpt =>
                {
                    sqlOpt.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
                })
               );

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigin",
                builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });


            // Auto Mapper Configurations
            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });
            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);

            services.AddTransient<IWarningChecker, WarningChecker>();
            services.AddTransient<IUpstreamApiAppointments, UpstreamApiAppointments>();
            services.AddHttpClient();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostEnvironment env, EngagementOrganizerContext context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
            }

            context.Database.EnsureCreated();

            app.UseCors("AllowAllOrigin");

            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "EngagementOrganizer API V1");
            });

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
