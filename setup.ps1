# Winwire Employee Onboarding Application - Setup Script
# Run this script from the root directory

Write-Host "🚀 Setting up Winwire Employee Onboarding Application..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version
    Write-Host "✅ MongoDB found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MongoDB not found. Please install MongoDB or ensure it's in PATH." -ForegroundColor Red
}

Write-Host ""
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Cyan
Set-Location ../frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MongoDB is running: mongod" -ForegroundColor White
Write-Host "2. Start Backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "3. Start Frontend (new terminal): cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Default Admin Login:" -ForegroundColor Cyan
Write-Host "   Email: 21jr1a05d0@gmail.com" -ForegroundColor White
Write-Host "   Password: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For detailed instructions, see README.md or QUICKSTART.md" -ForegroundColor Yellow
Write-Host ""
