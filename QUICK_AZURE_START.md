# ⚡ Quick Start - Azure Deployment

## 🎯 What's Changed

✅ **Backend** now serves React build  
✅ **Frontend** uses relative URLs (`/api` instead of `localhost:5000`)  
✅ **Environment variables** configured for Azure  
✅ **Build script** added to package.json  
✅ **Documentation** complete with guides and checklists  

---

## 🚀 Deploy in 5 Minutes

### Step 1: Test Locally (2 min)
```powershell
cd d:\WinBuild 1.0\Ignite\frontend
npm install
npm run build

cd ../backend
npm install
$env:NODE_ENV='production'
npm start

# Visit http://localhost:5000
```

### Step 2: Create Azure Web App (2 min)
- Go to [portal.azure.com](https://portal.azure.com)
- Create → App Service
- Name: `your-app-name`
- Runtime: **Node 18 LTS**
- Region: Your closest region

### Step 3: Set Environment Variables (1 min)
In Azure Portal → Configuration → Application settings, add:
```
NODE_ENV=production
MONGODB_URI=[your-connection-string]
JWT_SECRET=[generate-random-key]
[... other settings from your .env ...]
```

### Step 4: Deploy (30 sec)
```powershell
cd d:\WinBuild 1.0\Ignite

# Option A: Using automated script
.\scripts\deploy-azure.ps1 -ResourceGroup "YourRG" -AppName "your-app-name"

# Option B: Manual Git push
git push azure main
```

### Step 5: Verify (30 sec)
```powershell
# Check health endpoint
https://your-app-name.azurewebsites.net/health

# View logs
az webapp log tail --resource-group "YourRG" --name "your-app-name"
```

---

## 📋 Files to Know

| File | Purpose |
|------|---------|
| [AZURE_DEPLOYMENT.md](docs/AZURE_DEPLOYMENT.md) | Complete step-by-step guide |
| [AZURE_DEPLOYMENT_CHECKLIST.md](docs/AZURE_DEPLOYMENT_CHECKLIST.md) | Pre/post deployment checklist |
| [AZURE_DEPLOYMENT_SUMMARY.md](AZURE_DEPLOYMENT_SUMMARY.md) | Summary of changes made |
| [FRONTEND_ENV_CONFIG.md](FRONTEND_ENV_CONFIG.md) | Frontend environment setup |
| [scripts/deploy-azure.ps1](scripts/deploy-azure.ps1) | Automated deployment script |

---

## 🔑 Environment Variables (Azure Portal)

```
NODE_ENV                     = production
PORT                         = [auto-set by Azure]
MONGODB_URI                  = [your-atlas-uri]
JWT_SECRET                   = [secure-key]
JWT_EXPIRE                   = 7d
EMAIL_HOST                   = smtp.gmail.com
EMAIL_PORT                   = 587
EMAIL_USER                   = [your-email]
EMAIL_PASSWORD               = [app-password]
ADMIN_EMAIL                  = [admin-email]
ADMIN_PASSWORD               = [admin-password]
AZURE_OPENAI_ENDPOINT        = [your-endpoint]
AZURE_OPENAI_API_KEY         = [your-key]
AZURE_OPENAI_DEPLOYMENT      = gpt-4o-mini
AZURE_OPENAI_API_VERSION     = 2025-01-01-preview
MAX_FILE_SIZE                = 5242880
ALLOWED_FILE_TYPES           = pdf,doc,docx,jpg,jpeg,png
```

---

## 🔍 How It Works

### Local Development
```
React App (localhost:3000)
    ↓ API calls to
http://localhost:5000/api
    ↓
Express Server + Routes
    ↓
MongoDB
```

### Azure Production
```
https://your-app-name.azurewebsites.net
    ↓
Express Server
├─ Serves React from /frontend/build/
├─ Handles /api/* routes
└─ Connects to MongoDB Atlas
    ↓
MongoDB Atlas
```

---

## ✅ Verification Checklist

After deployment:

- [ ] Visit `https://your-app-name.azurewebsites.net` → See login page
- [ ] Visit `https://your-app-name.azurewebsites.net/health` → See `{"status":"OK"}`
- [ ] Login works with credentials
- [ ] Can create candidates/employees
- [ ] Database connections work
- [ ] No errors in console (F12)
- [ ] Assets load correctly (CSS, images)

---

## 🐛 Quick Troubleshooting

### App Won't Start
```powershell
# Check logs
az webapp log tail --resource-group "YourRG" --name "your-app-name"

# Common issue: Wrong PORT
# Azure auto-sets PORT, check it's not hardcoded
```

### Frontend Not Loading
```
Check:
1. npm run build was executed
2. frontend/build/ folder exists
3. Server.js serves static files correctly
4. No 404 errors in DevTools Network tab
```

### API Calls Fail
```
Check:
1. REACT_APP_API_URL=/api in frontend/.env
2. npm run build was done after changing .env
3. Backend routes are correct
4. No CORS errors in console
```

---

## 📚 Key Concepts

**Relative URLs**: 
- Frontend uses `/api` instead of `http://localhost:5000/api`
- Works on any domain automatically
- Same build works locally AND on Azure

**Environment Variables**:
- Set in Azure Portal (not in .env)
- Accessed via `process.env.VARIABLE_NAME`
- Never commit `.env` to Git

**Build & Deploy**:
- `npm run build` creates optimized React app
- Backend serves the build folder
- Single Node.js app on Azure

---

## 🎓 Important Notes

⚠️ **Before Deploying:**
1. Test locally with `NODE_ENV=production`
2. Create MongoDB Atlas account (free tier available)
3. Set up Azure account (free $200 credits available)
4. Never commit `.env` files

🔒 **Security:**
- Change JWT_SECRET to something long and random
- Use app-specific passwords for email
- Enable HTTPS only (Azure does this automatically)
- Keep MongoDB IP whitelist restricted

⚡ **Performance:**
- React build is optimized and minified
- Express serves static files efficiently
- Use Azure CDN for images (optional)
- Consider Premium App Service Plan for production

---

## 🆘 Need Help?

1. **Deployment Guide**: See [AZURE_DEPLOYMENT.md](docs/AZURE_DEPLOYMENT.md)
2. **Checklist**: Use [AZURE_DEPLOYMENT_CHECKLIST.md](docs/AZURE_DEPLOYMENT_CHECKLIST.md)
3. **Changes Made**: Review [AZURE_DEPLOYMENT_SUMMARY.md](AZURE_DEPLOYMENT_SUMMARY.md)
4. **Frontend Config**: Check [FRONTEND_ENV_CONFIG.md](FRONTEND_ENV_CONFIG.md)
5. **Automated Script**: Run [scripts/deploy-azure.ps1](scripts/deploy-azure.ps1)

---

## 🚀 Next Actions

```powershell
# 1. Test locally
cd d:\WinBuild 1.0\Ignite\frontend && npm run build
cd ../backend && npm install
$env:NODE_ENV='production' && npm start
# → Visit http://localhost:5000

# 2. Create Azure Web App
# → Go to portal.azure.com

# 3. Deploy
git push azure main

# 4. Monitor
az webapp log tail --resource-group "YourRG" --name "your-app-name"
```

---

## 💡 Pro Tips

✅ Use the automated script: `.\scripts\deploy-azure.ps1`  
✅ Keep a staging slot for testing before production  
✅ Set up daily backups in Azure  
✅ Monitor with Application Insights  
✅ Use deployment slots for zero-downtime updates  

---

**Status**: 🟢 Ready for Azure Deployment  
**Created**: December 21, 2025  
**All Changes Complete**: ✅
