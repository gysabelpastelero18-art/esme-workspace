$env:PGPASSWORD="esmeDB"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "C:\Users\Shiela\ESMERALDA FINANCE\Editing Web\esme-workspace\backup\esme_finance-$timestamp.backup"
pg_dump -U postgres -h localhost -d esme_finance -F c -b -v -f $backupPath
