# Complete Testing Guide - Employee Onboarding System

## Prerequisites
- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000
- MongoDB connected and running
- Email credentials configured in backend/.env

## Test Scenario 1: Complete Employee Onboarding Flow

### Step 1: Access Onboarding Form
1. Go to http://localhost:3000
2. Click on employee onboarding link (or navigate to the form)

### Step 2: Fill Personal Details Tab (NEW)
1. Verify "Personal Details" is the **first tab** and is active by default
2. Fill in the following:
   - **First Name:** John (required)
   - **Middle Name:** Michael (optional)
   - **Last Name:** Doe (required)
   - **Date of Birth:** Select a date using date picker (required)
   - **LinkedIn URL:** https://linkedin.com/in/johndoe (optional)
   - **Address:** 123 Main Street, Apartment 4B (required)
   - **City:** Hyderabad (required)
   - **State:** Telangana (required)
   - **Pincode:** 500001 (required, test that only 6 digits are allowed)

3. Scroll down to **Emergency Contact** section:
   - **Contact Name:** Jane Doe (required)
   - **Contact Phone:** 9876543210 (required, test that only 10 digits allowed)
   - **Relation:** Select "Mother" from dropdown (required)

4. Scroll down to **Bank Details** section:
   - **Bank Account Number:** 1234567890123456 (required)
   - **Bank Name:** HDFC Bank (required)
   - **IFSC Code:** hdfc0001234 (test that it converts to HDFC0001234)

5. Scroll down to **Self Description**:
   - Type: "I am a passionate software developer with 3 years of experience in React and Node.js. Looking forward to contributing to the team."
   - Verify character counter shows: X/500 characters

### Step 3: Fill Education Tab (UPDATED)
1. Click on "Education" tab
2. Fill **Education Percentages**:
   - **10th Percentage:** 85.5 (test decimal values)
   - **12th Percentage:** 88.0
   - **Degree Percentage:** 82.75

3. Upload **Required Certificates**:
   - **10th Certificate:** Upload a PDF/image
   - **Intermediate Certificate:** Upload a PDF/image
   - **Degree Certificate:** Upload a PDF/image

4. Scroll down to **BTech Semester Certificates** section:
   - **Semester 1-1:** Upload PDF (optional)
   - **Semester 1-2:** Upload PDF (optional)
   - **Semester 2-1:** Upload PDF (optional)
   - **Semester 2-2:** Upload PDF (optional)
   - **Semester 3-1:** Upload PDF (optional)
   - **Semester 3-2:** Upload PDF (optional)
   - **Semester 4-1:** Upload PDF (optional)
   - **Semester 4-2:** Upload PDF (optional)
   - **Provisional Certificate:** Upload PDF (optional)

5. Add additional certifications if any

### Step 4: Fill Experience Tab
1. Click on "Experience" tab
2. **Total Years of Experience:** Enter a number (e.g., 3)
3. If experience > 0, add previous companies:
   - **Company Name:** ABC Technologies
   - **Designation:** Software Developer
   - **Duration:** 2021-2023
4. Upload relieving letters if applicable

### Step 5: Fill Identity Tab
1. Click on "Identity" tab
2. Fill in:
   - **Aadhaar Number:** 123456789012 (12 digits)
   - **PAN Number:** ABCDE1234F (10 characters)
3. Upload documents:
   - **Aadhaar Document:** Upload PDF/image
   - **PAN Document:** Upload PDF/image
   - **Address Proof:** Upload PDF/image

### Step 6: Fill Profile Tab
1. Click on "Profile" tab
2. Fill in:
   - **Full Name:** John Michael Doe
   - **Email:** john.doe@example.com
   - **Department:** Select "Engineering"
   - **About Me:** Brief description
   - **Profile Photo:** Upload image

### Step 7: Submit Form
1. Click "Submit Application" button
2. Verify success toast notification appears
3. Form should redirect or show confirmation

## Test Scenario 2: HR Review & Approval

### Step 1: Login as HR
1. Go to http://localhost:3000
2. Login with HR credentials
3. Navigate to HR Dashboard

