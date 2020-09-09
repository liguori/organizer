$folderService=".\EngagementOrganizer.App\Services"
$fodlerUI=".\EngagementOrganizer.App\UI"
if (Test-Path $folderService) { Remove-Item -LiteralPath $folderService -Force -Recurse }
if (Test-Path $fodlerUI) { Remove-Item -LiteralPath $fodlerUI -Force -Recurse }

dotnet publish .\EngagementOrganizer.API\EngagementOrganizer.API.sln -o $folderService
cd .\EngagementOrganizer.SPA
npm install
npm run build -- --prod --base-href ./ --outputPath=".$fodlerUI" --configuration='production'
cd ..\EngagementOrganizer.App
npm install
.\node_modules\.bin\gulp
npm run dist
cd ..