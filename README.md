# WinWire Employee Onboarding System

A comprehensive full-stack Employee Onboarding Application with professional WinWire branding, featuring role-based access control, extensive document management, and automated 5-email onboarding workflow.

## 🚀 Features

### For HR/Admin:
- ✅ Create candidate profiles and upload offer letters
- ✅ Send offer emails with secure acceptance links
- ✅ Trigger joining process and send login credentials
- ✅ View all active employees in dashboard
- ✅ Review comprehensive onboarding submissions with 30+ fields
- ✅ View personal details, emergency contacts, bank information
- ✅ Review education scores and BTech semester certificates
- ✅ Approve submissions → **Updates dashboard FIRST, then triggers 5 automated emails**
- ✅ Reject submissions with remarks
- ✅ Auto-generate Employee IDs (WW00001, WW00002, etc.)
- ✅ Automated welcome email to all active employees about new joiner
- ✅ Dashboard with real-time statistics

### For Employees:
- ✅ Accept offer via secure token link
- ✅ Login with temporary credentials
- ✅ Complete comprehensive onboarding form with **5 tabs**:
  - **Personal Details** (NEW - First Tab): Name, DOB, Address, Emergency Contact, Bank Details, LinkedIn, Self Description
  - **Education**: Percentages (10th, 12th, Degree), Certificates, 9 BTech Semester Certificates + Provisional
  - **Experience**: Work history and relieving letters
  - **Identity**: Aadhaar, PAN, Address Proof documents
  - **Profile**: Photo, Full Name, Department, About Me
- ✅ Input validation (phone 10 digits, pincode 6 digits, IFSC 11 chars)
- ✅ Character counter for self-description (500 max)
- ✅ Track submission status
- ✅ Re-upload documents if rejected

### Automated Email Workflow (5 Professional Emails):
When HR approves onboarding, employee receives **5 sequential emails**:
1. **Welcome Email** - Support contacts table (HR, L&D, IT, Finance, Admin)
2. **Employee Details** - Employee ID, Manager, Resources + 3 PDF attachments
3. **WinPay Instructions** - Time tracking portal guide and instructions
4. **Mediclaim Insurance** - Premium calculator + Excel attachment
5. **Facebook Group** - Company social group invitation

**Plus:** All active employees receive welcome email about new team member

