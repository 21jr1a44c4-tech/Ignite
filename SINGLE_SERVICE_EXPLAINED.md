# Single Service Architecture - Frontend + Backend Together

## The Key Concept

**You DON'T start both separately.**

Only the **BACKEND** server starts. The **FRONTEND** is already built before the server starts.

## Timeline

```
┌─────────────────────────────────────────────────────┐
│ USER PUSHES CODE TO AZURE                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ AZURE DETECTS NODE.JS REPO                          │
│ - Finds .deployment file                            │
│ - Finds package.json                                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 1: DEPLOYMENT (One-time during deploy.cmd)    │
├─────────────────────────────────────────────────────┤
│ ✓ npm install (root)                                │
│ ✓ cd frontend && npm install && npm run build       │
│   └─ Creates /frontend/build/ (compiled React)      │
│ ✓ cd backend && npm install --production            │
│   └─ Only production dependencies                   │
│ ✓ RESULT: Frontend is BUILT, not running            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 2: STARTUP (npm start)                        │
├─────────────────────────────────────────────────────┤
│ Run: cd backend && node server.js                   │
│                                                     │
│ Server detects: SINGLE_SERVICE=true                 │
│ ├─ Express starts on port 8080                      │
│ ├─ Loads backend routes (/api/*)                    │
│ └─ Serves pre-built /frontend/build/ directory      │
│                                                     │
│ RESULT: ONE process running, serving BOTH           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ APP IS LIVE                                         │
├─────────────────────────────────────────────────────┤
│ User visits: https://your-app.azurewebsites.net    │
│                                                     │
│ Request: GET /                                      │
│ ├─ Routed through web.config                        │
│ ├─ Node.js server receives                          │
│ ├─ Not an /api/* route                              │
│ ├─ Server serves /frontend/build/index.html         │
│ └─ React app loads in browser                       │
│                                                     │
│ Request: GET /api/auth/login                        │
│ ├─ Routed through web.config                        │
│ ├─ Node.js server receives                          │
│ ├─ Is /api/* route                                  │
│ ├─ Express handles it                               │
│ └─ Returns JSON response                            │
└─────────────────────────────────────────────────────┘
```

## Architecture Diagram

```
┌──────────────────────────────────────────────────┐
│          AZURE APP SERVICE (Single Port 8080)    │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │    WEB.CONFIG (IIS URL Rewriting)          │ │
│  │                                            │ │
│  │  Request → /api/* → Route to Node.js       │ │
│  │  Request → /* → Route to Node.js           │ │
│  └────────┬───────────────────────────────────┘ │
│           ↓                                      │
│  ┌────────────────────────────────────────────┐ │
│  │   NODE.JS BACKEND SERVER                   │ │
│  │   (backend/server.js)                      │ │
│  │                                            │ │
│  │  if (isSingleService) {                    │ │
│  │    ├─ Serve /frontend/build/               │ │
│  │    └─ Handle React SPA routing              │ │
│  │  }                                         │ │
│  │                                            │ │
│  │  Handle /api/* routes                      │ │
│  │  ├─ /api/auth/*                            │ │
│  │  ├─ /api/candidates/*                      │ │
│  │  ├─ /api/employees/*                       │ │
│  │  └─ /api/onboarding/*                      │ │
│  │                                            │ │
│  │  Serve static files                        │ │
│  │  ├─ /uploads/*                             │ │
│  │  ├─ /documents/*                           │ │
│  │  └─ /assets/*                              │ │
│  └────────────────────────────────────────────┘ │
│           ↓                                      │
│  ┌────────────────────────────────────────────┐ │
│  │   DATABASE                                 │ │
│  │   MongoDB (via MONGODB_URI env var)        │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

## Files Involved in Azure Startup

| File | Purpose | When |
|------|---------|------|
| `.deployment` | Tells Azure which deployment script to run | Startup |
| `deploy.cmd` | Builds frontend + installs dependencies | First time (deployment) |
| `web.config` | IIS routing rules | Every request |
| `package.json` (root) | Tells Azure what "npm start" does | Startup |
| `backend/server.js` | The actual running process | Startup + Forever |
| `frontend/build/` | Pre-built React (created by deploy.cmd) | Served by Node.js |
| `backend/package.json` | Backend dependencies | Installation only |
| `frontend/package.json` | Frontend dependencies | Installation only |

## Processes Running in Azure

```
┌─────────────────────────┐
│  Azure App Service      │
├─────────────────────────┤
│  Process 1:             │
│  ├─ node server.js      │
│  ├─ Port: 8080          │
│  ├─ Serves: Frontend +  │
│  │  Backend APIs        │
│  └─ Status: RUNNING     │
│                         │
│  Process 2, 3... N: --  │
│  (None. Only 1 server!) │
└─────────────────────────┘
```

## Why Only Backend Server?

| Question | Answer |
|----------|--------|
| Where is the frontend? | In `/frontend/build/` - already compiled JavaScript/HTML |
| Why not start npm in frontend? | Because React is a client-side framework (browser code), not a server |
| Can we start both? | No. Frontend doesn't need a server. It's just static files. |
| What serves the frontend? | The backend (Node.js) serves it as static files |
| Does frontend have a server.js? | No. Only backend does. |

## Root package.json "start" Script

```json
"start": "cd backend && node server.js"
```

This is what Azure runs. It:
1. Changes directory to backend
2. Starts Node.js with server.js
3. Server.js checks `SINGLE_SERVICE=true` env var
4. Server serves frontend build + handles API routes
5. Done!

## Environment Variables in Azure

Set these in Azure Portal:

```
NODE_ENV=production
SINGLE_SERVICE=true
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-key
PORT=8080
```

The backend server reads these and configures itself appropriately.

## What Happens at Each URL

| URL | Handler | Response |
|-----|---------|----------|
| `https://your-app.azurewebsites.net/` | Node.js → Express → serves `/frontend/build/index.html` | React SPA loads |
| `https://your-app.azurewebsites.net/login` | Node.js → Express → not found in routes → serves `/frontend/build/index.html` | React Router handles navigation |
| `https://your-app.azurewebsites.net/api/auth/login` | Node.js → Express → auth.routes.js | JSON response |
| `https://your-app.azurewebsites.net/uploads/file.pdf` | Node.js → Express → static serve | File downloaded |

## Summary

**Frontend + Backend in Single Service = Only Backend Process Runs**

- Frontend is **pre-built** (done during deploy.cmd)
- Frontend is served by backend as **static files**
- Only **one Node.js process** runs
- All traffic goes through **one port (8080)**
- Backend server handles **both API and SPA routes**

✅ This is the correct, efficient way to deploy both together!
