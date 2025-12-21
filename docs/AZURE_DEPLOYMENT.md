# 🚀 Azure Web App Deployment Guide

## Overview
This guide covers deploying the combined React + Express app to Azure App Service as a single Node.js application.

---

## Pre-Deployment Setup

### 1. Update Environment Variables

All localhost variables have been updated to work in the cloud:

#### Backend (.env):
```dotenv
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://[your-atlas-connection-string]
FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}
BACKEND_URL=${BACKEND_URL:-http://localhost:5000}
```

#### Frontend (.env):
```dotenv
REACT_APP_API_URL=/api
REACT_APP_BACKEND_URL=/
```

**Key Changes:**
- Frontend uses relative URLs (`/api`, `/`) instead of hardcoded localhost
- Backend reads FRONTEND_URL and BACKEND_URL from environment variables
- These will be auto-set by Azure to your web app URL

---

## Step 1: Build React App Locally (Testing)

Before deploying to Azure, test the production build locally:

```powershell
# Navigate to project root
cd d:\WinBuild 1.0\Ignite

# Build the React frontend
cd frontend
npm install
npm run build

# Verify build output
# Should create: frontend/build/ directory

# Navigate back to backend
cd ../backend

# Install backend dependencies
npm install

# Test serving the production build locally
$env:NODE_ENV='production'
npm start
```

Then visit `http://localhost:5000` - should load the React app.

---

## Step 2: Create Azure Web App

### Using Azure Portal:
1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource**
3. Search for **App Service**
4. Click **Create**

### Configuration:
- **Subscription**: Your subscription
- **Resource Group**: Create new (e.g., "WinwireApp")
- **Name**: `your-app-name` (must be unique globally)
- **Publish**: Code
- **Runtime stack**: Node 18 LTS (or latest LTS)
- **Operating System**: Linux
- **App Service Plan**: Basic B1 or higher
- **Region**: Choose closest region

### After Creation:
1. Go to **Configuration** → **Application settings**
2. Add these environment variables:

```
NODE_ENV = production
MONGODB_URI = [your-atlas-connection-string]
FRONTEND_URL = https://your-app-name.azurewebsites.net
BACKEND_URL = https://your-app-name.azurewebsites.net
JWT_SECRET = [secure-random-key]
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = [your-email]
EMAIL_PASSWORD = [app-specific-password]
[... all other environment variables ...]
```

---

## Step 3: Deploy Using Azure CLI

### Install Azure CLI:
```powershell
# Download and install from:
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows

# Verify installation
az --version
```

### Login to Azure:
```powershell
az login
# This opens a browser for authentication
```

### Build the App:
```powershell
cd d:\WinBuild 1.0\Ignite\backend

# Install backend dependencies
npm install

# Build frontend and copy to backend
npm run build
```

### Deploy Using Git:
```powershell
# Navigate to project root
cd d:\WinBuild 1.0\Ignite

# Initialize git (if not already done)
git init

# Add Azure remote
az webapp deployment user set --user-name [deployment-username] --password [deployment-password]

# Get deployment source
az webapp deployment source config-local-git --resource-group [resource-group-name] --name [app-name]

# Add Azure remote
git remote add azure [git-url-from-above]

# Commit and push
git add .
git commit -m "Prepare for Azure deployment"
git push azure main

# Monitor deployment
az webapp log tail --resource-group [resource-group-name] --name [app-name]
```

### Alternative: Deploy Using ZIP

```powershell
# Create deployment ZIP
# Include only:
# - backend/ (with node_modules)
# - frontend/build/ (NOT frontend/src, node_modules)

cd d:\WinBuild 1.0\Ignite

# Create zip
Compress-Archive -Path backend, frontend\build -DestinationPath deployment.zip

# Deploy
az webapp deployment source config-zip --resource-group [resource-group] --name [app-name] --src deployment.zip
```

---

## Step 4: Configure App Service

### 1. Set Startup Command
Go to **Configuration** → **General settings**

Set **Startup Command**:
```
npm start
```

Or for better control:
```
node backend/server.js
```

### 2. Enable Log Streaming
```powershell
az webapp log tail --resource-group [resource-group] --name [app-name]
```

### 3. Configure CORS (if needed)
If frontend and backend need different origins, add to `server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

---

## Step 5: Verify Deployment

### Check Status:
```powershell
az webapp show --resource-group [resource-group] --name [app-name] --query state
```

### Test Application:
1. Open `https://your-app-name.azurewebsites.net` in browser
2. Should see login page
3. Try login with admin credentials
4. Test API calls

### View Logs:
```powershell
# Real-time logs
az webapp log tail --resource-group [resource-group] --name [app-name]

# Historical logs
az webapp log download --resource-group [resource-group] --name [app-name] --log-file logs.zip
```

---

## Step 6: File Structure on Azure

After deployment, the app structure on Azure will be:

```
/home/site/wwwroot/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── node_modules/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   ├── config/
│   ├── middleware/
│   ├── agents/
│   ├── uploads/
│   ├── documents/
│   └── assets/
├── frontend/
│   └── build/
│       ├── index.html
│       ├── static/
│       └── favicon.ico
└── .git/
```

