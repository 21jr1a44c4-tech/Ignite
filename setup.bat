@echo off
echo ========================================
echo Winwire Employee Onboarding Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed!
echo.

echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed!
echo.

cd ..

echo ========================================
echo Setup Completed Successfully!
echo ========================================
echo.
echo Next Steps:
echo 1. Make sure MongoDB is running
echo 2. Open a terminal and run: cd backend ^&^& npm run dev
echo 3. Open another terminal and run: cd frontend ^&^& npm start
echo.
echo Default Admin Login:
echo Email: 21jr1a05d0@gmail.com
echo Password: Admin@123
echo.
echo Application URL: http://localhost:3000
echo.
pause
