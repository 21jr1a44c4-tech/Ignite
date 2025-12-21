# ✅ Azure Deployment Checklist

## Pre-Deployment Verification

### Local Testing
- [ ] All localhost URLs have been updated to environment variables
- [ ] Frontend `.env` uses relative URLs: `/api` and `/`
- [ ] Backend `.env` has production values or will be set in Azure
- [ ] Test build locally:
  ```powershell
  cd frontend && npm run build
  cd ../backend && npm install
  $env:NODE_ENV='production'
  npm start
  ```
- [ ] Verify app loads at `http://localhost:5000`
- [ ] Test API calls work correctly
- [ ] MongoDB connection test successful
- [ ] Email functionality works (optional, but recommended)

### Code Review
- [ ] No hardcoded localhost URLs remaining
- [ ] All API endpoints use relative URLs
- [ ] Environment variables are properly referenced
- [ ] `server.js` serves React build files
- [ ] SPA fallback route is configured
- [ ] CORS is properly configured
- [ ] Error handling is in place

### Dependencies
- [ ] `backend/package.json` has build script
- [ ] `npm run build` command works
- [ ] Frontend build completes without errors
- [ ] Backend installs all dependencies

---

## Azure Setup

### Azure Portal Configuration
- [ ] Resource Group created
- [ ] Web App created (Node 18 LTS)
- [ ] App Service Plan selected (Basic B1 or higher)
- [ ] Region chosen (closest to your location)

### Environment Variables (Azure Portal → Configuration → Application settings)
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000` (auto-set by Azure, verify)
- [ ] `MONGODB_URI=[your-connection-string]`
- [ ] `FRONTEND_URL=https://your-app-name.azurewebsites.net`
- [ ] `BACKEND_URL=https://your-app-name.azurewebsites.net`
- [ ] `JWT_SECRET=[secure-random-key]`
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER=[your-email]`
- [ ] `EMAIL_PASSWORD=[app-specific-password]`
- [ ] `AZURE_OPENAI_ENDPOINT=[your-endpoint]`
- [ ] `AZURE_OPENAI_API_KEY=[your-key]`
- [ ] `AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini`
- [ ] `AZURE_OPENAI_API_VERSION=2025-01-01-preview`
- [ ] All other sensitive config values set

### Startup Configuration (Azure Portal → Configuration → General settings)
- [ ] Startup Command set to: `npm start`
- [ ] Stack Settings: Node 18 LTS
- [ ] Platform: 64-bit

### Application Settings
- [ ] HTTPS Only: **ON**
- [ ] FTP state: **FTPS Only** (for security)
- [ ] Managed pipeline version: **Integrated**

---

## Deployment Methods

### Method 1: Git Push (Recommended for CI/CD)
- [ ] Initialize Git in project root
- [ ] Create `.gitignore` with:
  ```
  node_modules/
  .env
  frontend/.env
  frontend/build/
  backend/uploads/
  ```
- [ ] Commit all code
- [ ] Configure local Git deployment user in Azure
- [ ] Add Azure remote: `git remote add azure [url]`
- [ ] Push to Azure: `git push azure main`
- [ ] Monitor deployment logs
- [ ] Verify success in Azure Portal

### Method 2: ZIP Deploy
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Create ZIP file containing:
  - `backend/` (including node_modules)
  - `frontend/build/`
  - `.json` files
  - Root config files
- [ ] DO NOT include:
  - `.env` files
  - `node_modules/` (will be installed by Azure)
  - `frontend/src/` 
  - `frontend/node_modules/`
- [ ] Deploy ZIP via Azure CLI:
  ```powershell
  az webapp deployment source config-zip --resource-group [rg] --name [app-name] --src deployment.zip
  ```

### Method 3: Visual Studio Code Extension
- [ ] Install Azure App Service extension
- [ ] Sign in to Azure
- [ ] Right-click App Service → Deploy to Web App
- [ ] Select folder to deploy
- [ ] Wait for deployment to complete

---

## Post-Deployment Verification

### Application Startup
- [ ] Check if app is running: `https://your-app-name.azurewebsites.net/health`
- [ ] Should return: `{"status":"OK","message":"Server is running"}`
- [ ] Check logs for errors:
  ```powershell
  az webapp log tail --resource-group [resource-group] --name [app-name]
  ```

### Frontend & Backend
- [ ] Homepage loads at: `https://your-app-name.azurewebsites.net/`
- [ ] See login page with correct styling
- [ ] No 404 errors in console
- [ ] No CORS errors
- [ ] Assets load correctly (CSS, images, etc.)

### API Endpoints
- [ ] Login endpoint works: `POST /api/auth/login`
- [ ] Candidate creation works: `POST /api/candidates`
- [ ] Employee list works: `GET /api/employees`
- [ ] Admin dashboard accessible
- [ ] HR endpoints working

### Database Connection
- [ ] MongoDB connection successful
- [ ] Can read/write data
- [ ] Admin account exists
- [ ] Check Azure logs:
  ```
  ✅ MongoDB Connected Successfully
  ```

### Static Files
- [ ] React app files serve correctly
- [ ] JavaScript bundles load
- [ ] CSS files load without errors
- [ ] Images and assets load

### Email System
- [ ] Test email sending (if configured)
- [ ] Verify email credentials are correct
- [ ] Check SMTP settings are correct
- [ ] Test with known email address

---

## Performance & Monitoring

### Enable Monitoring
- [ ] Application Insights enabled
- [ ] Custom metrics set up
- [ ] Alerts configured (CPU, Memory, HTTP errors)
- [ ] Daily backup configured (optional but recommended)

### Performance Check
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] CPU usage reasonable (< 50%)

