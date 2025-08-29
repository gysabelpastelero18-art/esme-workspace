# Remove backup files older than 7 days in the backup folder
$backupFolder = "C:\Users\Shiela\ESMERALDA FINANCE\Editing Web\esme-workspace\backup"
$daysOld = 7
Get-ChildItem -Path $backupFolder -Filter *.backup | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$daysOld) } | Remove-Item
