$folderService = "$PSScriptRoot\src\EngagementOrganizer.App\Services"
$fodlerUI = "$PSScriptRoot\src\EngagementOrganizer.App\UI"

if (Test-Path $folderService) { Remove-Item -LiteralPath $folderService -Force -Recurse }
if (Test-Path $fodlerUI) { Remove-Item -LiteralPath $fodlerUI -Force -Recurse }

dotnet publish $PSScriptRoot\src\EngagementOrganizer.API\EngagementOrganizer.API.sln -o $folderService
Push-Location $PSScriptRoot\src\EngagementOrganizer.SPA
npm install
npm run build -- --prod --base-href ./ --outputPath=".$fodlerUI" --configuration='production'
Pop-Location
Push-Location $PSScriptRoot\src\EngagementOrganizer.App
npm install
.\node_modules\.bin\gulp
npm run dist
Pop-Location