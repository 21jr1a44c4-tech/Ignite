# 🔐 Secure HR Database Access Guide

## Overview

HR personnel can securely query the database through the **HR Database API** with automatic field-level security. Sensitive information is never exposed.

---

## 🛡️ Security Features

### What's Protected:
- ✅ Passwords
- ✅ Social Security Numbers (SSN)
- ✅ Bank Account Details
- ✅ Salary Information
- ✅ PAN Numbers
- ✅ Aadhar Numbers
- ✅ Passport Numbers

### What HR Can See:
- ✅ Names, emails, phone numbers
- ✅ Positions, departments, reporting managers
- ✅ Join dates, status
- ✅ Candidate information (name, position, status, dates)
- ✅ Onboarding progress and status

---

## 📚 Available Collections

### 1. **Candidates**
Fields available to HR:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "position": "Software Engineer",
  "department": "Engineering",
  "status": "Under Review",
  "appliedDate": "2025-12-01",
  "experience": "5 years",
  "qualification": "B.Tech",
  "location": "Bangalore",
  "linkedin": "linkedin.com/in/johndoe"
}
```

### 2. **Employees**
Fields available to HR:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@winwire.com",
  "phone": "987-654-3210",
  "department": "HR",
  "position": "HR Manager",
  "joinDate": "2023-06-15",
  "reportingManager": "Manager Name",
  "status": "Active",
  "officeLocation": "Bangalore"
}
```

### 3. **Users**
Fields available to HR:
```json
{
  "email": "user@winwire.com",
  "name": "User Name",
  "role": "EMPLOYEE",
  "status": "Active"
}
```

### 4. **OnboardingSubmissions**
Fields available to HR:
```json
{
  "candidateName": "New Joiner",
  "email": "newjoiner@example.com",
  "status": "In Progress",
  "joinDate": "2025-12-20",
  "submittedAt": "2025-12-15",
  "completedAt": null,
  "currentStep": "3 of 5"
}
```

---

## 🔗 API Endpoints

### 1. GET `/api/hr-database/schema`
**Purpose:** View available collections and fields

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Available collections and fields for HR",
  "schema": {
    "Candidates": {
      "description": "Candidate information (name, contact, position, status)",
      "availableFields": ["name", "email", "phone", "position", "status", ...]
    },
    "Employees": { ... },
    "Users": { ... },
    "OnboardingSubmissions": { ... }
  }
}
```

---

### 2. POST `/api/hr-database/count`
**Purpose:** Count documents in a collection

**Request:**
```json
{
  "collection": "Candidates",
  "filters": {
    "status": "Active"
  }
}
```

**Response:**
```json
{
  "success": true,
  "collection": "Candidates",
  "count": 15,
  "filters": { "status": "Active" },
  "timestamp": "2025-12-20T10:30:00Z"
}
```

**Example Filters:**
```json
// Count all active candidates
{ "collection": "Candidates", "filters": { "status": "Active" } }

// Count employees in Engineering
{ "collection": "Employees", "filters": { "department": "Engineering" } }

// Count onboarding in progress
{ "collection": "OnboardingSubmissions", "filters": { "status": "In Progress" } }
```

---

### 3. POST `/api/hr-database/find`
**Purpose:** Find and retrieve documents with filters and pagination

**Request:**
```json
{
  "collection": "Candidates",
  "filters": {
    "status": "Active",
    "department": "Engineering"
  },
  "limit": 10,
  "skip": 0,
  "sort": { "appliedDate": -1 }
}
```

**Response:**
```json
{
  "success": true,
  "collection": "Candidates",
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "position": "Software Engineer",
      "status": "Active"
    }
  ],
  "timestamp": "2025-12-20T10:30:00Z"
}
```

**Options:**
- `limit`: Max 100 (default: 10)
- `skip`: Max 10000 (default: 0)
- `sort`: { fieldName: 1 or -1 } (1=ascending, -1=descending)

---

### 4. POST `/api/hr-database/stats`
**Purpose:** Get statistics about a collection

**Request:**
```json
{
  "collection": "Candidates"
}
```

**Response:**
```json
{
  "success": true,
  "collection": "Candidates",
  "statistics": {
    "total": 50,
    "byStatus": [
      { "_id": "Active", "count": 30 },
      { "_id": "Inactive", "count": 20 }
    ]
  },
  "timestamp": "2025-12-20T10:30:00Z"
}
```

---

## 💡 Common Queries

### Count All Active Candidates
```bash
curl -X POST http://localhost:5000/api/hr-database/count \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "Candidates",
    "filters": { "status": "Active" }
  }'
```

### Find All Employees in Engineering
```bash
curl -X POST http://localhost:5000/api/hr-database/find \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "Employees",
    "filters": { "department": "Engineering" },
    "limit": 20,
    "sort": { "joinDate": -1 }
  }'
```

### Get Candidate Statistics
```bash
curl -X POST http://localhost:5000/api/hr-database/stats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "Candidates"
  }'
```

### Get Onboarding Progress
```bash
curl -X POST http://localhost:5000/api/hr-database/find \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "OnboardingSubmissions",
    "filters": { "status": "In Progress" },
    "limit": 50
  }'
```

---

## 🤖 Using the Chatbot for Database Queries

The HR chatbot can guide you on database queries:

```
HR User: "How many candidates do we have?"
Chatbot: "I'll help you count candidates. Use the COUNT endpoint:
POST /api/hr-database/count
with body: { 'collection': 'Candidates' }"

HR User: "Show me all active candidates"
Chatbot: "You can retrieve active candidates using the FIND endpoint:
POST /api/hr-database/find
with body: { 
  'collection': 'Candidates',
  'filters': { 'status': 'Active' }
}"
```

---

## 🚫 What Happens If You Try to Access Sensitive Data

**Example: Trying to filter by salary**
```json
{
  "collection": "Employees",
  "filters": { "salary": { "$gt": 50000 } }
}
```

**Response:**
```json
{
  "success": false,
  "error": "Cannot filter by sensitive fields: salary. Allowed fields for Employees: email, name, department, position, ..."
}
```

**Example: Trying to get password field**
The endpoint automatically excludes these fields - they won't be returned even if requested.

---

## 📋 Audit Logging

All HR database queries are logged with:
- User ID
- Query type (COUNT, FIND, STATS)
- Collection accessed
- Filters used
- Timestamp

This creates a full audit trail for compliance and security.

---

## ⚠️ Important Reminders

1. **Data Privacy:** Only access data you need for your work
2. **Compliance:** Follow company data privacy policies
3. **Field-Level Security:** Sensitive fields are automatically filtered
4. **Rate Limiting:** Queries are limited to 100 records per request
5. **Pagination:** Use skip/limit for large result sets

---

## 🔧 Frontend Integration Example

```javascript
// Example: Count active candidates
const response = await fetch('/api/hr-database/count', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    collection: 'Candidates',
    filters: { status: 'Active' }
  })
});

const result = await response.json();
console.log(`Active Candidates: ${result.count}`);
```

---

**Last Updated:** December 20, 2025
**Status:** ✅ Secure and Ready

