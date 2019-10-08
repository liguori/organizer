# Engagement-Organizer
Engagement management tool. 

 ## Technologies

- Angular
- Angular Material
- ASP.NET Core
- Entity Framework Core
- SQLite
- Electron


## Introduction

This tool represents a proof of concept. The quality of the code whose completion times were in the order of a few days in my spare time is proof of that (minimum valuable product).

## Build

Execute the 'src/MakeBuild.ps1' PowerShell script. (PS Core for Linux/Max or execute the .ps1 commands in your favourite console)

Once the build is completed, you can run the App trough Electron:

```bash
cd ./src/EngagementOrganizer.App

npm run #run electron via npm

# OR

npm run dist #produce the Electron self-contained app as bundle in the folder ./src/dist
```

## Areas for improvement

- Unit testing
- CI / CD
- Globalization and i18n
- Bug fix


## Screenshots

**Calendar view**
![Full fixed lenght file example](https://raw.github.com/liguori/Engagement-Organizer/master/docs/CalendarView.png)

**Appointment editing**
![Full fixed lenght file example](https://raw.github.com/liguori/Engagement-Organizer/master/docs/AppointmentEditing.png)

**Available days**
![Full fixed lenght file example](https://raw.github.com/liguori/Engagement-Organizer/master/docs/AvailableDays.png)

**Customer summary**
![Full fixed lenght file example](https://raw.github.com/liguori/Engagement-Organizer/master/docs/CustomerSummary.png)