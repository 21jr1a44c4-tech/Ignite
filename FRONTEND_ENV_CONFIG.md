# Frontend Environment Configuration

## Overview
The frontend has been configured to work with both local development (localhost) and Azure production environments.

---

## Development Environment (Local)

### `.env` File for Local Development
```dotenv
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
```

**Usage**:
- Run: `npm start`
- App loads at: `http://localhost:3000`
- Backend is at: `http://localhost:5000`
- All API calls go to: `http://localhost:5000/api`

---

## Production Environment (Azure)

### `.env` File for Production
```dotenv
REACT_APP_API_URL=/api
REACT_APP_BACKEND_URL=/
```

**Why Relative URLs?**
- When app is built, environment variables are baked into the code
- Relative URLs work on ANY domain:
  - Local: `http://localhost:5000/api`
  - Azure: `https://your-app-name.azurewebsites.net/api`
  - Custom domain: `https://myapp.com/api`

**Benefits**:
- ✅ No hardcoding URLs
- ✅ Same build works everywhere
- ✅ Easy migrations
- ✅ Automatic domain handling

---

## How API Calls Work

### All Components Use This Pattern:

```javascript
const BACKEND_URL = process.env.REACT_APP_API_URL || '/api';

// In development (localhost):
// BACKEND_URL = 'http://localhost:5000/api'
// API call: http://localhost:5000/api/auth/login

// In production (Azure):
// BACKEND_URL = '/api'
// API call: https://your-app-name.azurewebsites.net/api/auth/login
```

### Updated Components:

1. **frontend/src/utils/api.js**
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL;
   const api = axios.create({
     baseURL: API_URL,
   });
   ```

2. **frontend/src/components/WinWireChat.js**
   ```javascript
   const BACKEND_URL = process.env.REACT_APP_API_URL || '/api';
   ```

3. **frontend/src/components/EmployeeChatbot.js**
   ```javascript
   const BACKEND_URL = process.env.REACT_APP_API_URL || '/api';
   ```

---

## Build Process

### Local Development
```powershell
cd frontend
npm install
npm start  # Starts dev server on http://localhost:3000
```

### Production Build
```powershell
cd frontend
npm install
npm run build  # Creates optimized build in ./build folder
```

The build folder contains:
```
build/
├── index.html          (main entry point)
├── static/
│   ├── js/             (bundled JavaScript)
│   ├── css/            (bundled CSS)
│   └── media/          (images, fonts, etc.)
└── favicon.ico
```

---

## Environment Variable Switching

### Method 1: Using .env Files
Create different `.env` files:

- `.env` (current - uses relative URLs)
- `.env.development.local` (local development)
- `.env.production.local` (production)

Switch by renaming or updating `.env` file before building.

### Method 2: Build-Time Configuration
Set environment variables before running `npm run build`:

```powershell
# Linux/Mac
export NODE_ENV=production
export REACT_APP_API_URL=/api
npm run build

# Windows PowerShell
$env:NODE_ENV='production'
$env:REACT_APP_API_URL='/api'
npm run build
```

### Method 3: CI/CD Pipeline (Recommended)
Use GitHub Actions or Azure Pipelines to automatically set variables during build.

---

## Testing Environment Variables

### Check What's Baked In:

After running `npm run build`, check the built files:

```powershell
# Search for the API URL in the built code
Select-String -Path "build/static/js/*.js" -Pattern "api" | Select-Object -First 5
```

The relative URLs are embedded in the JavaScript bundles.

---

## Deployment Scenarios

### Scenario 1: Local Development
```
User Browser (localhost:3000)
    ↓
Frontend React App
    ↓
API calls to localhost:5000
    ↓
Backend Express Server
```

**Environment**: `.env` with `http://localhost:5000/api`

### Scenario 2: Azure Single App
```
User Browser (your-app-name.azurewebsites.net)
    ↓
Express Server (serves React build)
    ↓
Frontend React App (from build/)
    ↓
API calls to /api (same server)
    ↓
Express Routes
    ↓
MongoDB Atlas
```

**Environment**: `.env` with `/api`

### Scenario 3: Separate Frontend & Backend (Future)
```
User Browser (frontend.azurewebsites.net)
    ↓
Frontend App Service (React)
    ↓
API calls to backend.azurewebsites.net/api
    ↓
Backend App Service
```

**Environment**: `.env` with `https://backend.azurewebsites.net/api`

---

## Switching Between Environments

### For Local Development
```bash
# Make sure .env has localhost URLs
REACT_APP_API_URL=http://localhost:5000/api

# Start development
npm start
```

### For Azure Deployment
```bash
# Make sure .env has relative URLs
REACT_APP_API_URL=/api

# Build production version
npm run build

# Deploy the build/ folder with backend
```

### For Custom Domain (Future)
```bash
# Make sure .env has the custom domain
REACT_APP_API_URL=https://api.yourdomain.com

# Build
npm run build

# Deploy
```

---

## Troubleshooting

### "Cannot GET /api/..." in Browser

**Cause**: Frontend can't find backend API

**Solutions**:
1. Check `REACT_APP_API_URL` is correct in `.env`
2. Run `npm run build` after changing `.env`
3. Verify backend is running at the expected URL
4. Check network tab in browser DevTools

