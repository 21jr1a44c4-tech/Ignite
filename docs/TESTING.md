# 🧪 Winwire Employee Onboarding - Testing Guide

## 📋 Pre-Testing Setup

### 1. Ensure Services are Running
```powershell
# MongoDB
mongod

# Backend (Terminal 1)
cd d:\UseCaseSubmission\backend
npm run dev

# Frontend (Terminal 2)
cd d:\UseCaseSubmission\frontend
npm start
```

### 2. Verify Services
- ✅ Backend: http://localhost:5000/health should return `{"status":"OK"}`
- ✅ Frontend: http://localhost:3000 should load login page
- ✅ MongoDB: Check connection in backend console

---

## 🎯 Complete Testing Workflow

### Phase 1: HR Login & Dashboard ✅

**Test Case 1.1: HR Login**
```
1. Navigate to http://localhost:3000
2. Enter:
   - Email: 21jr1a05d0@gmail.com
   - Password: Admin@123
3. Click "Sign In"

Expected:
✅ Redirect to /hr/dashboard
✅ See "Winwire HR Portal" header
✅ See 4 statistic cards (all showing 0)
✅ See "Quick Actions" section
✅ See "Recent Candidates" table (empty)
```

**Test Case 1.2: Dashboard UI**
```
Verify:
✅ Gradient header with WW logo
✅ Logout button in header
✅ Stats cards animate on hover (lift effect)
✅ Cards show different colors (primary, success, warning, info)
✅ "Create New Candidate" button visible
✅ "View All Submissions" button visible
```

---

### Phase 2: Create Candidate ✅

**Test Case 2.1: Navigation**
```
1. Click "Create New Candidate"

Expected:
✅ Navigate to /hr/create-candidate
✅ See "Back to Dashboard" link
✅ Form appears with all fields
```

**Test Case 2.2: Form Validation**
```
Test empty form:
1. Click "Create & Send Offer" without filling

Expected:
✅ Red error messages appear
✅ Toast: "Please fix all validation errors"
✅ Fields highlight in red

Test invalid email:
1. Enter: test@invalid
2. Tab out

Expected:
✅ "Valid email is required" error

Test invalid phone:
1. Enter: 123
2. Tab out

Expected:
✅ "Valid 10-digit phone number is required" error
```

**Test Case 2.3: Create Valid Candidate**
```
1. Fill form:
   - Full Name: John Doe
   - Email: johndoe@example.com (use your real email for testing)
   - Phone: 9876543210
   - Position: Software Engineer
   - Department: Engineering
2. Upload a sample PDF as offer letter
3. Click "Create & Send Offer"

Expected:
✅ Button shows spinner: "Creating..."
✅ Success toast: "Candidate created and offer email sent successfully!"
✅ Redirect to /hr/dashboard
✅ Email received with offer letter attachment
✅ Candidate appears in "Recent Candidates" table
✅ Status shows "PENDING"
```

---

### Phase 3: Accept Offer ✅

**Test Case 3.1: Email Verification**
```
1. Check email (johndoe@example.com)

Expected:
✅ Email from kalyan.111457@gmail.com
✅ Subject: "🎉 Congratulations! Offer Letter from Winwire"
✅ Beautiful HTML template with gradient
✅ Offer letter PDF attached
✅ "Accept Offer" button visible
```

**Test Case 3.2: Accept Offer**
```
1. Click "Accept Offer" in email
2. Or copy token from URL and go to:
   http://localhost:3000/accept-offer/{TOKEN}

Expected:
✅ Landing page with gradient background
✅ Animated orbs floating
✅ "Accept Offer" button prominent
✅ Click button
✅ Loading spinner appears
✅ Success screen with checkmark
✅ "What's Next?" information box
✅ Welcome message: "Welcome to the Winwire family! 🎉"
```

**Test Case 3.3: Verify Status Update**
```
1. Go back to HR dashboard
2. Refresh page

Expected:
✅ Candidate status changed to "ACCEPTED" (green badge)
✅ "Trigger Joining" button appears
```

---

### Phase 4: Trigger Joining ✅

