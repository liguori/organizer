dotnet publish .\EngagementOrganizer.API\EngagementOrganizer.API.sln --self-contained --runtime win-x64 -o ..\..\release\Services
cd .\EngagementOrganizer.SPA
npm install
ng build --prod --aot --outputPath=..\release\Application --configuration='production'
cd..