### Technical Features:
- ✅ JWT authentication with role-based access
- ✅ Secure file uploads with validation (15+ documents supported)
- ✅ **Background email processing** (doesn't block approval response)
- ✅ Professional WinWire design (Blue #0066CC, Orange #FF6600)
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Comprehensive form validations (client + server side)
- ✅ Auto-generated passwords with bcrypt hashing
- ✅ MongoDB for data persistence
- ✅ 30+ fields for complete employee data collection

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Gmail account for sending emails

## 🛠️ Complete Setup Guide (For Fresh Installation)

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/
2. Download the LTS version (v18 or higher recommended)
3. Run the installer and follow the installation wizard
4. Accept all default settings
5. Verify installation:
```bash
node --version
npm --version
```

### Step 2: Install MongoDB

**For Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Select Windows, MSI package
3. Run the installer
4. Choose "Complete" installation
5. **Important:** Check "Install MongoDB as a Service" during installation
6. Keep default data directory: `C:\Program Files\MongoDB\Server\8.2\data`
7. Click "Install"
8. Verify installation:
```bash
# Check if MongoDB service is running
Get-Service -Name MongoDB*
```

**For Mac:**
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**For Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 3: Extract Project Folder

1. Extract the `UseCaseSubmission` folder to your desired location
2. Example: `D:\UseCaseSubmission` or `C:\Projects\UseCaseSubmission`

### Step 4: Install Project Dependencies

**Backend Setup:**
```bash
# Navigate to project folder
cd D:\UseCaseSubmission

# Go to backend folder
cd backend

# Install all backend dependencies
npm install
```

**Frontend Setup:**
```bash
# Go back to project root
cd ..

# Go to frontend folder
cd frontend

# Install all frontend dependencies
npm install
```

### Step 5: Configure Environment Variables

The `.env` files are already configured, but verify:

**Backend** (`backend\.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/winwire_onboarding
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2025
JWT_EXPIRE=7d

# Email Configuration (Update with your Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Admin Seed
ADMIN_EMAIL=21jr1a05d0@gmail.com
ADMIN_PASSWORD=Admin@123

# Base URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

**Frontend** (`frontend\.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Step 6: Setup Gmail App Password (For Email Functionality)

1. Go to https://myaccount.google.com/
2. Click "Security" → "2-Step Verification" (Enable if not enabled)
3. Click "App passwords"
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Paste it in `backend\.env` as `EMAIL_PASSWORD` (without spaces)

## 🛠️ Installation

### 1. Clone the repository
```bash
cd d:\UseCaseSubmission
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/winwire_onboarding
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2025
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=kalyan.111457@gmail.com
EMAIL_PASSWORD=xibnsgvxqbxnnacf
EMAIL_FROM=kalyan.111457@gmail.com

# Admin Seed
ADMIN_EMAIL=21jr1a05d0@gmail.com
ADMIN_PASSWORD=Admin@123

# Base URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

The `.env` file is already configured:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
```

## 🚀 Running the Application

### Make sure MongoDB is running:

**Windows (if installed as service):**
MongoDB should start automatically. Verify with:
```bash
Get-Service -Name MongoDB*
```

If not running, start it:
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Start the Application

**Option 1: Run Both Servers in Separate Terminals**

**Terminal 1 - Backend:**
```bash
cd D:\UseCaseSubmission\backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd D:\UseCaseSubmission\frontend
npm start
```
✅ Frontend running on http://localhost:3000
Browser will open automatically

**Option 2: Run Both Servers (PowerShell)**

**Terminal 1:**
```bash
cd D:\UseCaseSubmission\backend; npm run dev
```

**Terminal 2:**
```bash
cd D:\UseCaseSubmission\frontend; npm start
```

### Access the Application

1. Open browser: http://localhost:3000
2. Login with default admin credentials:
   - **Email:** 21jr1a05d0@gmail.com
   - **Password:** Admin@123

### Stop the Application

Press `Ctrl + C` in both terminal windows

## 👤 Default Admin Credentials

**Email:** 21jr1a05d0@gmail.com  
**Password:** Admin@123

## 📖 Complete User Flow

### HR Workflow:
1. **Login** with admin credentials at http://localhost:3000
2. **Dashboard View:**
   - See total candidates, accepted offers, pending submissions
   - View **Active Employees** section with Employee ID, Name, Email, Department, Phone, Status
3. **Create Candidate:**
   - Add candidate profile (name, email, position, department)
   - Upload offer letter PDF
4. **Send Offer:**
   - System sends professional offer email to candidate with acceptance link
5. **Wait for Acceptance:**
   - Candidate clicks "Accept Offer" in email
   - Offer status changes to "ACCEPTED"
6. **Trigger Joining:**
   - Click "Trigger Joining Process"
   - System sends login credentials email to employee
7. **Review Submissions:**
   - Navigate to "View Submissions"
   - Filter by: All, Pending, Approved, Rejected
   - Click "View Details" to see complete submission
8. **Review Complete Submission:**
   - ✅ Personal Information (First/Middle/Last Name, DOB, LinkedIn)
   - ✅ Address Details (Full Address, City, State, Pincode)
   - ✅ Emergency Contact (Name, Phone, Relation)
   - ✅ Bank Details (Account Number, Bank Name, IFSC)
   - ✅ Self Description
   - ✅ Educational Scores (10th, 12th, Degree percentages)
   - ✅ Educational Certificates (10th, 12th, Degree)
   - ✅ BTech Semester Certificates (1-1 through 4-2 + Provisional)
   - ✅ Work Experience
   - ✅ Identity Documents (Aadhaar, PAN, Address Proof)
   - ✅ Profile Photo and About Me
9. **Approve Submission:**
   - Add optional HR remarks
   - Click "Approve & Create Employee"
   - **System Flow:**
     - ✅ Submission status → APPROVED (saved to database)
     - ✅ Employee record created with Employee ID (WW00001)
     - ✅ User credentials generated
     - ✅ **Dashboard updated immediately** ← Shows in Active Employees
     - ✅ Response sent to HR (approval confirmed)
     - ✅ **Background process starts** (doesn't block HR):
       - Email 1: Welcome + Support Contacts (sent)
       - 2-second delay
       - Email 2: Employee Details + 3 PDFs (sent)
       - 2-second delay
       - Email 3: WinPay Time Tracking (sent)
       - 2-second delay
       - Email 4: Mediclaim Insurance + Excel (sent)
       - 2-second delay
       - Email 5: Facebook Group (sent)
     - ✅ Welcome email sent to all active employees
10. **Verify New Employee:**
    - Check "Active Employees" section in dashboard
    - New employee appears with Employee ID, Name, Email, Status

### Employee Workflow:
1. **Receive Offer Email:**
   - Email contains offer letter attachment
   - Click "Accept Offer" button (secure token link)
2. **Accept Offer:**
   - Redirected to acceptance confirmation page
   - Offer status updated to "ACCEPTED"
3. **Receive Login Credentials:**
   - HR triggers joining process
   - Email with username (email) and temporary password
   - Password format: FIRST3LETTERS@WW2025
4. **Login to Portal:**
   - Go to http://localhost:3000
   - Login with credentials
5. **Complete Onboarding Form (5 Tabs):**
   
   **Tab 1: Personal Details** (Required First)
   - First Name, Middle Name, Last Name
   - Date of Birth (date picker)
   - LinkedIn URL (optional)
   - Full Address (textarea)
   - City, State, Pincode (6 digits)
   - Emergency Contact: Name, Phone (10 digits), Relation
   - Bank Details: Account Number, Bank Name, IFSC (11 chars, auto-uppercase)
   - Self Description (max 500 characters with counter)

   **Tab 2: Education**
   - 10th Percentage (0-100, decimal allowed)
   - 12th/Intermediate Percentage
   - Degree/BTech Percentage
   - Upload 10th Certificate (PDF/JPG/PNG)
   - Upload 12th Certificate
   - Upload Degree Certificate
   - **BTech Semester Certificates** (Optional - 9 files):
     - Semester 1-1, 1-2
     - Semester 2-1, 2-2
     - Semester 3-1, 3-2
     - Semester 4-1, 4-2
     - Provisional Certificate
   - Additional Certifications (up to 5)

   **Tab 3: Experience**
   - Total Years of Experience
   - Previous Companies (if experience > 0)
   - Upload Relieving Letters

   **Tab 4: Identity**
   - Aadhaar Number (12 digits)
   - PAN Number (10 characters)
   - Upload Aadhaar Document
   - Upload PAN Card
   - Upload Address Proof

   **Tab 5: Profile**
   - Full Name
   - Email (pre-filled)
   - Department (dropdown)
   - About Me (textarea)
   - Profile Photo upload

6. **Submit Application:**
   - Click "Submit Application"
   - Form validates all required fields
   - Success message displayed
   - Status: "Submitted - Pending Review"

7. **Receive 5 Onboarding Emails** (After HR Approval):
   - Email 1: Welcome message with support contacts
   - Email 2: Employee ID (WW00001), Manager details, Resources (3 PDFs)
   - Email 3: WinPay time tracking instructions
   - Email 4: Mediclaim insurance info (Excel calculator)
   - Email 5: Facebook group invitation

8. **Join the Team:**
   - All existing employees receive email: "Welcome Our New Team Member"
   - Employee appears in Active Employees list

## 📁 Project Structure

```
UseCaseSubmission/
├── backend/
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── utils/           # Utilities (email, jwt, file upload)
│   ├── uploads/         # Uploaded files storage
│   ├── server.js        # Express server
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── HR/      # HR components
    │   │   ├── Employee/ # Employee components
    │   │   ├── Login.js
    │   │   ├── AcceptOffer.js
    │   │   └── PrivateRoute.js
    │   ├── utils/       # API and validation utilities
    │   ├── App.js
    │   └── index.css
    └── package.json
```

## 🎨 Winwire Branding

- **Primary Gradient:** Purple to Pink (#667eea to #764ba2)
- **Typography:** Poppins font family
- **Animations:** Smooth transitions, gradients, pulse effects
- **Responsive:** Mobile-first design with breakpoints
- **Logo:** "WW" circle with gradient background

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- Token expiration (7 days for offer acceptance)
- File type and size validation
- Input sanitization
- Secure API endpoints

## 📧 Email Templates & Workflow

### **Approval Email Workflow** (Sequential, Automated)

When HR clicks "Approve & Create Employee":

**STEP 1: Database Updates (Immediate)**
- ✅ Submission status → APPROVED
- ✅ Employee record created (Employee ID: WW00001)
- ✅ User account updated with Employee ID
- ✅ **Dashboard updated** → New employee visible in Active Employees

**STEP 2: Response to HR (Immediate)**
- ✅ Success message: "Submission approved and employee created"
- ✅ HR can see new employee in dashboard right away

**STEP 3: Background Email Process** (Non-blocking, runs in background)

**To New Employee (5 Sequential Emails with 2-second delays):**

1. **Email 1: Welcome to WinWire Technologies**
   - Subject: "Welcome to WinWire Technologies!"
   - Content: Welcome message with support contacts table
   - Support Contacts: HR, L&D, IT Support, Finance, Admin
   - Footer: WinWire Microsoft Partner 2024 image
   - Delay: 2 seconds

2. **Email 2: Employee Details & Important Resources**
   - Subject: "Your Employee Details & Important Resources"
   - Content: Employee ID (WW00001), Manager Name, Joining Date, Practice
   - **Attachments:**
     - WinWire_Core_Values.pdf
     - Holiday_List_2025.pdf
     - Calendar_Import.ics
   - Footer: WinWire Microsoft Partner image
   - Delay: 2 seconds

3. **Email 3: WinPay Time Tracking Instructions**
   - Subject: "WinPay Time Tracking Instructions"
   - Content: Complete guide to time tracking portal
   - Sections:
     - Portal Access (web + mobile apps)
     - User Instructions (filling timesheets)
     - Approver Instructions (reviewing timesheets)
   - Footer: WinWire Microsoft Partner image
   - Delay: 2 seconds

4. **Email 4: WinWire Mediclaim Insurance Details**
   - Subject: "WinWire Mediclaim Insurance Details"
   - Content: Insurance enrollment information, premium details
   - **Attachment:** Insurance_Premium_Calculator.xlsx
   - Footer: WinWire Microsoft Partner image
   - Delay: 2 seconds

5. **Email 5: Join Our WinWire Facebook Group**
   - Subject: "Join Our WinWire Facebook Group!"
   - Content: Social group invitation, HR contact link
   - Footer: WinWire Microsoft Partner image

**To All Active Employees (Sent in background):**

6. **Email: Welcome Our New Team Member - [Employee Name]**
   - Subject: "Welcome Our New Team Member - John Doe"
   - Content: New employee introduction
   - Details: Name, Department, Position, Joining Date
   - Footer: WinWire Microsoft Partner image

**Total Processing Time:** ~10 seconds for all 5 emails
**HR Impact:** Zero blocking - HR can continue working immediately

### Other Email Templates:

1. **Offer Letter Email** - Contains offer acceptance link (token-based)
2. **Joining Credentials Email** - Temporary password for portal access

## 🔧 API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Candidates (HR Only)
- POST `/api/candidates` - Create candidate
- GET `/api/candidates` - Get all candidates
- POST `/api/candidates/:id/trigger-joining` - Trigger joining process
- POST `/api/candidates/accept-offer/:token` - Accept offer (Public)

### Onboarding
- POST `/api/onboarding/submit` - Submit onboarding form
- GET `/api/onboarding/my-submission` - Get user's submission

### Admin (HR Only)
- GET `/api/admin/submissions` - Get all submissions
- GET `/api/admin/submissions/:id` - Get submission details
- POST `/api/admin/submissions/:id/approve` - Approve submission
- POST `/api/admin/submissions/:id/reject` - Reject submission
- GET `/api/admin/dashboard/stats` - Get dashboard statistics

### Employees
- GET `/api/employees` - Get all employees (HR only)
- GET `/api/employees/active` - Get active employees

## 🎯 Key Technologies

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT & Bcrypt
- Multer (file uploads)
- Nodemailer (emails)

**Frontend:**
- React.js
- React Router DOM
- Axios
- React Toastify
- React Icons

## 📱 Responsive Design

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB service is running
- Windows: `Get-Service MongoDB*` or `net start MongoDB`
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`
- Check connection string in backend\.env: `mongodb://localhost:27017/winwire_onboarding`

**Email Not Sending:**
- Verify Gmail credentials in backend\.env
- Use Gmail App Password (not regular password)
- Enable 2-Step Verification in Google Account
- Generate App Password: https://myaccount.google.com/apppasswords

**Port Already in Use (EADDRINUSE):**
- Backend (Port 5000):
  ```bash
  # Windows - Kill process on port 5000
  netstat -ano | findstr :5000
  taskkill /PID <PID_NUMBER> /F
  ```
- Frontend (Port 3000):
  ```bash
  # Windows - Kill process on port 3000
  netstat -ano | findstr :3000
  taskkill /PID <PID_NUMBER> /F
  ```

**npm install errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try: `npm install --legacy-peer-deps`

**File Upload Error:**
- Check file size (max 5MB per file)
- Verify allowed formats (PDF, JPG, PNG)
- Ensure `backend/uploads` folder exists

**Cannot find module errors:**
- Make sure you ran `npm install` in both backend AND frontend folders
- Check Node.js version: `node --version` (should be v14+)

**MongoDB "command not found":**
- MongoDB not in system PATH
- Windows: MongoDB installed at `C:\Program Files\MongoDB\Server\8.2\bin\`
- Add to PATH or use Windows Service (recommended)

## 📝 Notes

- The system automatically seeds an admin account on first run
- Employee IDs are auto-generated (WW00001, WW00002, etc.)
- Passwords follow the format: First3LettersOfName@WW2025
- All uploaded files are stored in `backend/uploads/`

## 🤝 Support

For any issues or questions, please contact the development team.

---

**Built with ❤️ for Winwire Technologies**
