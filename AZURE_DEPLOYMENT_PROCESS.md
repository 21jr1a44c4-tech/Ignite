# How Azure Calls deploy.cmd - The Complete Flow

## Your Question Answered

**Q: Where did I configure npm install? There's no script in root package.json**
- Azure **automatically** runs `npm install` in root (it's default for Node.js projects)

**Q: How did it call deploy.cmd?**
- `.deployment` file tells Azure which deployment script to run

---

## The .deployment File (You Already Have This)

```
[config]
command = deploy.cmd
```

**This file is your configuration.** It tells Azure:
> "When deploying this repo, run `deploy.cmd` script"

---

## Complete Azure Deployment Process

```
┌─────────────────────────────────────────────────┐
│ USER PUSHES CODE TO AZURE                       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ AZURE KUDU (Deployment Engine) Starts           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Step 1: READ .deployment FILE                   │
│                                                 │
│ Azure looks for .deployment file                │
│ Finds: command = deploy.cmd                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Step 2: RUN deploy.cmd                          │
│                                                 │
│ Executes the batch file:                        │
│ - cd frontend && npm install && npm run build   │
│ - cd backend && npm install --production        │
│                                                 │
│ Result: /frontend/build/ created                │
│         /backend/node_modules/ created          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Step 3: RUN npm start                           │
│                                                 │
│ After deployment script succeeds,               │
│ Azure runs: npm start                           │
│                                                 │
│ (This is from root package.json)                │
│ "start": "cd backend && node server.js"         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Step 4: SERVER RUNNING                          │
│                                                 │
│ Node.js server listening on port 8080           │
│ Serving frontend + backend on single port       │
└─────────────────────────────────────────────────┘
```

---

## File Responsibilities

| File | What It Does | Who Reads It |
|------|--------------|--------------|
| `.deployment` | Tells Azure to run deploy.cmd | Azure (Kudu) |
| `deploy.cmd` | Builds frontend + installs backend | Azure (Kudu) - via .deployment |
| `package.json` (root) | Defines npm start command | Azure (Kudu) |
| `web.config` | IIS routing rules | IIS Server (during requests) |
| `backend/server.js` | Actual running process | Node.js Runtime |

---

## What Azure Does NOT Need From You

You don't need to add any "npm install" script because:

**Azure has built-in logic:**
```
if (packageJsonExists && !customDeploymentScript) {
  runNpmInstall()  // Default behavior
}
```

Since `.deployment` specifies a custom script (deploy.cmd), Azure:
1. Still recognizes it's Node.js project
2. Reads .deployment file
3. Runs deploy.cmd instead of default npm install
4. After deploy.cmd succeeds, runs npm start

---

## What You Have Configured (Correctly!)

✅ `.deployment` file exists
```
[config]
command = deploy.cmd
```

✅ `deploy.cmd` script exists
```bat
cd frontend && npm install && npm run build
cd backend && npm install --production
```

✅ Root `package.json` has start script
```json
"start": "cd backend && node server.js"
```

✅ `web.config` routes traffic
```xml
<handlers>
  <add name="iisnode" path="backend/server.js" verb="*" modules="iisnode" />
</handlers>
```

---

## The Actual Azure Commands (Behind the Scenes)

When you push to Azure, Kudu runs these automatically:

```bash
# 1. Clone your repo
git clone <your-repo>

# 2. Read .deployment file
# Finds: command = deploy.cmd

# 3. Run deploy.cmd
deploy.cmd
# Inside deploy.cmd:
#   cd frontend && npm install && npm run build
#   cd backend && npm install --production

# 4. Run npm start (from root package.json)
npm start
# Which is: cd backend && node server.js
```

---

## Why .deployment File is Important

Without `.deployment` file, Azure would:
```
npm install (root only)
npm start
```

But you need deploy.cmd to:
- Build frontend
- Install backend dependencies separately

With `.deployment`, Azure:
```
[run deploy.cmd]
  ├─ Build frontend
  └─ Install backend
[run npm start]
```

---

## Summary

| Question | Answer |
|----------|--------|
| Where is npm install configured? | Not in any script - Azure does it automatically (or via deploy.cmd) |
| How does Azure know about deploy.cmd? | Reads `.deployment` file which says: `command = deploy.cmd` |
| What happens first? | Azure reads .deployment, runs deploy.cmd |
| What happens second? | Azure runs npm start (from root package.json) |
| Which starts both? | Only backend starts (frontend is pre-built) |

---

## Checklist for Azure

- [x] `.deployment` file exists with `command = deploy.cmd`
- [x] `deploy.cmd` builds frontend and installs backend
- [x] Root `package.json` exists with `"start": "cd backend && node server.js"`
- [x] `web.config` routes to backend/server.js
- [x] Environment variables set in Azure (SINGLE_SERVICE=true, MONGODB_URI, etc.)

**Everything is configured correctly!** Your code is ready to deploy.