### "API calls work on localhost but not on Azure"

**Cause**: Hardcoded URL in code

**Solution**:
```javascript
// ❌ Wrong (hardcoded)
const API_URL = 'http://localhost:5000/api';

// ✅ Correct (uses environment variable)
const API_URL = process.env.REACT_APP_API_URL;
```

### Console Shows Relative URL Issues

**Cause**: Using wrong URL format

**Solutions**:
- Use `/api` instead of `http://localhost:5000/api`
- Use `${window.location.origin}/api` if needed dynamically
- Set environment variable before building

### Build Includes Wrong API URL

**Cause**: `.env` changed after build

**Solution**:
```powershell
# Clean build
rm -r node_modules
rm build
npm install
npm run build  # Uses current .env
```

---

## Best Practices

✅ **DO**:
- Use relative URLs for production (`/api`)
- Use environment variables, not hardcoded URLs
- Set environment variables before building
- Test locally before deploying
- Keep `.env` out of Git
- Use different `.env` files for different environments

❌ **DON'T**:
- Hardcode URLs like `http://localhost:5000`
- Change URLs without rebuilding
- Commit `.env` files to Git
- Assume localhost will work in cloud
- Use `window.location.href` for API URLs

---

## Configuration Reference

### Current Setup
```
Local Development:
  Frontend URL: http://localhost:3000
  Backend URL: http://localhost:5000
  API URL: http://localhost:5000/api
  .env: Uses hardcoded localhost

Azure Production:
  Frontend URL: https://your-app-name.azurewebsites.net
  Backend URL: https://your-app-name.azurewebsites.net
  API URL: https://your-app-name.azurewebsites.net/api
  .env: Uses relative URL /api
```

### How It Works:
```javascript
// In development (before build):
// .env: REACT_APP_API_URL=http://localhost:5000/api
const API_URL = process.env.REACT_APP_API_URL;
// Result: http://localhost:5000/api

// In production (built code on Azure):
// .env: REACT_APP_API_URL=/api
const API_URL = process.env.REACT_APP_API_URL;
// Result: /api → becomes https://your-app-name.azurewebsites.net/api
```

---

## Quick Reference

### Build Commands
```powershell
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build -l 3000
```

### Environment Files
```
.env                    # Current (for Azure: /api)
.env.development.local  # Local development
.env.production.local   # Production
.env.example           # Template
```

### API URL Patterns
```
Development:   http://localhost:5000/api
Production:    /api  (becomes https://your-app-name.azurewebsites.net/api)
Custom Domain: https://api.yourdomain.com
```

---

## Examples

### Example 1: Login API Call
```javascript
// Code in component
const API_URL = process.env.REACT_APP_API_URL; // /api
const response = await axios.post(`${API_URL}/auth/login`, credentials);

// In development:
// Actual URL: http://localhost:5000/api/auth/login

// In Azure:
// Actual URL: https://your-app-name.azurewebsites.net/api/auth/login
```

### Example 2: Get Employees
```javascript
const API_URL = process.env.REACT_APP_API_URL; // /api
const response = await axios.get(`${API_URL}/employees`);

// In development:
// Actual URL: http://localhost:5000/api/employees

// In Azure:
// Actual URL: https://your-app-name.azurewebsites.net/api/employees
```

### Example 3: File Upload
```javascript
const API_URL = process.env.REACT_APP_API_URL; // /api
const formData = new FormData();
formData.append('file', file);

const response = await axios.post(`${API_URL}/upload`, formData);

// In development:
// Actual URL: http://localhost:5000/api/upload

// In Azure:
// Actual URL: https://your-app-name.azurewebsites.net/api/upload
```

---

## Performance Tips

1. **Use Relative URLs**: Faster resolution, no DNS lookup
2. **Cache-busting**: Filenames include hashes, cache forever
3. **Minification**: Built version is much smaller
4. **Code Splitting**: Only load what you need
5. **Enable Compression**: Server should gzip responses

---

## Debugging

### Check What API URL Is Being Used:
```javascript
// Add to any component
console.log('API URL:', process.env.REACT_APP_API_URL);
console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
```

### Monitor API Calls:
```
Browser DevTools → Network Tab
Look for API requests and their URLs
```

### Check Environment Variables:
```powershell
# Verify .env file contents
cat .env

# Check what npm sees
npm run env | grep REACT_APP
```

---

## Migration Guide

### From Hardcoded URLs to Environment Variables

**Before**:
```javascript
const API_URL = 'http://localhost:5000/api';
```

**After**:
```javascript
const API_URL = process.env.REACT_APP_API_URL || '/api';
```

### From Separate Apps to Single App

**Before**:
- Frontend: http://localhost:3000 (npm start)
- Backend: http://localhost:5000 (npm start)

**After**:
- Both: https://your-app-name.azurewebsites.net (Express serves both)

---

## Additional Resources

- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Environment Variables in Azure](https://docs.microsoft.com/en-us/azure/app-service/configure-common)
- [Express Static File Serving](https://expressjs.com/en/starter/static-files.html)

---

**Last Updated**: December 21, 2025  
**Status**: Production Ready ✅  
**Tested**: Local and Azure environments
