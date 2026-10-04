# TiTEC Automation Development Environment Launcher (PowerShell / Windows)

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting TiTEC Automation Development Environment" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$backendDir = Join-Path $root "backend-laravel"
$frontendNextDir = Join-Path $root "frontend-next"
$frontendErpDir = Join-Path $root "frontend-erp"

# Check if wt.exe (Windows Terminal) is available
$hasWt = Get-Command wt.exe -ErrorAction SilentlyContinue

if ($hasWt) {
    Write-Host "`n[+] Launching all 4 services in Windows Terminal tabs..." -ForegroundColor Green
    
    Start-Process wt.exe -ArgumentList @(
        "-w", "0",
        "new-tab", "--title", "Laravel API", "-d", "$backendDir", "powershell", "-NoExit", "-Command", "php artisan serve",
        ";", "new-tab", "--title", "Queue Worker", "-d", "$backendDir", "powershell", "-NoExit", "-Command", "php artisan queue:work",
        ";", "new-tab", "--title", "Frontend Store", "-d", "$frontendNextDir", "powershell", "-NoExit", "-Command", "npm run dev",
        ";", "new-tab", "--title", "Frontend ERP", "-d", "$frontendErpDir", "powershell", "-NoExit", "-Command", "npm run dev"
    )
} else {
    Write-Host "`n[+] Launching services in separate PowerShell windows..." -ForegroundColor Yellow
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; php artisan serve"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; php artisan queue:work"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendNextDir'; npm run dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendErpDir'; npm run dev"
}

Write-Host "`nAll services have been launched!" -ForegroundColor Green
Write-Host "--------------------------------------------------"
Write-Host "  - Laravel API:    http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "  - Frontend Store: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  - Frontend ERP:   http://localhost:3001" -ForegroundColor Cyan
Write-Host "--------------------------------------------------"
