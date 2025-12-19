# Frontend Updates - Complete Onboarding Form

## Overview
Updated the frontend onboarding form to match all backend model changes including personal details, emergency contacts, bank information, education percentages, and BTech semester certificates.

## Changes Made

### 1. OnboardingForm.js - Complete Redesign

#### **Added Personal Details Tab (First Tab)**
- **Personal Information:**
  - First Name (required)
  - Middle Name (optional)
  - Last Name (required)
  - Date of Birth (required, date picker)
  - LinkedIn URL (optional)
  
- **Address Information:**
  - Full Address (required, textarea)
  - City (required)
  - State (required)
  - Pincode (required, 6 digits, numeric only)

- **Emergency Contact Section:**
  - Contact Name (required)
  - Contact Phone (required, 10 digits, numeric only)
  - Relation (required, dropdown with options: Father, Mother, Spouse, Sibling, Other)

- **Bank Details Section:**
  - Bank Account Number (required)
  - Bank Name (required)
  - IFSC Code (required, 11 characters, auto-uppercase)

- **Self Description:**
  - Textarea (required, max 500 characters)
  - Character counter display

#### **Updated Education Tab**
- **Added Education Percentages:**
  - 10th Percentage (required, 0-100, decimal allowed)
  - 12th/Intermediate Percentage (required, 0-100, decimal allowed)
  - Degree/BTech Percentage (required, 0-100, decimal allowed)

- **Added BTech Semester Certificates Section:**
  - Semester 1-1 (optional)
  - Semester 1-2 (optional)
  - Semester 2-1 (optional)
  - Semester 2-2 (optional)
  - Semester 3-1 (optional)
  - Semester 3-2 (optional)
  - Semester 4-1 (optional)
  - Semester 4-2 (optional)
  - Provisional Certificate (optional)

#### **Form State Updates**
- Added 30+ new fields to formData state
- Changed default activeTab from 'education' to 'personal'
- Updated handleSubmit to send all new fields to backend

#### **Tab Order**
1. Personal Details (NEW - First tab)
2. Education (Updated with percentages and semester certificates)
3. Experience (Unchanged)
4. Identity (Unchanged)
5. Profile (Unchanged)

### 2. SubmissionDetails.js - HR Review Page

#### **Added New Information Sections:**

- **Personal Information:**
  - First Name, Middle Name, Last Name
  - Date of Birth
  - LinkedIn Profile (clickable link)
  - Department, Total Experience

- **Address Information:**
  - Full Address, City, State, Pincode

- **Emergency Contact:**
  - Contact Name, Phone, Relation

- **Bank Details:**
  - Account Number, Bank Name, IFSC Code

- **Self Description:**
  - Display user's self-description

- **Educational Scores:**
  - 10th Percentage
  - 12th/Intermediate Percentage
  - Degree/BTech Percentage

- **BTech Semester Certificates:**
  - View/Download links for all 9 semester certificates
  - View/Download provisional certificate
  - Only displays section if certificates are uploaded

#### **Improved Document Display:**
- Conditional rendering (only shows if document exists)
- Clean grid layout for multiple documents
- Download buttons for all certificates

### 3. Form Validation

#### **Client-Side Validation:**
- First Name: Required
- Last Name: Required
- Date of Birth: Required
- Address: Required
- City: Required
- State: Required
- Pincode: Required, 6 digits only
- Emergency Contact: All 3 fields required
- Bank Details: All 3 fields required
- IFSC Code: 11 characters, auto-converts to uppercase
- Phone Numbers: 10 digits only, numeric
- Self Description: Required, max 500 characters
- Education Percentages: Required, 0-100 range

## File Structure

```
frontend/
├── src/
│   └── components/
│       ├── Employee/
│       │   └── OnboardingForm.js         ✅ Updated (Personal tab + Education updates)
│       └── HR/
│           ├── SubmissionDetails.js      ✅ Updated (Display all new fields)
│           └── ViewSubmissions.js        ✅ No changes needed
```

## Backend Integration

### API Endpoints Used:
- `POST /onboarding/submit` - Submit onboarding form with all new fields
- `GET /admin/submissions` - Fetch all submissions
- `GET /admin/submissions/:id` - Get submission details
- `POST /admin/submissions/:id/approve` - Approve submission (triggers 5 emails)
- `POST /admin/submissions/:id/reject` - Reject submission

### FormData Fields Sent:
```javascript
// Personal Details
firstName, lastName, middleName, dateOfBirth, linkedinUrl
address, city, state, pincode
emergencyContactName, emergencyContactPhone, emergencyContactRelation
bankAccountNumber, bankName, bankIFSC
selfDescription

// Education
tenthPercentage, twelthPercentage, degreePercentage
tenthCertificate, intermediateCertificate, degreeCertificate

// BTech Semesters (if uploaded)
semester1_1, semester1_2, semester2_1, semester2_2
semester3_1, semester3_2, semester4_1, semester4_2
provisionalCertificate

// Experience (existing)
totalExperience, previousCompanies, relievingLetters

// Identity (existing)
aadhaarNumber, panNumber, aadhaarDocument, panDocument, addressProof

// Profile (existing)
fullName, email, department, aboutMe, profilePhoto
```

## Email Workflow

When HR approves a submission:

1. **Employee receives 5 professional emails:**
   - Email 1: Welcome + Support Contacts (HR, L&D, IT, Finance, Admin)
   - Email 2: Employee Details (ID: WW00001, Manager, Resources) + 3 PDFs
   - Email 3: WinPay Time Tracking Instructions
   - Email 4: Mediclaim Insurance Details + Excel Premium Calculator
   - Email 5: Facebook Group Invitation

2. **All active employees receive:**
   - Welcome email about new team member

## Testing Checklist

- [ ] Personal Details tab is the first tab
- [ ] All personal fields save correctly
- [ ] Emergency contact phone accepts only 10 digits
- [ ] Pincode accepts only 6 digits
- [ ] IFSC code converts to uppercase
- [ ] Character counter works for self-description
- [ ] Education percentages validate 0-100 range
- [ ] All 9 semester certificate uploads work
- [ ] Form submits all fields successfully
- [ ] HR can view all personal details in submission review
- [ ] HR can view all semester certificates
- [ ] Approval triggers 5 emails to employee
- [ ] Approval sends welcome email to all active employees

## Known Issues
- None

## Notes
- Personal Details tab must be completed first before moving to other tabs
- All semester certificates are optional (for BTech graduates)
- Form validates that required fields are filled before submission
- HR approval creates employee account and triggers automated email workflow
- All new fields are stored in MongoDB OnboardingSubmission collection
