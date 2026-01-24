$folderService = "$PSScriptRoot\src\Organizer.App\Services"
$folderUI = "$PSScriptRoot\src\Organizer.App\UI"

if (Test-Path $folderService) { Remove-Item -LiteralPath $folderService -Force -Recurse }
if (Test-Path $folderUI) { Remove-Item -LiteralPath $folderUI -Force -Recurse }

dotnet publish $PSScriptRoot\src\Organizer.API\Organizer.API.sln -o $folderService
Push-Location $PSScriptRoot\src\Organizer.SPA
npm install
npm run build -- --configuration production --base-href ./ --output-path $folderUI
Pop-Location
Push-Location $PSScriptRoot\src\Organizer.App
npm install
npx gulp
npm run dist
Pop-Location