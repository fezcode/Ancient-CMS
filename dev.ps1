param (
    [string]$Target = "all"
)

Write-Host "AncientCMS Dev Script" -ForegroundColor Cyan
Write-Host "---------------------" -ForegroundColor DarkGray

# Helper Functions
function Start-Module {
    param ($Path, $Name)
    Write-Host "Starting $Name..." -ForegroundColor Green
    # Opens a new PowerShell window, stays open (-NoExit), runs npm run dev
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $Path; npm run dev"
}

# 1. STOP Command
if ($Target -eq "stop") {
    Write-Host "Stopping Docker Containers..." -ForegroundColor Yellow
    docker compose stop
    Write-Host "Docker stopped. Please manually close the other PowerShell windows." -ForegroundColor Yellow
    exit
}

# 2. START Commands
# Always check DB for 'all' or explicit 'db'
if ($Target -eq "all" -or $Target -eq "db") {
    Write-Host "Starting Database (Docker)..." -ForegroundColor Magenta
    docker compose up -d
}

# Start Server
if ($Target -eq "all" -or $Target -eq "server") {
    Start-Module -Path "server" -Name "API Server"
}

# Start Admin
if ($Target -eq "all" -or $Target -eq "admin") {
    Start-Module -Path "admin" -Name "Admin Dashboard"
}

# Start Website
if ($Target -eq "all" -or $Target -eq "website") {
    Start-Module -Path "website" -Name "Public Website"
}

Write-Host "---------------------" -ForegroundColor DarkGray
Write-Host "Done! Services are launching in new windows." -ForegroundColor Cyan
