$process = "node.exe"
Get-WmiObject Win32_Process -Filter "name = '$process'" | Select-Object CommandLine