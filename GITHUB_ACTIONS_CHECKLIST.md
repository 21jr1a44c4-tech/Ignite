# GitHub Actions + Azure Deployment - Quick Setup Checklist

## What You Have ✅

- [x] `.deployment` file - Tells Azure to run deploy.cmd
- [x] `deploy.cmd` - Builds frontend + installs backend
- [x] `web.config` - IIS routing
- [x] Root `package.json` - npm start script
- [x] `.github/workflows/azure-deploy.yml` - GitHub Actions workflow

## What You Need to Do

### 1️⃣ Get Azure Publish Profile (5 minutes)

**In Azure Portal:**
- [ ] Go to your App Service
- [ ] Click "Download publish profile" (top right)
- [ ] Save the `.PublishSettings` file

### 2️⃣ Add GitHub Secrets (5 minutes)

**In GitHub Repository:**
- [ ] Go to Settings → Secrets and variables → Actions
- [ ] Create secret `AZURE_APP_NAME`
  - Value: Your App Service name (e.g., `winbuild-ignite`)
- [ ] Create secret `AZURE_PUBLISH_PROFILE`
  - Value: Entire contents of `.PublishSettings` file

### 3️⃣ Push Code to GitHub (2 minutes)

```bash
git add .
git commit -m "Add GitHub Actions for Azure deployment"
git push origin main
```

### 4️⃣ Set Environment Variables in Azure (5 minutes)

**In Azure Portal:**
- [ ] Go to App Service → Configuration → Application settings
- [ ] Add these:
  ```
  MONGODB_URI = mongodb+srv://...
  NODE_ENV = production
  SINGLE_SERVICE = true
  JWT_SECRET = your-secret-key
  PORT = 8080
  ```
  - Plus any other vars: OPENAI_API_KEY, SMTP_*, etc.

### 5️⃣ Monitor Deployment (ongoing)

**In GitHub:**
- [ ] Go to Actions tab
- [ ] Watch workflow run
- [ ] Check logs for any errors

**In Azure:**
- [ ] Go to App Service → Deployment Center
- [ ] See latest deployment status

## Done! 🎉

**That's it!** Now:
- Push to `main` branch → Automatic build & deploy
- GitHub Actions handles everything
- App deploys to Azure automatically

## Testing the Pipeline

1. Make a small change to your code
2. Commit and push to main
3. Go to GitHub Actions tab
4. Watch the workflow run
5. Check your Azure app is updated

## If Something Goes Wrong

**Check in order:**
1. GitHub Actions logs (Actions tab)
2. Azure deployment logs (Deployment Center)
3. Azure app logs (Log Stream)
4. GitHub secrets are set correctly
5. Azure environment variables are set

## Key URLs

| Resource | URL |
|----------|-----|
| GitHub Actions | github.com/yourname/repo/actions |
| Azure App Service | portal.azure.com → App Service → YourApp |
| Live App | https://your-app.azurewebsites.net |
| App Health | https://your-app.azurewebsites.net/health |

## Cost Breakdown

| Service | Cost |
|---------|------|
| GitHub Actions (private repo) | ~$0.008/min (included first 2000 min/month) |
| Azure App Service (B1) | ~$10/month |
| **Total** | ~$10-15/month |

## Next Steps After Deployment

✅ Verify app loads: `https://your-app.azurewebsites.net/`
✅ Test API endpoint: `https://your-app.azurewebsites.net/api/auth/login`
✅ Check health: `https://your-app.azurewebsites.net/health`
✅ Monitor logs in Azure

## Workflow Triggers

The workflow automatically runs on:
- ✅ Push to `main` branch
- ✅ Push to `master` branch
- ⚠️ Pull requests (builds only, doesn't deploy)

## Support

If you have issues:
1. Check GitHub Actions workflow logs
2. Check Azure deployment logs
3. Verify GitHub secrets
4. Verify Azure environment variables
5. Check your internet connection 😄

---

**Ready to deploy?** Follow the 5 steps above and you're done! 🚀