**Test Case 4.1: Trigger Joining Process**
```
1. In HR dashboard, find John Doe
2. Click "Trigger Joining"
3. Confirm in alert dialog

Expected:
✅ Success toast: "Joining process triggered successfully!"
✅ Button changes to "Joining Sent" badge
✅ Email sent to candidate with credentials
```

**Test Case 4.2: Verify Credentials Email**
```
1. Check candidate's email

Expected:
✅ Subject: "🔑 Your Onboarding Credentials - Winwire"
✅ Email shows:
   - Email: johndoe@example.com
   - Temporary Password: JOH@WW2025
✅ "Login to Portal" button
✅ Warning about changing password
```

---

### Phase 5: Employee Login ✅

**Test Case 5.1: Employee Login**
```
1. Logout from HR account
2. Login with:
   - Email: johndoe@example.com
   - Password: JOH@WW2025

Expected:
✅ Successful login
✅ Redirect to /employee/onboarding
✅ See "Winwire Onboarding" header
✅ Info banner shows: Position, Department, Email
✅ See 4 tabs: Education, Experience, Identity, Profile
```

---

### Phase 6: Complete Onboarding Form ✅

**Test Case 6.1: Education Tab**
```
1. Upload files:
   - 10th Certificate: (any PDF/JPG)
   - Intermediate Certificate: (any PDF/JPG)
   - Degree Certificate: (any PDF/JPG)
   - Optional: 2 additional certificates

Expected:
✅ File upload area shows "active" state when file selected
✅ File names display
✅ No errors
✅ Additional certificates show with delete button
```

**Test Case 6.2: Experience Tab**
```
For Experienced:
1. Set Total Experience: 3
2. Click "Add Company"
3. Fill:
   - Company: ABC Corp
   - Designation: Developer
   - Duration: 2 years
4. Add another company
5. Upload 2 experience letters

Expected:
✅ Company entries appear in cards
✅ Can remove companies
✅ Experience letters upload successfully
✅ No validation errors

For Fresher:
1. Set Total Experience: 0

Expected:
✅ Message: "You are marked as a fresher"
✅ Company fields hidden
✅ No experience letters required
```

**Test Case 6.3: Identity Tab**
```
1. Enter Aadhaar: 123456789012
2. Enter PAN: ABCDE1234F
3. Upload:
   - Aadhaar Document
   - PAN Document
   - Address Proof

Expected:
✅ Aadhaar accepts only 12 digits
✅ PAN converts to uppercase automatically
✅ All documents upload successfully
✅ Format validations pass
```

**Test Case 6.4: Profile Tab**
```
1. Upload profile photo (JPG/PNG)
2. Enter About Me:
   "I am a passionate software engineer with 3 years of experience
   in full-stack development. I love building scalable applications
   and am excited to join Winwire Technologies."

Expected:
✅ Photo preview appears (circular)
✅ Character counter updates: {X}/500
✅ No errors
```

**Test Case 6.5: Form Submission**
```
1. Click "Submit Onboarding"
2. Wait for processing

Expected:
✅ Button shows spinner: "Submitting..."
✅ Success toast: "Onboarding submitted successfully! HR will review your submission."
✅ Auto-logout after 2 seconds
✅ Redirect to login page
```

---

### Phase 7: HR Review ✅

**Test Case 7.1: View Submissions**
```
1. Login as HR
2. Click "View All Submissions"

Expected:
✅ Navigate to /hr/submissions
✅ Filter buttons at top: All, Pending, Approved, Rejected
✅ John Doe's submission visible
✅ Status: "SUBMITTED" (orange badge)
✅ Shows: Name, Email, Department, Experience, Date
```

**Test Case 7.2: Filter Functionality**
```
1. Click "Pending ({count})"

Expected:
✅ Only SUBMITTED items shown
✅ Button highlighted (active state)

2. Click "All"

Expected:
✅ All submissions shown
```

**Test Case 7.3: View Submission Details**
```
1. Click "View Details" on John Doe

Expected:
✅ Navigate to /hr/submissions/{id}
✅ Profile photo displays (circular, with border)
✅ Full name and email shown
✅ Status badge visible
✅ All sections appear:
   - Personal Information (grid)
   - About Me (full text)
   - Educational Certificates (download links)
   - Work Experience (timeline if applicable)
   - Identity Documents (download links)
✅ Review section at bottom
✅ Approve and Reject buttons
```

