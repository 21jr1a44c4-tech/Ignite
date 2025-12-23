@echo off
REM Azure App Service Deployment Script for Node.js + React

setlocal enabledelayedexpansion

echo Deploying Node.js + React application...

REM Build frontend first
echo Building frontend...
cd frontend
call npm install
if errorlevel 1 (
  echo Error installing frontend dependencies
  exit /b 1
)

call npm run build
if errorlevel 1 (
  echo Error building frontend
  exit /b 1
)

REM Install backend dependencies
echo Installing backend dependencies...
cd ../backend
call npm install --production
if errorlevel 1 (
  echo Error installing backend dependencies
  exit /b 1
)

REM Set environment variable for single service deployment
set SINGLE_SERVICE=true

echo Deployment complete - application ready to start
exit /b 0