### Logs & Diagnostics
- [ ] Application logs enabled
- [ ] Web server logs enabled
- [ ] Diagnostic logs retained (30 days)
- [ ] Can access logs via Azure portal

---

## Security Review

### Configuration Security
- [ ] No `.env` file in repository
- [ ] Secrets stored in Azure Key Vault (optional but recommended)
- [ ] HTTPS enforced (HTTPS only: ON)
- [ ] FTP disabled for security
- [ ] SSH key access secured

### Application Security
- [ ] CORS properly configured
- [ ] JWT tokens working
- [ ] Authentication required for sensitive endpoints
- [ ] Password hashing verified
- [ ] Input validation in place
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection enabled

### Data Security
- [ ] Database connection string secured
- [ ] Sensitive data not logged
- [ ] Uploaded files validated
- [ ] File size limits enforced
- [ ] Allowed file types restricted

---

## Troubleshooting Checklist

### App Not Starting
- [ ] Check startup command in Azure portal
- [ ] Verify Node.js version (should be 18 LTS)
- [ ] Check package.json has correct main file
- [ ] Verify PORT environment variable is set
- [ ] View detailed logs:
  ```powershell
  az webapp log tail --resource-group [rg] --name [app-name]
  ```

### Database Connection Issues
- [ ] MONGODB_URI is correct
- [ ] MongoDB Atlas IP whitelist includes Azure IP (0.0.0.0/0)
- [ ] Network connectivity test:
  ```
  telnet winonboard.gl3uh8u.mongodb.net 27017
  ```

### Frontend Not Loading
- [ ] Verify frontend build was completed
- [ ] Check build folder exists: `frontend/build/`
- [ ] Verify `index.html` is in build folder
- [ ] Check static file serving configuration
- [ ] Verify file paths in server.js

### API Endpoints Failing
- [ ] Check all routes are properly registered
- [ ] Verify URL paths match frontend requests
- [ ] Check request/response content-type
- [ ] Verify authentication tokens if required
- [ ] Check for CORS errors in browser console

### Static Resources Not Loading
- [ ] Check CSS/JS file paths
- [ ] Verify webpack bundling worked
- [ ] Check file permissions
- [ ] Look for 404 errors in logs
- [ ] Verify correct MIME types served

### Email Not Sending
- [ ] Verify EMAIL_USER is correct
- [ ] Check EMAIL_PASSWORD (use app-specific password for Gmail)
- [ ] Verify SMTP settings
- [ ] Check for firewall/SSL issues
- [ ] Test with nodemailer directly

---

## Rollback Plan

If deployment fails or causes issues:

### Immediate Actions
- [ ] Check Azure logs for errors
- [ ] Review recent commits
- [ ] Check environment variables
- [ ] Verify database connection

### Rollback Steps
- [ ] Stop the web app (via Azure portal)
- [ ] Review previous deployment
- [ ] Fix issues locally
- [ ] Redeploy with corrections
- [ ] Monitor carefully

### Using Deployment Slots (Advanced)
- [ ] Create staging slot
- [ ] Deploy to staging first
- [ ] Test thoroughly
- [ ] Swap slots to production
- [ ] Keep old slot as quick rollback

---

## Maintenance Tasks

### Regular Checks (Weekly)
- [ ] Review application logs
- [ ] Check Azure cost
- [ ] Monitor performance metrics
- [ ] Test critical user flows

### Monthly Checks
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Test backup/restore
- [ ] Analyze performance trends
- [ ] Review user analytics

### Quarterly Checks
- [ ] Security audit
- [ ] Performance optimization
- [ ] Disaster recovery test
- [ ] Capacity planning
- [ ] Technology updates

---

## Documentation

### Keep Updated
- [ ] README.md with Azure deployment info
- [ ] Environment variables documentation
- [ ] API endpoint documentation
- [ ] Troubleshooting guide
- [ ] Runbook for common tasks

---

## Success Criteria

✅ Deployment is successful when:

1. **Application loads** - `https://your-app-name.azurewebsites.net/` returns login page
2. **API works** - `https://your-app-name.azurewebsites.net/health` returns status
3. **Authentication works** - Can login with credentials
4. **Database works** - Can read/write data
5. **Static files serve** - CSS, JS, images load correctly
6. **No errors** - Azure logs show no critical errors
7. **Performance acceptable** - Page load time < 3 seconds
8. **Monitoring active** - Can view application insights

---

## Contact & Support

For issues during deployment:

1. Check [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for detailed guide
2. Review Azure logs:
   ```powershell
   az webapp log tail --resource-group [rg] --name [app-name]
   ```
3. Test locally first before making Azure changes
4. Check Azure documentation for service-specific issues
5. Contact Microsoft support if needed

---

## Quick Reference

### Deployment Commands
```powershell
# Build frontend
cd frontend && npm run build

# Install backend deps
cd ../backend && npm install

# Deploy via Git
git push azure main

# Deploy via ZIP
az webapp deployment source config-zip --resource-group [rg] --name [app] --src deployment.zip

# View logs
az webapp log tail --resource-group [rg] --name [app]

# Restart app
az webapp restart --resource-group [rg] --name [app]
```

### Azure Portal Quick Links
- Web App Overview: `https://portal.azure.com/#resource/subscriptions/[sub]/resourceGroups/[rg]/providers/Microsoft.Web/sites/[app-name]`
- Configuration: `.../Configuration`
- Application Insights: `.../Monitoring/Application Insights`
- Logs: `.../Monitoring/Log stream`

---

**Checklist Version**: 1.0  
**Last Updated**: December 21, 2025  
**Status**: Ready for Deployment ✅
