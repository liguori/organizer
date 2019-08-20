start-process -FilePath .\release\Services\EngagementOrganizer.API.exe -WorkingDirectory .\release\Services\ -WindowStyle Hidden
start-process -FilePath http-server -ArgumentList ('.\release\Application\','-p 5556','-ext htm','-i false') -WindowStyle Hidden
Start "http://localhost:5556/index.html"