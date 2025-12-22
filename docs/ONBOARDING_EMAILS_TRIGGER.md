# 5 Onboarding Emails - Trigger Timeline & Details

## ⏰ When Do They Trigger?

**After employee accepts onboarding pass: +30 MINUTES**

```
Event: Employee accepts onboarding pass
    ↓
    [Immediate] Employee record created + welcome email to team
    ↓
    [WAIT 30 MINUTES]
    ↓
    [AUTO TRIGGERED] 5 Sequential Onboarding Emails sent
```

---

## 📧 The 5 Emails in Sequence

| # | Email Name | Content | Delay Between Emails |
|---|------------|---------|---------------------|
| 1 | **Welcome & Support Contacts** | Important team email addresses (HR, IT, Finance, etc.) | - |
| 2 | **Employee Details & Resources** | Employee ID, Reporting Manager, Handbook, Holidays | 2 seconds |
| 3 | **WinPay Time Tracking System** | Instructions for time tracking and payroll system | 2 seconds |
| 4 | **Mediclaim Insurance** | Group health insurance coverage details | 2 seconds |
| 5 | **Facebook Group Invitation** | Private company Facebook group to join | 2 seconds |

---

## 🔄 Complete Employee Onboarding Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Employee Accepts Onboarding Pass                    │
│ (Via email link or onboarding portal)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ↓ IMMEDIATE (0 sec)           ↓ IMMEDIATE (0 sec)
    ┌─────────┐                   ┌──────────────┐
    │Employee │                   │ Welcome Email│
    │ Record  │                   │ to Existing  │
    │Created  │                   │ Team Members │
    └─────────┘                   │ (if any exist)
        │                         └──────────────┘
        │
        ├─ Update Employee Status: PASS_ACCEPTED ✅
        ├─ Generate Employee ID ✅
        ├─ Create User Login Credentials ✅
        │
        └─ Set Timer: WAIT 30 MINUTES ⏱️
           │
           └─ After 30 minutes... ↓
              ┌────────────────────────────────────────┐
              │ 5 ONBOARDING EMAILS AUTO-SENT         │
              ├────────────────────────────────────────┤
              │ 📧 Email 1: Support Contacts          │ (0 sec)
              │ ⏱️  Wait 2 seconds                     │
              │ 📧 Email 2: Employee Details          │ (+2s)
              │ ⏱️  Wait 2 seconds                     │
              │ 📧 Email 3: WinPay Instructions       │ (+4s)
              │ ⏱️  Wait 2 seconds                     │
              │ 📧 Email 4: Mediclaim Insurance       │ (+6s)
              │ ⏱️  Wait 2 seconds                     │
              │ 📧 Email 5: Facebook Group            │ (+8s)
              └────────────────────────────────────────┘
                          │
                          ↓
              ✅ Onboarding Complete
```

---

## 📋 Email Details

### Email 1: Welcome & Support Contacts
**Subject**: Welcome to WinWire - Important Support Contacts
- Lists all team contact emails (HR, IT, Finance, Accounts, Operations)
- Purpose: Get support when needed
- **Location**: `/backend/utils/onboardingEmails.js` (Line 22)

### Email 2: Employee Details & Resources
**Subject**: Your Employee ID, Manager Info & Company Handbook
- Employee ID
- Reporting Manager details
- Company Handbook link
- Holiday schedule
- **Location**: `/backend/utils/onboardingEmails.js` (Line 98)

### Email 3: WinPay Instructions
**Subject**: Getting Started with WinPay - Time Tracking & Payroll System
- System login instructions
- How to track time
- Payroll processing info
- **Location**: `/backend/utils/onboardingEmails.js` (Line 178)

### Email 4: Mediclaim Insurance
**Subject**: Your Group Health Insurance Coverage - Important Details
- Insurance plan details
- Coverage information
- How to claim
- Network hospitals
- **Location**: `/backend/utils/onboardingEmails.js` (Line 248)

### Email 5: Facebook Group
**Subject**: Join Our Company Facebook Group - Connect with the Team
- Private company Facebook group link
- Purpose: Team communication & community
- **Location**: `/backend/utils/onboardingEmails.js` (Line 320)

---

## 🛠️ Code Implementation

**Where it's triggered**: `/backend/routes/admin.routes.js` (Line 290-298)

```javascript
// Send 5 onboarding emails to new employee after 30 minutes
setTimeout(async () => {
  try {
    await sendAllOnboardingEmails(employee, 'Your Manager Name');
    console.log('✅ All 5 onboarding emails sent to new employee after 30 minutes');
  } catch (error) {
    console.error('❌ Error sending onboarding emails:', error);
  }
}, 30 * 60 * 1000); // 30 minutes = 1,800,000 milliseconds
```

---

## 🧪 How to Test

1. **Create an employee** (go through full onboarding)
2. **Accept onboarding pass** - This triggers the 30-minute timer ✅
3. **Wait 30 minutes** OR modify the timeout for testing:
   - Change `30 * 60 * 1000` to `5 * 1000` (5 seconds) for quick testing
4. **Check email inbox** - You should see 5 emails arriving with 2-second gaps

---

## 📊 Email Timing Breakdown

```
Time 0:00         → Employee accepts onboarding pass
Time 30:00        → Email 1 (Welcome & Support) sent
Time 30:02        → Email 2 (Employee Details) sent
Time 30:04        → Email 3 (WinPay) sent
Time 30:06        → Email 4 (Mediclaim) sent
Time 30:08        → Email 5 (Facebook Group) sent
```

---

## ✅ Success Indicators

When working correctly, you should see in backend logs:
```
📧 Sending onboarding emails to employee@email.com...
✅ Email 1/5: Welcome & Support Contacts sent
✅ Email 2/5: Employee Details & Resources sent
✅ Email 3/5: WinPay Instructions sent
✅ Email 4/5: Mediclaim Insurance sent
✅ Email 5/5: Facebook Group Invitation sent
✅ All 5 onboarding emails sent successfully
```

---

## 🔗 Related Documentation

- Email Service: `/backend/utils/emailService.js`
- Onboarding Emails: `/backend/utils/onboardingEmails.js`
- Admin Routes: `/backend/routes/admin.routes.js`
- Onboarding Submission Model: `/backend/models/OnboardingSubmission.model.js`

---

*Last Updated: December 18, 2025*
