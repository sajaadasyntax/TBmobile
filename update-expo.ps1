# PowerShell script to update Expo to SDK 54
# This script cleans node_modules and reinstalls with latest versions

Write-Host "=== Updating Expo to SDK 54 ===" -ForegroundColor Green
Write-Host ""

# Step 1: Remove node_modules and package-lock.json
Write-Host "[1/4] Cleaning old dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Removed node_modules" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✓ Removed package-lock.json" -ForegroundColor Green
}

# Step 2: Clear npm cache
Write-Host ""
Write-Host "[2/4] Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✓ Cache cleared" -ForegroundColor Green

# Step 3: Install dependencies
Write-Host ""
Write-Host "[3/4] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Installation failed" -ForegroundColor Red
    exit 1
}

# Step 4: Fix Expo dependencies
Write-Host ""
Write-Host "[4/4] Fixing Expo dependencies..." -ForegroundColor Yellow
npx expo install --fix
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Expo dependencies fixed" -ForegroundColor Green
} else {
    Write-Host "⚠ Warning: Some dependencies may need manual fixing" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Update Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm start" -ForegroundColor Cyan
Write-Host "2. Test the app to ensure everything works" -ForegroundColor Cyan
Write-Host ""

