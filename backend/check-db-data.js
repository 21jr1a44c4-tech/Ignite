require('dotenv').config();
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate.model');
const Employee = require('./models/Employee.model');
const User = require('./models/User.model');
const OnboardingSubmission = require('./models/OnboardingSubmission.model');

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Connected to MongoDB\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 DATABASE CONTENT ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Check Candidates
    const candidateCount = await Candidate.countDocuments();
    console.log(`📁 CANDIDATES Collection: ${candidateCount} records`);
    if (candidateCount > 0) {
      const candidates = await Candidate.find().select('fullName email position department offerStatus').lean();
      console.log('Data:');
      candidates.forEach(c => {
        console.log(`  • ${c.fullName || 'N/A'} | ${c.email} | ${c.position} | ${c.department} | Offer: ${c.offerStatus}`);
      });
    }
    console.log('');

    // Check Employees
    const employeeCount = await Employee.countDocuments();
    console.log(`📁 EMPLOYEES Collection: ${employeeCount} records`);
    if (employeeCount > 0) {
      const employees = await Employee.find().select('firstName lastName email position department status').lean();
      console.log('Data:');
      employees.forEach(e => {
        const name = `${e.firstName || ''} ${e.lastName || ''}`.trim();
        console.log(`  • ${name} | ${e.email} | ${e.position} | ${e.department} | ${e.status}`);
      });
    }
    console.log('');

    // Check Users
    const userCount = await User.countDocuments();
    console.log(`📁 USERS Collection: ${userCount} records`);
    if (userCount > 0) {
      const users = await User.find().select('name email role status').lean();
      console.log('Data:');
      users.forEach(u => {
        console.log(`  • ${u.name} | ${u.email} | ${u.role} | ${u.status}`);
      });
    }
    console.log('');

    // Check OnboardingSubmissions
    const onboardingCount = await OnboardingSubmission.countDocuments();
    console.log(`📁 ONBOARDING SUBMISSIONS Collection: ${onboardingCount} records`);
    if (onboardingCount > 0) {
      const submissions = await OnboardingSubmission.find().select('candidateName email status currentStep').lean();
      console.log('Data:');
      submissions.forEach(s => {
        console.log(`  • ${s.candidateName} | ${s.email} | Status: ${s.status} | Step: ${s.currentStep}`);
      });
    }
    console.log('');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('Summary:');
    console.log(`  Candidates: ${candidateCount}`);
    console.log(`  Employees: ${employeeCount}`);
    console.log(`  Users: ${userCount}`);
    console.log(`  Onboarding Submissions: ${onboardingCount}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
