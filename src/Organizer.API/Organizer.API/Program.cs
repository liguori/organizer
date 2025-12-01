using AutoMapper;
using Organizer.API.Authentication;
using Organizer.API.Infrastructure;
using Organizer.API.Services;
using Organizer.API.Services.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Organizer.API.OpenApi;

const string ApiKeys = "ApiKeys";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<DocumentSecuritySchemeTransformer>();
    options.AddOperationTransformer<OperationSecurityTransformer>();
});

// Add the ApiKey Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = ApiKeyAuthOptions.ApiKeySchemaName;
    options.DefaultChallengeScheme = ApiKeyAuthOptions.ApiKeySchemaName;
})
.AddApiKeyAuth(options => options.AuthKeys = builder.Configuration[ApiKeys].Split(","));

builder.Services.AddDbContext<OrganizerContext>(
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

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

builder.Services.AddTransient<IWarningChecker, WarningChecker>();
builder.Services.AddTransient<IUpstreamApiAppointments, UpstreamApiAppointments>();
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(c => c.SwaggerEndpoint("/openapi/v1.json", "Organizer API"));
    app.UseDeveloperExceptionPage();
}

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<OrganizerContext>()?.Database.EnsureCreated();
}

app.UseCors("AllowAllOrigin");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
