# Organizer

[![Build Frontend](https://github.com/liguori/organizer/actions/workflows/build-frontend.yml/badge.svg)](https://github.com/liguori/organizer/actions/workflows/build-frontend.yml)
[![Build Backend](https://github.com/liguori/organizer/actions/workflows/build-backend.yml/badge.svg)](https://github.com/liguori/organizer/actions/workflows/build-backend.yml)

Appointment management tool.

## Overview

This tool represents a proof of concept for an appointment management system. It supports multiple execution modes: run as a standalone Electron desktop app, deploy as a web application, or use .NET Aspire for orchestrated development with full observability.

### Quick Start

| Goal | Command |
|------|---------|
| **Full-stack dev with dashboard** | `cd src/Organizer.AppHost && dotnet run` |
| **Debug API in VS Code** | F5 → "Organizer.API .NET Launch (web)" |
| **Debug SPA in VS Code** | F5 → "Organizer.SPA Launch (web)" |
| **Run API standalone** | `cd src/Organizer.API/Organizer.API && dotnet run` |
| **Run SPA standalone** | `cd src/Organizer.SPA && npm start` |
| **Build desktop app** | `./Build.ps1` |

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 21, Angular Material |
| Backend | ASP.NET Core, Entity Framework Core |
| Database | SQLite |
| Desktop | Electron 40.x |
| Orchestration | .NET Aspire 13.1.0 |

---

## Architecture

The application is composed of 3 layers:

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Shell                          │
│                   (./src/Organizer.App)                     │
│  ┌─────────────────────────┬─────────────────────────────┐  │
│  │         SPA             │           API               │  │
│  │   (./src/Organizer.SPA) │  (./src/Organizer.API)      │  │
│  │      Angular 21         │     ASP.NET Core            │  │
│  │    Angular Material     │   Entity Framework Core     │  │
│  └─────────────────────────┴─────────────────────────────┘  │
│                              │                              │
│                        ┌─────┴─────┐                        │
│                        │  SQLite   │                        │
│                        └───────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

| Component | Path | Description |
|-----------|------|-------------|
| **API** | `./src/Organizer.API` | REST API with business logic and data access |
| **SPA** | `./src/Organizer.SPA` | Single Page Application (user interface) |
| **Electron** | `./src/Organizer.App` | Desktop shell hosting API + SPA |
| **AppHost** | `./src/Organizer.AppHost` | .NET Aspire orchestration project |

---

## Prerequisites

- **Node.js** 22+
- **.NET SDK** 10

---

## Execution Modes

There are multiple ways to run the application depending on your use case:

| Mode | Use Case | Components Started | How to Run |
|------|----------|-------------------|------------|
| [Aspire Orchestration](#1-net-aspire-orchestration) | Development with full observability | API + SPA + Dashboard | `dotnet run` in AppHost |
| [VS Code Debug](#2-vs-code-debug-configurations) | Debugging individual components | API or SPA (separate) | F5 with launch config |
| [Standalone Components](#3-standalone-component-execution) | Manual development/testing | API and/or SPA independently | Terminal commands |
| [Electron App](#4-electron-desktop-application) | Desktop standalone application | Bundled API + SPA | Run built executable |
| [Web Deployment](#5-web-server-deployment) | Production server hosting | API + SPA on web servers | Deploy published artifacts |

---

### 1. .NET Aspire Orchestration

**Recommended for full-stack development**

The application includes **.NET Aspire 13.1.0** orchestration providing:
- Unified orchestration of API and SPA
- Built-in service discovery
- Observability with OpenTelemetry
- Health checks and resilience
- Dashboard for monitoring all services

**Run:**

```bash
cd src/Organizer.AppHost
dotnet run
```

**Services started:**
- **Organizer.API** — ASP.NET Core Web API (dynamic port)
- **Organizer.SPA** — Angular dev server (port 4200)
- **Aspire Dashboard** — https://localhost:17256

---

### 2. VS Code Debug Configurations

**Recommended for debugging individual components**

Pre-configured launch configurations in `.vscode/launch.json`:

| Configuration | Description |
|--------------|-------------|
| `Organizer.API .NET Launch (web)` | Debug backend API with .NET debugger |
| `Organizer.API .NET Attach` | Attach to running API process |
| `Organizer.SPA Launch (web)` | Debug Angular frontend in Chrome |
| `Organizer.SPA Test (web)` | Debug Angular unit tests in Chrome |

**How to use:**
1. Open **Run and Debug** (Ctrl+Shift+D)
2. Select configuration from dropdown
3. Press **F5**

> **Ports:** API runs on `https://localhost:5001`, SPA runs on `http://localhost:4200`

---

### 3. Standalone Component Execution

**Recommended for quick iterations on a single component**

#### Backend API

```bash
cd src/Organizer.API/Organizer.API
dotnet run
```

#### Frontend SPA

```bash
cd src/Organizer.SPA
npm install    # First time only
npm start      # http://localhost:4200
```

#### Run Tests

```bash
cd src/Organizer.SPA
npm test       # Karma tests in Chrome
```

---

### 4. Electron Desktop Application

**Recommended for end-user distribution**

The Electron app bundles API + SPA into a self-contained desktop application.

**Build:**

```bash
./Build.ps1
```

This script:
1. Publishes .NET API to `./src/Organizer.App/Services`
2. Builds Angular SPA to `./src/Organizer.App/UI`
3. Packages as Electron app (v40.x)

**Output:** `./src/dist`

**Development mode:**

```bash
cd src/Organizer.App
npm install
npm start
```

---

### 5. Web Server Deployment

**Recommended for production hosting**

#### Build

```bash
# API
cd src/Organizer.API
dotnet publish -c Release -o ./publish

# SPA
cd src/Organizer.SPA
npm run build -- --configuration production
```

#### Deploy

| Component | Target |
|-----------|--------|
| **API** | IIS, Azure App Service, Linux/Kestrel, Containers |
| **SPA** | Nginx, Azure Static Web Apps, CDN, any static host |

> **Configuration:** Update `appsettings.Production.json` (API) and `environment.prod.ts` (SPA) with production URLs.

---

## Screenshots

### Calendar View

| Light Theme | Dark Theme |
|-------------|------------|
| ![Calendar Light](docs/CalendarView.png) | ![Calendar Dark](docs/CalendarView_Dark.png) |

### Features

| Appointment Editing | Available Days | Customer Summary |
|---------------------|----------------|------------------|
| ![Appointment](docs/AppointmentEditing.png) | ![Available](docs/AvailableDays.png) | ![Customer](docs/CustomerSummary.png) | 