### Step 2: View Active Employees (NEW FEATURE)
1. Verify "Active Employees" section is visible
2. Check that it shows:
   - Employee ID
   - Name
   - Email
   - Department
   - Phone
   - Status

### Step 3: View Submissions
1. Click "View Submissions" button
2. Verify the submission list shows:
   - Candidate Name
   - Email
   - Department
   - Experience
   - Submitted Date
   - Status (SUBMITTED, APPROVED, REJECTED)
3. Verify filter buttons work (All, Pending, Approved, Rejected)

### Step 4: View Submission Details
1. Click "View Details" on a submission
2. Verify **all sections** are displayed:

   **✅ Personal Information:**
   - First Name, Middle Name, Last Name
   - Date of Birth
   - LinkedIn Profile (clickable)
   - Department, Experience

   **✅ Address:**
   - Full Address
   - City, State, Pincode

   **✅ Emergency Contact:**
   - Contact Name, Phone, Relation

   **✅ Bank Details:**
   - Account Number, Bank Name, IFSC Code

   **✅ Self Description:**
   - Full text displayed

   **✅ Educational Scores:**
   - 10th Percentage
   - 12th Percentage
   - Degree Percentage
   - Aadhaar Number
   - PAN Number

   **✅ Educational Certificates:**
   - 10th Certificate (View Document button)
   - Intermediate Certificate (View Document button)
   - Degree Certificate (View Document button)

   **✅ BTech Semester Certificates (if uploaded):**
   - Semester 1-1 through 4-2 (View Document buttons)
   - Provisional Certificate (View Document button)

   **✅ Work Experience:**
   - Previous companies list (if experience > 0)

   **✅ Identity Documents:**
   - Aadhaar Card, PAN Card, Address Proof (View Document buttons)

3. Test clicking "View Document" buttons to verify files open

### Step 5: Approve Submission
1. At the bottom of submission details, find "Review Submission" section
2. (Optional) Add HR remarks in the textarea
3. Click **"Approve & Create Employee"** button
4. Confirm the action in the popup

### Step 6: Verify Email Workflow
1. Check that the process doesn't freeze (runs in background)
2. Wait ~10 seconds for emails to be processed
3. **Check employee's email inbox** for 5 emails:
   
   **Email 1: Welcome & Support Contacts**
   - Subject: Welcome to WinWire Technologies!
   - Contains: Support contacts table (HR, L&D, IT, Finance, Admin)
   - Footer: WinWire Microsoft Partner 2024 image

   **Email 2: Employee Details & Resources**
   - Subject: Your Employee Details & Important Resources
   - Contains: Employee ID (WW00001), Manager name, Joining date
   - Attachments: 
     * WinWire_Core_Values.pdf
     * Holiday_List_2025.pdf
     * Calendar_Import.ics

   **Email 3: WinPay Time Tracking**
   - Subject: WinPay Time Tracking Instructions
   - Contains: Portal links, user instructions, approver instructions

   **Email 4: Mediclaim Insurance**
   - Subject: WinWire Mediclaim Insurance Details
   - Contains: Premium calculator instructions, enrollment details
   - Attachment: Insurance_Premium_Calculator.xlsx

   **Email 5: Facebook Group**
   - Subject: Join Our WinWire Facebook Group!
   - Contains: Facebook group invitation link

4. **Check all active employees' email inboxes** for:
   
   **Welcome Email:**
   - Subject: Welcome Our New Team Member - John Doe
   - Contains: New employee details, department, joining date

### Step 7: Verify Employee Account Created
1. Go back to HR Dashboard
2. Check "Active Employees" section
3. Verify new employee appears with:
   - Employee ID: WW00001 (or next sequential number)
   - Name: John Michael Doe
   - Email: john.doe@example.com
   - Status: Active

## Test Scenario 3: Form Validation

### Test 1: Required Field Validation
1. Open onboarding form
2. Try to submit without filling required fields
3. Verify validation errors appear for:
   - Personal Details: firstName, lastName, dateOfBirth, address, city, state, pincode
   - Emergency Contact: all 3 fields
   - Bank Details: all 3 fields
   - Self Description
   - Education: percentages, certificates

