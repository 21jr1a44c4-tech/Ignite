## Azure App Service Deployment - How It Works

### What Azure Recognizes

When you push your code to Azure App Service, it will:

1. **Read `.deployment` file** → Knows to run `deploy.cmd`
2. **Run `deploy.cmd`** → Builds frontend + installs backend dependencies
3. **Read `web.config`** → IIS configuration for routing
4. **Start the app** → Runs `node backend/server.js` via npm start in root `package.json`

### File Structure Azure Expects

```
WinBuild1-THEIGNITE/
├── .deployment          ← Azure reads this first
├── deploy.cmd           ← Build & setup script
├── web.config           ← IIS routing configuration
├── package.json         ← ROOT package.json (NEW) - tells Azure how to start
├── backend/
│   ├── server.js        ← Actual server entry point
│   ├── package.json     ← Backend dependencies
│   └── ...
├── frontend/
│   ├── package.json     ← Frontend dependencies
│   ├── public/
│   ├── src/
│   └── build/           ← Generated after deploy.cmd runs
└── README.md
```

### Deployment Flow in Azure

```
1. Git Push
   ↓
2. Azure reads .deployment
   ↓
3. Runs deploy.cmd
   ├─ cd frontend && npm install
   ├─ npm run build → creates /frontend/build/
   └─ cd backend && npm install --production
   ↓
4. Azure starts app using root package.json "start" script
   └─ npm start → cd backend && node server.js
   ↓
5. web.config routes requests:
   ├─ /api/* → Node.js backend
   ├─ /* (SPA) → Serves React build from /frontend/build/
   └─ SINGLE_SERVICE=true env var enables this mode
   ↓
6. App Running on http://your-app.azurewebsites.net
```

### What Azure Does NOT Need From You

❌ **You don't need to:**
- Upload already-built files
- Pre-install node_modules
- Manually create the build folder
- Tell Azure where server.js is (web.config does this)
- Provide detailed startup instructions

✅ **You ONLY push:**
- Source code (backend/ and frontend/ folders)
- Configuration files (.deployment, deploy.cmd, web.config, package.json files)
- .env or configuration will be set via Azure Portal environment variables

### How Azure Finds server.js

```
.deployment → reads command = deploy.cmd
deploy.cmd → runs npm install in backend, builds frontend
web.config → tells IIS: route to backend/server.js
package.json (root) → tells npm: cd backend && node server.js
```

### Environment Variables Setup

After push to Azure, go to **Azure Portal → Configuration → Application Settings**:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
NODE_ENV=production
SINGLE_SERVICE=true
PORT=8080
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

These will override the .env file when app starts.

### Azure Startup Process Summary

| Step | What Happens |
|------|-------------|
| **1. Detect** | Azure sees Node.js repo with .deployment file |
| **2. Build** | Runs deploy.cmd (our custom deployment script) |
| **3. Install** | npm install runs in both backend and frontend |
| **4. Configure** | Reads web.config for IIS + application settings |
| **5. Start** | Runs `npm start` from root package.json |
| **6. Listen** | Server listens on PORT (8080) |
| **7. Route** | web.config routes requests via iisnode |

### Your Files Are Ready

✅ `.deployment` - Configured
✅ `deploy.cmd` - Builds frontend + backend
✅ `web.config` - Routes traffic to Node.js
✅ `package.json` (root) - NEW - Tells Azure how to start
✅ `backend/server.js` - Entry point
✅ `backend/package.json` - Backend dependencies
✅ `frontend/` - Source code (will be built by deploy.cmd)

### Test Before Pushing (Optional)

To simulate Azure deployment locally:

```powershell
# Build frontend
cd frontend
npm install
npm run build
cd ../backend

# Simulate production environment
$env:SINGLE_SERVICE="true"
$env:NODE_ENV="production"
$env:PORT="8080"

# Start like Azure would
node server.js

# Visit http://localhost:8080
```

### Common Azure Startup Errors & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot find module backend/server.js" | web.config not configured right | Already fixed ✓ |
| "Cannot find module react/build" | deploy.cmd didn't run | Check .deployment file |
| API returning 404 | CORS not configured | SINGLE_SERVICE=true in env vars |
| Frontend shows "Cannot GET /" | SPA routing not working | web.config SPA rule issue |
| Port already in use | PORT conflict | Azure auto-assigns, usually 8080 |

### Deployment Checklist

Before pushing to Azure:

- [ ] Root package.json exists with correct "start" script
- [ ] `.deployment` file points to deploy.cmd
- [ ] `deploy.cmd` builds frontend then installs backend
- [ ] `web.config` routes to backend/server.js
- [ ] backend/server.js has `SINGLE_SERVICE` detection
- [ ] frontend/api.js uses smart URL detection
- [ ] All secrets in Azure env vars (NOT .env files)
- [ ] Test locally first with SINGLE_SERVICE=true

### Final Answer to Your Question

**Q: Do I have to provide entire code?**
A: Yes, push everything. Azure clones your repo and runs deploy.cmd.

**Q: Will it recognize where is the server file?**
A: Yes! The combination of:
- `.deployment` → deploy.cmd
- `deploy.cmd` → installs/builds
- `web.config` → routes to backend/server.js
- Root `package.json` → npm start runs the server

**Q: How to start?**
A: `npm start` (from root) → `cd backend && node server.js`
   This is configured in root package.json

All automatic! You just push code. Azure handles the rest.
