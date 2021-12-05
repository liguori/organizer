using AutoMapper;
using EngagementOrganizer.API.Authentication;
using EngagementOrganizer.API.Infrastructure;
using EngagementOrganizer.API.Services;
using EngagementOrganizer.API.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

const string ApiKeys = "ApiKeys";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
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

// Add the ApiKey Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = ApiKeyAuthOptions.ApiKeySchemaName;
    options.DefaultChallengeScheme = ApiKeyAuthOptions.ApiKeySchemaName;
})
.AddApiKeyAuth(options => options.AuthKeys = builder.Configuration[ApiKeys].Split(","));

builder.Services.AddDbContext<EngagementOrganizerContext>(
                options => options.UseSqlite($"Data Source={builder.Configuration["DatabasePath"]}", sqlOpt =>
                {
                    sqlOpt.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
                })
               );

builder.Services.AddCors(options =>
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
builder.Services.AddSingleton(mapper);

builder.Services.AddTransient<IWarningChecker, WarningChecker>();
builder.Services.AddTransient<IUpstreamApiAppointments, UpstreamApiAppointments>();
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<EngagementOrganizerContext>()?.Database.EnsureCreated();
}

app.UseCors("AllowAllOrigin");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