### Test 2: Format Validation
1. **Pincode:** Try entering 7 digits → Should restrict to 6
2. **Emergency Phone:** Try entering 11 digits → Should restrict to 10
3. **IFSC Code:** Enter lowercase "hdfc0001234" → Should convert to "HDFC0001234"
4. **IFSC Code:** Try entering 12 characters → Should restrict to 11
5. **Self Description:** Try typing more than 500 characters → Should restrict
6. **Percentages:** Try entering 101 → Should not allow values > 100
7. **Percentages:** Try entering -5 → Should not allow negative values

### Test 3: Optional Fields
1. Verify form submits successfully with:
   - Middle Name left empty
   - LinkedIn URL left empty
   - BTech semester certificates not uploaded
   - Additional certifications not added

## Test Scenario 4: Edge Cases

### Test 1: No Previous Experience
1. Set "Total Experience" to 0
2. Verify previous companies section doesn't appear
3. Submit form successfully

### Test 2: Multiple File Uploads
1. Upload all 9 semester certificates
2. Verify all are attached to submission
3. In HR view, verify all 9 download buttons appear

### Test 3: Special Characters
1. Try special characters in:
   - Names (should allow hyphens, apostrophes)
   - IFSC code (should convert to uppercase)
   - Bank account number (should allow alphanumeric)

## Test Scenario 5: Responsive Design

### Test on Different Screen Sizes
1. Desktop (1920x1080)
2. Tablet (768x1024)
3. Mobile (375x667)

Verify:
- Form fields stack properly on mobile
- Buttons are accessible
- No horizontal scrolling
- Text is readable

## Test Scenario 6: Backend Verification

### Check Database
1. Open MongoDB Compass or shell
2. Check `onboardingsubmissions` collection
3. Verify document contains all new fields:
   ```javascript
   {
     firstName: "John",
     lastName: "Doe",
     middleName: "Michael",
     dateOfBirth: "1995-05-15",
     linkedinUrl: "https://linkedin.com/in/johndoe",
     address: "123 Main Street, Apartment 4B",
     city: "Hyderabad",
     state: "Telangana",
     pincode: "500001",
     emergencyContactName: "Jane Doe",
     emergencyContactPhone: "9876543210",
     emergencyContactRelation: "Mother",
     bankAccountNumber: "1234567890123456",
     bankName: "HDFC Bank",
     bankIFSC: "HDFC0001234",
     selfDescription: "...",
     tenthPercentage: 85.5,
     twelthPercentage: 88.0,
     degreePercentage: 82.75,
     semester1_1: "filename.pdf",
     // ... other semester files
     // ... existing fields
   }
   ```

4. Check `employees` collection after approval
5. Verify employee document has all personal fields

## Common Issues & Solutions

### Issue 1: Form Not Submitting
- **Solution:** Check browser console for errors
- Verify all required fields are filled
- Check backend server is running

### Issue 2: Emails Not Sending
- **Solution:** Check backend/.env has correct email credentials
- Verify backend console for email errors
- Check spam folder in email inbox

### Issue 3: Files Not Uploading
- **Solution:** Verify file size < 5MB
- Check file format (PDF, JPG, PNG allowed)
- Ensure backend/uploads folder has write permissions

### Issue 4: Personal Tab Not Showing
- **Solution:** Clear browser cache and reload
- Check OnboardingForm.js has been updated
- Verify frontend compiled without errors

### Issue 5: HR Can't See New Fields
- **Solution:** Check SubmissionDetails.js has been updated
- Verify backend sends all fields in API response
- Clear browser cache

## Success Criteria

✅ All form fields save correctly  
✅ Personal Details tab appears first  
✅ Validation works for all required fields  
✅ HR can view all new fields in submission details  
✅ Approval triggers 5 emails to employee  
✅ All active employees receive welcome email  
✅ Employee account created with correct data  
✅ All semester certificates visible in HR view  
✅ No console errors in frontend or backend  
✅ Responsive design works on all devices  

## Notes
- Always test with real email addresses to verify email delivery
- Keep backend console open to monitor email sending progress
- Test with different file formats (PDF, JPG, PNG)
- Verify all percentages display with correct decimal places
- Check that dates display in readable format (MM/DD/YYYY or DD/MM/YYYY)
