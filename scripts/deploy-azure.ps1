#!/usr/bin/env pwsh
# Azure Deployment Script for Winwire App
# Run this script to prepare and deploy to Azure

param(
    [string]$ResourceGroup = "",
    [string]$AppName = "",
    [string]$SubscriptionId = "",
    [string]$Method = "git"  # git or zip
)

# Colors for output
$Green = 'Green'
$Red = 'Red'
$Yellow = 'Yellow'
$Cyan = 'Cyan'

function Write-Status {
    param([string]$Message, [string]$Status = 'Info')
    
    switch ($Status) {
        'Success' { Write-Host "✅ $Message" -ForegroundColor $Green }
        'Error' { Write-Host "❌ $Message" -ForegroundColor $Red }
        'Warning' { Write-Host "⚠️  $Message" -ForegroundColor $Yellow }
        'Info' { Write-Host "ℹ️  $Message" -ForegroundColor $Cyan }
    }
}

function Test-Prerequisites {
    Write-Status "Checking prerequisites..." 'Info'
    
    # Check Node.js
    try {
        $node = node --version
        Write-Status "Node.js found: $node" 'Success'
    }
    catch {
        Write-Status "Node.js not installed" 'Error'
        exit 1
    }
    
    # Check npm
    try {
        $npm = npm --version
        Write-Status "npm found: $npm" 'Success'
    }
    catch {
        Write-Status "npm not installed" 'Error'
        exit 1
    }
    
    # Check Azure CLI
    try {
        $az = az --version
        Write-Status "Azure CLI found" 'Success'
    }
    catch {
        Write-Status "Azure CLI not installed. Download from https://aka.ms/azure-cli" 'Error'
        exit 1
    }
    
    # Check Git
    try {
        $git = git --version
        Write-Status "Git found: $git" 'Success'
    }
    catch {
        Write-Status "Git not installed" 'Error'
        exit 1
    }
}

function Get-UserInputs {
    Write-Status "`nEntering interactive mode..." 'Info'
    
    if (-not $ResourceGroup) {
        $ResourceGroup = Read-Host "Enter Azure Resource Group name"
    }
    
    if (-not $AppName) {
        $AppName = Read-Host "Enter Azure App Service name"
    }
    
    if (-not $SubscriptionId) {
        $SubscriptionId = Read-Host "Enter Azure Subscription ID (optional, press Enter to skip)"
    }
    
    return $ResourceGroup, $AppName, $SubscriptionId
}

function Build-FrontEnd {
    Write-Status "`nBuilding React frontend..." 'Info'
    
    Push-Location "frontend"
    
    try {
        Write-Status "Installing frontend dependencies..." 'Info'
        npm install
        
        Write-Status "Building frontend..." 'Info'
        npm run build
        
        Write-Status "Frontend build completed successfully" 'Success'
    }
    catch {
        Write-Status "Frontend build failed: $_" 'Error'
        Pop-Location
        exit 1
    }
    
    Pop-Location
}

function Install-BackendDeps {
    Write-Status "`nInstalling backend dependencies..." 'Info'
    
    Push-Location "backend"
    
    try {
        npm install
        Write-Status "Backend dependencies installed" 'Success'
    }
    catch {
        Write-Status "Failed to install backend dependencies: $_" 'Error'
        Pop-Location
        exit 1
    }
    
    Pop-Location
}

function Test-LocalBuild {
    Write-Status "`nTesting local production build..." 'Info'
    Write-Status "Starting server in production mode..." 'Info'
    Write-Status "Press Ctrl+C to stop after verification" 'Warning'
    
    Push-Location "backend"
    
    try {
        $env:NODE_ENV = 'production'
        $timeout = 10
        $process = Start-Process node -ArgumentList "server.js" -PassThru
        
        Start-Sleep -Seconds 3
        
        # Test if server is running
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
            Write-Status "✅ Server is running and responding" 'Success'
        }
        catch {
            Write-Status "⚠️  Could not reach server at localhost:5000" 'Warning'
        }
        
        # Stop the process
        Stop-Process -Id $process.Id -ErrorAction SilentlyContinue
    }
    finally {
        Pop-Location
        $env:NODE_ENV = 'development'
    }
}

function Prepare-Deployment {
    param([string]$Method)
    
    if ($Method -eq 'git') {
        Write-Status "`nPreparing for Git deployment..." 'Info'
        
        # Check if git initialized
        if (-not (Test-Path ".git")) {
            Write-Status "Initializing Git repository..." 'Info'
            git init
            git add .
            git commit -m "Initial commit for Azure deployment"
        }
        else {
            Write-Status "Git repository already initialized" 'Info'
            
            # Check for changes
            $changes = git status --porcelain
            if ($changes) {
                Write-Status "Uncommitted changes found, committing..." 'Info'
                git add .
                git commit -m "Deploy changes to Azure"
            }
        }
    }
    elseif ($Method -eq 'zip') {
        Write-Status "`nPreparing ZIP for deployment..." 'Info'
        
        # Create deployment.zip
        if (Test-Path "deployment.zip") {
            Remove-Item "deployment.zip"
        }
        
        Write-Status "Creating deployment package..." 'Info'
        Compress-Archive -Path "backend", "frontend/build" -DestinationPath "deployment.zip" -Force
        
        $size = (Get-Item "deployment.zip").Length / 1MB
        Write-Status "Deployment package created: deployment.zip ($([math]::Round($size, 2)) MB)" 'Success'
    }
}

