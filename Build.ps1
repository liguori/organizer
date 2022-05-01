$folderService = "$PSScriptRoot\src\Organizer.App\Services"
$fodlerUI = "$PSScriptRoot\src\Organizer.App\UI"

if (Test-Path $folderService) { Remove-Item -LiteralPath $folderService -Force -Recurse }
if (Test-Path $fodlerUI) { Remove-Item -LiteralPath $fodlerUI -Force -Recurse }

dotnet publish $PSScriptRoot\src\Organizer.API\Organizer.API.sln -o $folderService
Push-Location $PSScriptRoot\src\Organizer.SPA
npm install
npm run build -- --prod --base-href ./ --outputPath=".$fodlerUI" --configuration='production'
Pop-Location
Push-Location $PSScriptRoot\src\Organizer.App
npm install
.\node_modules\.bin\gulp
npm run dist
Pop-Location