# Organizer.AppHost

This is the .NET Aspire AppHost project that orchestrates the Organizer API and SPA applications.

## Overview

.NET Aspire provides a cloud-ready stack for building observable, production-ready distributed applications. This AppHost project:

- Orchestrates the Organizer.API (ASP.NET Core Web API)
- Orchestrates the Organizer.SPA (Angular application)
- Provides a unified dashboard for monitoring and observability
- Configures service discovery and health checks
- Enables OpenTelemetry for distributed tracing

## Prerequisites

- .NET 10 SDK
- Node.js 20 or higher
- npm (comes with Node.js)

## Running the Application

From the `src/Organizer.AppHost` directory:

```bash
dotnet run
```

Or from the `src` directory:

```bash
dotnet run --project Organizer.AppHost
```

## Accessing the Application

After running the AppHost, you'll see output similar to:

```
info: Aspire.Hosting.DistributedApplication[0]
      Aspire version: 13.1.0
info: Aspire.Hosting.DistributedApplication[0]
      Distributed application starting.
info: Aspire.Hosting.DistributedApplication[0]
      Application host directory is: /path/to/src/Organizer.AppHost
info: Aspire.Hosting.DistributedApplication[0]
      Now listening on: https://localhost:17256
```

### Aspire Dashboard

Access the Aspire Dashboard at the URL shown in the console output (typically `https://localhost:17256`). The dashboard provides:

- Real-time view of all services
- Resource metrics and health status
- Distributed tracing with OpenTelemetry
- Logs from all services
- Environment variables and configuration

### API

The Organizer.API will be available at the endpoint shown in the dashboard (typically on a random port assigned by Aspire).

### SPA

The Organizer.SPA (Angular application) will be available on port 4200: `http://localhost:4200`

## Project Structure

- `Program.cs` - Main orchestration logic
- `Properties/launchSettings.json` - Launch configuration
- `Organizer.AppHost.csproj` - Project file with Aspire SDK reference

## Configuration

The AppHost configures:

1. **API Service**: 
   - Referenced as a .NET project
   - External HTTP endpoints enabled for external access

2. **SPA Service**:
   - Added as a JavaScript/npm application
   - Runs the `start` script from package.json
   - Configured on port 4200
   - Automatic `npm install` before start

## Service Defaults

Both services use the shared `Organizer.ServiceDefaults` project which provides:

- OpenTelemetry integration (metrics, tracing, logging)
- Health check endpoints
- Service discovery configuration
- HTTP resilience patterns (retry, circuit breaker, etc.)

## Deployment

The Aspire orchestration is designed primarily for local development. For production deployment:

- The API and SPA can be deployed separately as independent services
- Use Azure Container Apps, Kubernetes, or other cloud platforms
- Aspire can generate deployment manifests for various targets

## Troubleshooting

### Port Conflicts

If you encounter port conflicts, you can modify the ports in:
- `appsettings.json` for the API
- `Program.cs` in the AppHost for the SPA

### npm install failures

Ensure npm is installed and accessible from the command line:
```bash
npm --version
```

### Dashboard not accessible

Check that the ports shown in the console output are not blocked by a firewall.

## Learn More

- [.NET Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/)
- [Aspire Dashboard](https://learn.microsoft.com/dotnet/aspire/fundamentals/dashboard)
- [OpenTelemetry .NET](https://opentelemetry.io/docs/languages/net/)