**Test Case 7.4: Download Documents**
```
1. Click any "View Document" link

Expected:
✅ Opens in new tab
✅ PDF/Image displays correctly
✅ Can download
```

**Test Case 7.5: Rejection Flow**
```
1. Click "Reject"
2. Modal appears
3. Try to confirm without remarks

Expected:
✅ Button disabled
✅ Cannot submit

4. Enter remarks: "Please update your PAN document"
5. Click "Confirm Rejection"

Expected:
✅ Success toast: "Submission rejected"
✅ Redirect to /hr/submissions
✅ Status changes to "REJECTED"
```

**Note:** For complete testing, create another candidate to test approval.

**Test Case 7.6: Approval Flow**
```
1. Create and submit another candidate (use different email)
2. View their submission details
3. Optionally add remarks: "Excellent documentation"
4. Click "Approve & Create Employee"
5. Confirm in dialog

Expected:
✅ Button shows: "Processing..."
✅ Success toast: "Submission approved and employee created!"
✅ Redirect to /hr/submissions
✅ Status shows "APPROVED" (green)

Backend should:
✅ Create Employee record
✅ Generate Employee ID: WW00001
✅ Create User account with EMPLOYEE role
✅ Send welcome emails to all employees
```

---

### Phase 8: Welcome Email ✅

**Test Case 8.1: Verify Welcome Emails**
```
Check all employee emails (if you have multiple test accounts)

Expected:
✅ Subject: "👋 Welcome Our New Team Member - {Name}!"
✅ Includes:
   - Profile photo (circular)
   - Full name
   - Department
   - About me text
✅ Professional template
✅ Gradient styling
```

---

### Phase 9: Edge Cases & Error Handling ✅

**Test Case 9.1: Invalid Token**
```
1. Go to: http://localhost:3000/accept-offer/invalid-token

Expected:
✅ Error page: "Invalid or Expired Link"
✅ Red X icon
✅ Message about contacting HR
```

**Test Case 9.2: Expired Token**
```
(Manually set token expiry in DB to past date, or wait 7 days)

Expected:
✅ Same error page as invalid token
```

**Test Case 9.3: Double Submission**
```
1. Employee tries to submit form again

Expected:
✅ Error: "Onboarding already submitted"
✅ Or shows status page if already submitted
```

**Test Case 9.4: File Size Validation**
```
1. Try to upload file > 5MB

Expected:
✅ Error toast: "File size exceeds 5MB limit"
✅ File not uploaded
```

**Test Case 9.5: File Type Validation**
```
1. Try to upload .exe or .zip file

Expected:
✅ Error toast: "Only PDF, JPG, and PNG files are allowed!"
✅ File not uploaded
```

**Test Case 9.6: Unauthorized Access**
```
1. Logout
2. Try to access: http://localhost:3000/hr/dashboard

Expected:
✅ Redirect to /login
✅ No dashboard access

3. Login as EMPLOYEE
4. Try to access: http://localhost:3000/hr/dashboard

Expected:
✅ Redirect to /login or access denied
```

**Test Case 9.7: Network Error**
```
1. Stop backend server
2. Try to submit a form

Expected:
✅ Error toast: "Network error" or similar
✅ Loading state ends
✅ Form stays filled (no data loss)
```

---

### Phase 10: Responsive Design Testing ✅

**Test Case 10.1: Mobile View (< 768px)**
```
1. Open DevTools (F12)
2. Toggle device toolbar
3. Select iPhone or similar

Expected:
✅ Navigation becomes hamburger menu (if implemented)
✅ Cards stack vertically
✅ Tables scroll horizontally
✅ Buttons become full width
✅ Text remains readable
✅ Forms use single column layout
✅ Tabs scroll horizontally
```

**Test Case 10.2: Tablet View (768px - 1199px)**
```
1. Set viewport to iPad

Expected:
✅ 2-column grid for cards
✅ Forms show 2 columns where appropriate
✅ Tables fit better
✅ Navigation still visible
```