function Deploy-ToAzure {
    param(
        [string]$ResourceGroup,
        [string]$AppName,
        [string]$Method
    )
    
    Write-Status "`nDeploying to Azure..." 'Info'
    
    # Check subscription
    if ($SubscriptionId) {
        az account set --subscription $SubscriptionId
        Write-Status "Subscription set to: $SubscriptionId" 'Info'
    }
    
    # Verify resource group exists
    try {
        $rg = az group show --name $ResourceGroup --query id
        if (-not $rg) {
            Write-Status "Resource group not found: $ResourceGroup" 'Error'
            exit 1
        }
        Write-Status "Resource group verified: $ResourceGroup" 'Success'
    }
    catch {
        Write-Status "Failed to verify resource group: $_" 'Error'
        exit 1
    }
    
    # Verify web app exists
    try {
        $app = az webapp show --resource-group $ResourceGroup --name $AppName --query id
        if (-not $app) {
            Write-Status "Web app not found: $AppName" 'Error'
            exit 1
        }
        Write-Status "Web app verified: $AppName" 'Success'
    }
    catch {
        Write-Status "Failed to verify web app: $_" 'Error'
        exit 1
    }
    
    if ($Method -eq 'git') {
        Write-Status "Pushing to Azure Git repository..." 'Info'
        
        # Get deployment source
        $remoteUrl = az webapp deployment source config-local-git `
            --resource-group $ResourceGroup `
            --name $AppName `
            --query url `
            --output tsv
        
        if (-not $remoteUrl) {
            Write-Status "Failed to get Azure Git URL" 'Error'
            exit 1
        }
        
        Write-Status "Git URL: $remoteUrl" 'Info'
        
        # Check if remote exists
        $existingRemote = git remote | Select-String azure
        if (-not $existingRemote) {
            git remote add azure $remoteUrl
            Write-Status "Azure remote added" 'Info'
        }
        
        # Push to Azure
        Write-Status "Pushing code to Azure..." 'Info'
        git push azure main -f
        
        Write-Status "Code pushed successfully" 'Success'
    }
    elseif ($Method -eq 'zip') {
        Write-Status "Deploying ZIP package..." 'Info'
        
        az webapp deployment source config-zip `
            --resource-group $ResourceGroup `
            --name $AppName `
            --src deployment.zip
        
        Write-Status "ZIP deployment completed" 'Success'
    }
}

function Monitor-Deployment {
    param(
        [string]$ResourceGroup,
        [string]$AppName
    )
    
    Write-Status "`nMonitoring deployment..." 'Info'
    Write-Status "Viewing application logs (Ctrl+C to stop)..." 'Info'
    
    az webapp log tail --resource-group $ResourceGroup --name $AppName
}

# Main execution
Clear-Host
Write-Host "
╔════════════════════════════════════════════════════════╗
║      🚀 Winwire Azure Deployment Script               ║
║                                                        ║
║  Automates build and deployment to Azure Web App      ║
╚════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Test prerequisites
Test-Prerequisites

# Get user inputs if not provided
if (-not $ResourceGroup -or -not $AppName) {
    $ResourceGroup, $AppName, $SubscriptionId = Get-UserInputs
}

Write-Status "`nDeployment Configuration:" 'Info'
Write-Host "  Resource Group: $ResourceGroup"
Write-Host "  App Name: $AppName"
Write-Host "  Deployment Method: $Method"
Write-Host ""

$confirm = Read-Host "Continue with deployment? (y/n)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Status "Deployment cancelled" 'Warning'
    exit 0
}

# Execute deployment steps
try {
    Build-FrontEnd
    Install-BackendDeps
    Test-LocalBuild
    Prepare-Deployment -Method $Method
    Deploy-ToAzure -ResourceGroup $ResourceGroup -AppName $AppName -Method $Method
    
    Write-Host "`n"
    Write-Status "Deployment completed successfully! 🎉" 'Success'
    Write-Host "`nNext steps:"
    Write-Host "  1. Monitor logs: az webapp log tail --resource-group $ResourceGroup --name $AppName"
    Write-Host "  2. Test app: https://$AppName.azurewebsites.net"
    Write-Host "  3. Check health: https://$AppName.azurewebsites.net/health"
    Write-Host "`n"
    
    $viewLogs = Read-Host "View application logs now? (y/n)"
    if ($viewLogs -eq 'y' -or $viewLogs -eq 'Y') {
        Monitor-Deployment -ResourceGroup $ResourceGroup -AppName $AppName
    }
}
catch {
    Write-Status "Deployment failed: $_" 'Error'
    exit 1
}
