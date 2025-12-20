# Winwire Employee Onboarding - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```powershell
cd d:\UseCaseSubmission\backend
npm install
```

**Frontend:**
```powershell
cd d:\UseCaseSubmission\frontend
npm install
```

### Step 2: Start MongoDB
```powershell
# Make sure MongoDB is running
mongod
```

### Step 3: Start Backend
```powershell
cd d:\UseCaseSubmission\backend
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 4: Start Frontend
```powershell
# Open new terminal
cd d:\UseCaseSubmission\frontend
npm start
```
✅ Frontend running on http://localhost:3000

## 🎯 Test the Application

### 1. Login as HR Admin
- Navigate to http://localhost:3000
- **Email:** 21jr1a05d0@gmail.com
- **Password:** Admin@123

### 2. Create a Candidate
- Click "Create New Candidate"
- Fill in candidate details
- Upload a sample PDF as offer letter
- Submit (email will be sent)

### 3. Accept Offer
- Check the email sent to candidate
- Click the "Accept Offer" link
- Or manually navigate to: http://localhost:3000/accept-offer/{TOKEN}

### 4. Trigger Joining
- Back in HR dashboard
- Find the candidate with "ACCEPTED" status
- Click "Trigger Joining"
- Login credentials will be sent to candidate

### 5. Employee Onboarding
- Logout from HR account
- Login with employee credentials (check email)
- Complete the onboarding form:
  - Upload educational certificates
  - Add work experience
  - Upload identity documents
  - Upload profile photo and bio
- Submit form

### 6. Review & Approve
- Login as HR again
- Go to "View All Submissions"
- Click "View Details" on the submission
- Review all documents
- Click "Approve & Create Employee"
- Welcome emails sent to all employees!

## 📧 Email Configuration

The app uses Gmail SMTP. If emails are not sending:

1. Enable 2-Factor Authentication on your Gmail
2. Generate an App Password
3. Update `.env` file:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## 🎨 Features to Explore

✅ **Beautiful Animations** - Smooth transitions throughout  
✅ **Responsive Design** - Try on mobile/tablet  
✅ **Form Validations** - Try submitting incomplete forms  
✅ **File Upload** - Drag & drop support  
✅ **Dashboard Stats** - Real-time statistics  
✅ **Role-Based Access** - HR vs Employee views  

## 🔑 Sample Credentials

**HR Admin:**
- Email: 21jr1a05d0@gmail.com
- Password: Admin@123

**Employee** (after HR triggers joining):
- Email: {candidate_email}
- Password: {First3Letters}@WW2025

## 📊 Database

MongoDB collections created automatically:
- users
- candidates
- onboardingsubmissions
- employees

## 🛠️ Technologies Used

**Backend:**
- Express.js, MongoDB, JWT, Bcrypt, Multer, Nodemailer

**Frontend:**
- React, React Router, Axios, React Toastify, React Icons

## 💡 Tips

- Use PDF files for offer letters and documents
- Profile photos should be JPG/PNG
- Aadhaar: 12 digits
- PAN: Format AAAAA9999A
- Max file size: 5MB

## 🐛 Common Issues

**Port already in use:**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID {PID} /F
```

**MongoDB not running:**
```powershell
# Start MongoDB service
net start MongoDB
```

## 📞 Support

For issues, check the main README.md for detailed documentation.

---

**Enjoy exploring the Winwire Onboarding Application! 🎉**
