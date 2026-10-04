#!/bin/bash

# Navigate to the directory where this script is located
cd "$(dirname "$0")"

echo "Starting TiTEC Automation Development Environment..."

# Check if running on Windows / Git Bash with PowerShell available
if command -v powershell.exe &> /dev/null && [ -f "./start-dev.ps1" ]; then
    echo "Windows environment detected. Launching via start-dev.ps1..."
    powershell.exe -ExecutionPolicy Bypass -File "./start-dev.ps1"
    exit 0
fi

# Check if gnome-terminal is available (Standard Ubuntu/Debian)
if command -v gnome-terminal &> /dev/null; then
    echo "Launching services in gnome-terminal tabs..."
    
    gnome-terminal --tab --title="Laravel API" -- bash -c "echo 'Starting Laravel Backend...'; cd backend-laravel && php artisan serve; exec bash"
    sleep 0.5
    gnome-terminal --tab --title="Queue Worker" -- bash -c "echo 'Starting Queue Worker...'; cd backend-laravel && php artisan queue:work; exec bash"
    sleep 0.5
    gnome-terminal --tab --title="Frontend Store" -- bash -c "echo 'Starting Frontend Next...'; cd frontend-next && npm run dev; exec bash"
    sleep 0.5
    gnome-terminal --tab --title="Frontend ERP" -- bash -c "echo 'Starting Frontend ERP...'; cd frontend-erp && npm run dev; exec bash"
      
    echo "Successfully opened terminal tabs."

# Fallback for other Linux distributions using x-terminal-emulator
elif command -v x-terminal-emulator &> /dev/null; then
    echo "Launching services in separate terminal windows..."
    
    x-terminal-emulator -e "bash -c 'echo \"Starting Laravel Backend...\"; cd backend-laravel && php artisan serve; exec bash'" &
    x-terminal-emulator -e "bash -c 'echo \"Starting Queue Worker...\"; cd backend-laravel && php artisan queue:work; exec bash'" &
    x-terminal-emulator -e "bash -c 'echo \"Starting Frontend Next...\"; cd frontend-next && npm run dev; exec bash'" &
    x-terminal-emulator -e "bash -c 'echo \"Starting Frontend ERP...\"; cd frontend-erp && npm run dev; exec bash'" &
    
    echo "Successfully opened terminal windows."

else
    echo "Error: Could not find a supported terminal emulator (gnome-terminal or x-terminal-emulator)."
    echo "Please open 4 separate terminals and run these commands manually:"
    echo "1. cd backend-laravel && php artisan serve"
    echo "2. cd backend-laravel && php artisan queue:work"
    echo "3. cd frontend-next && npm run dev"
    echo "4. cd frontend-erp && npm run dev"
fi