**Test Case 10.3: Desktop View (1200px+)**
```
Expected:
✅ 4-column grid for stats
✅ Full table width
✅ Optimal spacing
✅ All elements visible
```

---

### Phase 11: Animation Testing ✅

**Test Case 11.1: Page Load Animations**
```
1. Navigate to any page
2. Watch for animations

Expected:
✅ Fade-in effect on main content
✅ Slide-up on cards
✅ Smooth transitions
```

**Test Case 11.2: Hover Effects**
```
1. Hover over:
   - Stat cards
   - Buttons
   - Table rows
   - File upload areas

Expected:
✅ Cards lift up (translateY)
✅ Buttons change color/shadow
✅ Rows highlight
✅ Upload areas change background
```

**Test Case 11.3: Loading Spinners**
```
1. Submit forms
2. Watch for spinners

Expected:
✅ Smooth rotation animation
✅ Proper color (primary gradient)
✅ Appropriate size
```

**Test Case 11.4: Background Animations**
```
1. Go to login or accept offer page

Expected:
✅ Gradient orbs float smoothly
✅ Background gradient shifts
✅ No performance issues
```

---

### Phase 12: Performance Testing ✅

**Test Case 12.1: Load Time**
```
1. Open DevTools > Network
2. Hard reload (Ctrl+Shift+R)

Expected:
✅ Page loads < 3 seconds
✅ No 404 errors
✅ No console errors
```

**Test Case 12.2: Multiple File Uploads**
```
1. Upload max files in all sections

Expected:
✅ No lag
✅ All files upload successfully
✅ Memory usage acceptable
```

---

## 🎯 Test Checklist Summary

### Core Functionality
- [ ] HR can login
- [ ] HR can create candidates
- [ ] Offer emails sent successfully
- [ ] Candidates can accept offers
- [ ] HR can trigger joining
- [ ] Credentials emails sent
- [ ] Employees can login
- [ ] Employees can complete onboarding
- [ ] HR can review submissions
- [ ] HR can approve submissions
- [ ] Employee accounts created
- [ ] Welcome emails sent
- [ ] HR can reject submissions

### UI/UX
- [ ] All animations work smoothly
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Hover effects work
- [ ] Loading states show correctly
- [ ] Error messages display properly
- [ ] Success messages display properly

### Security
- [ ] JWT authentication works
- [ ] Passwords are hashed
- [ ] Protected routes work
- [ ] Role-based access enforced
- [ ] Invalid tokens rejected
- [ ] Unauthorized access blocked

### Validation
- [ ] Email validation works
- [ ] Phone validation works
- [ ] Aadhaar validation works
- [ ] PAN validation works
- [ ] File type validation works
- [ ] File size validation works
- [ ] Required fields enforced
- [ ] Character limits enforced

### Email System
- [ ] Offer emails received
- [ ] Credentials emails received
- [ ] Welcome emails received
- [ ] Attachments work
- [ ] Links work
- [ ] Templates render correctly

---

## 🐛 Known Issues to Test

1. **Network Interruption**
   - Test with unstable connection
   - Verify graceful degradation

2. **Browser Compatibility**
   - Test on Chrome, Firefox, Safari, Edge
   - Verify all features work

3. **Concurrent Users**
   - Multiple HR users
   - Multiple employees submitting

4. **Large Files**
   - Test near 5MB limit
   - Verify upload progress

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________
Environment: Local / Production

| Test Case | Status | Notes |
|-----------|--------|-------|
| HR Login  | ✅/❌   |       |
| Create Candidate | ✅/❌ | |
| ...       | ✅/❌   |       |

Overall Status: Pass / Fail
Comments:
```

---

## 🎉 Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ No broken links
- ✅ All animations smooth
- ✅ All validations working
- ✅ All emails sending
- ✅ All documents uploading
- ✅ Responsive on all devices
- ✅ Fast load times
- ✅ Secure authentication
- ✅ Beautiful UI

---

**Happy Testing! 🚀**

Report any bugs or issues for immediate resolution.