---

## Troubleshooting

### App Not Starting

**Check logs:**
```powershell
az webapp log tail --resource-group [resource-group] --name [app-name]
```

**Common Issues:**
1. **Missing dependencies**: Run `npm install` in backend folder
2. **Wrong Node version**: Set to Node 18 LTS in portal
3. **PORT environment variable**: Azure sets `PORT` automatically, ensure code reads it

**Fix in server.js:**
```javascript
const PORT = process.env.PORT || 5000;  // Azure will set PORT
```

### MongoDB Connection Failed

1. Check MONGODB_URI in Application settings
2. Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for public access)
3. Test connection string locally first

### Static Files Not Loading

1. Ensure `npm run build` was executed in backend package.json
2. Check that `frontend/build/` directory exists and was deployed
3. Verify path in server.js:
```javascript
const frontendBuildPath = path.join(__dirname, '../frontend/build');
```

### API Calls Failing from Frontend

1. Ensure frontend uses relative URLs (`/api`)
2. Check CORS settings if calling different domain
3. Verify API routes in backend are correct

---

## Performance Optimization

### 1. Use Azure CDN for Static Files
```javascript
// Add far-future expires headers for static assets
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|gif|ico|woff2)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000');
  }
  next();
});
```

### 2. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Monitor Performance
```powershell
# View diagnostics
az monitor metrics list --resource [app-id] --metric "CpuTime,MemoryWorkingSet"
```

---

## Scaling

### Upgrade App Service Plan:
1. Go to **App Service Plan** in Azure Portal
2. Click **Scale up** (vertical) or **Scale out** (horizontal)
3. For production: Choose **Standard** or **Premium** plan

### Auto-scale:
```powershell
az monitor autoscale create \
  --resource-group [resource-group] \
  --resource-name [app-name] \
  --resource-type "Microsoft.Web/serverfarms" \
  --min-count 1 \
  --max-count 5 \
  --count 2
```

---

## Continuous Deployment

### Setup GitHub Actions:
1. Commit code to GitHub
2. Go to App Service → Deployment Center
3. Select GitHub as source
4. Authorize and select repository
5. Azure will create GitHub Actions workflow

**Workflow file** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'your-app-name'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: .
```

---

## Environment-Specific Configuration

### Development (.env):
```dotenv
NODE_ENV=development
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (.env.azure):
```dotenv
NODE_ENV=production
PORT=5000
# Set MONGODB_URI, EMAIL settings, etc. in Azure Portal
```

**Use in server.js:**
```javascript
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.azure' });
}
```

---

## Monitoring & Logging

### View Application Insights:
1. Go to App Service → Application Insights
2. View real-time metrics, failures, exceptions

### Setup Alerts:
1. Application Insights → Alerts
2. Create alert rule for CPU > 80%
3. Configure notification email

### View Logs:
```powershell
# Container logs
az webapp log tail --resource-group [resource-group] --name [app-name]

# Download diagnostic logs
az webapp log download --resource-group [resource-group] --name [app-name]
```

---

## Rollback Deployment

```powershell
# View deployment history
az webapp deployment list --resource-group [resource-group] --name [app-name]

# Redeploy to previous version
az webapp deployment slot swap \
  --resource-group [resource-group] \
  --name [app-name] \
  --slot staging
```

---

## Security Best Practices

1. **Use Azure Key Vault** for sensitive credentials
2. **Enable HTTPS only**: Configuration → General settings
3. **Set Security Headers**:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

4. **Restrict CORS**:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

5. **Environment Variables**: Never commit `.env` file, use Azure portal instead

---

## Cost Estimation

### Azure Web App (Monthly):
- **Basic B1**: ~$10/month
- **Standard S1**: ~$70/month
- **Premium P1V2**: ~$200/month

### MongoDB Atlas:
- **Free tier**: 512MB storage
- **Shared**: Pay-as-you-go from $9/month
- **Dedicated**: From $57/month

---

## Useful Azure CLI Commands

```powershell
# List all resource groups
az group list

# List web apps in resource group
az webapp list --resource-group [resource-group]

# Get web app details
az webapp show --resource-group [resource-group] --name [app-name]

# Restart web app
az webapp restart --resource-group [resource-group] --name [app-name]

# Delete web app
az webapp delete --resource-group [resource-group] --name [app-name]

# Set environment variable
az webapp config appsettings set \
  --resource-group [resource-group] \
  --name [app-name] \
  --settings NODE_ENV=production

# List environment variables
az webapp config appsettings list \
  --resource-group [resource-group] \
  --name [app-name]
```

---

## Next Steps

1. ✅ Update environment variables locally
2. ✅ Test production build locally
3. ✅ Create Azure Web App
4. ✅ Deploy application
5. ✅ Verify deployment
6. ✅ Setup monitoring
7. ✅ Configure custom domain (optional)
8. ✅ Enable SSL/TLS certificate (included with Azure)

---

## Support & Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Deploying Node.js Apps to Azure](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/)
- [Express.js Static Files](https://expressjs.com/en/starter/static-files.html)

---

**Last Updated**: December 21, 2025
**Status**: Ready for Azure Deployment ✅
