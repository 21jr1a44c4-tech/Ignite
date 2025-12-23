# GitHub Actions + Azure App Service Deployment

## Overview

GitHub Actions will automatically build and deploy your code to Azure every time you push to `main` or `master` branch.

```
┌─────────────────┐
│  Git Push Code  │
└────────┬────────┘
         ↓
┌─────────────────────────────┐
│  GitHub Actions Triggered   │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  Build Phase (ubuntu)       │
├─────────────────────────────┤
│ ✓ npm install (root)        │
│ ✓ Frontend build            │
│ ✓ Backend install           │
│ ✓ Tests & syntax check      │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  Deploy Phase               │
├─────────────────────────────┤
│ ✓ Push to Azure App Service │
│ ✓ Health check after deploy │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  App Live on Azure          │
└─────────────────────────────┘
```

## Setup Steps

### Step 1: Get Azure Publish Profile

1. Go to **Azure Portal** → Your App Service
2. Click **Download publish profile** button (top right)
3. Save the `.PublishSettings` file

### Step 2: Add GitHub Secrets

1. Go to **GitHub** → Your Repository
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `AZURE_APP_NAME` | Your Azure App Service name (e.g., `winbuild-ignite`) |
| `AZURE_PUBLISH_PROFILE` | Contents of the `.PublishSettings` file (entire XML) |

**To get publish profile content:**
```
Open the .PublishSettings file with a text editor
Copy the entire contents
Paste into GitHub secret
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

GitHub Actions will automatically trigger!

## What Happens in GitHub Actions

### Build Phase
- Installs dependencies
- Builds React frontend
- Installs backend dependencies
- Runs tests (if any)
- Checks syntax

### Deploy Phase
- Pushes code to Azure App Service
- Azure runs your existing `deploy.cmd`
- Server starts with `npm start`

### Post-Deploy Phase
- Checks app health (`/health` endpoint)
- Confirms deployment was successful

## Workflow File Location

```
WinBuild1-THEIGNITE/
├── .github/
│   └── workflows/
│       └── azure-deploy.yml  ← This is the GitHub Actions config
```

## How It Works

```
Your existing files + GitHub Actions workflow:

.deployment → tells Azure to run deploy.cmd ✓
deploy.cmd → builds frontend, installs backend ✓
web.config → IIS routing ✓
package.json → npm start command ✓

GitHub Actions just PUSHES the code to Azure.
Azure handles the rest with your existing files!
```

## Triggering Deployment

### Automatic (After Setup)
- Push to `main` or `master` branch
- GitHub Actions triggers automatically
- Builds and deploys

### Manual (If Needed)
1. Go to **Actions** tab in GitHub
2. Select **Deploy to Azure App Service** workflow
3. Click **Run workflow**

## Monitoring Deployment

### View GitHub Actions Log

1. Go to **GitHub Repository** → **Actions**
2. Click latest workflow run
3. See real-time build/deploy logs

### View Azure Deployment

1. Go to **Azure Portal** → App Service
2. Click **Deployment Center**
3. See latest deployment status

## Environment Variables in Azure

GitHub Actions doesn't set environment variables. You still need to set them in **Azure Portal**:

1. App Service → Configuration → Application settings
2. Add:
   ```
   MONGODB_URI=mongodb+srv://...
   NODE_ENV=production
   SINGLE_SERVICE=true
   JWT_SECRET=your-secret
   OPENAI_API_KEY=sk-...
   ```

## Troubleshooting

### Workflow Not Triggering
- Check branch name (must be main or master)
- Verify `.github/workflows/azure-deploy.yml` is committed
- Check GitHub Actions is enabled in repo settings

### Build Phase Fails
- Check `npm install` errors in logs
- Verify dependencies are compatible
- Check backend has required env vars

### Deploy Phase Fails
- Verify `AZURE_PUBLISH_PROFILE` secret is correct
- Verify `AZURE_APP_NAME` is correct
- Check Azure App Service exists

### Health Check Fails
- Verify `/health` endpoint works
- Check backend is listening on PORT 8080
- Verify environment variables in Azure

## GitHub Actions Features Included

✅ **Build Phase**
- Installs dependencies
- Builds frontend
- Syntax checking
- Tests (if any)

✅ **Deploy Phase**
- Automatic deployment to Azure
- Uses Azure publish profile

✅ **Post-Deploy Phase**
- Health check
- Confirms deployment success

## Disable Workflow (If Needed)

In workflow file, change:
```yaml
on:
  push:
    branches:
      - main
      - master
```

To:
```yaml
on:
  workflow_dispatch:  # Manual trigger only
```

## Cost Implications

- **GitHub Actions**: Free for public repos, limited free minutes for private repos
- **Azure**: Pay per App Service tier (B1 = ~$10/month)

## What Gets Deployed

Everything in your repository:
- ✓ `backend/` source code
- ✓ `frontend/` source code
- ✓ `.deployment`, `deploy.cmd`, `web.config`
- ✓ Root `package.json`
- ✗ `.git` folder (not deployed)
- ✗ `node_modules` (rebuilt on Azure)

## Redeploying Previous Version

If you need to roll back:

1. Go to GitHub → Commits
2. Find the commit to redeploy
3. Go to Actions → Run workflow → select that commit

Or in Azure Portal:
- Deployment Center → Redeploy previous successful deployment

## Summary

| Component | Responsibility |
|-----------|-----------------|
| GitHub Actions | Build & push to Azure |
| .deployment | Tells Azure to run deploy.cmd |
| deploy.cmd | Build frontend, install backend |
| Azure App Service | Runs the app with your existing config |
| web.config | IIS routing |
| package.json | npm start command |

**Everything works together!** Push code → GitHub Actions builds → Azure deploys.

✅ **Setup complete! Your CI/CD pipeline is ready.**
