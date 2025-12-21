const mongoose = require('./backend/node_modules/mongoose');

async function cleanAll() {
  try {
    await mongoose.connect('mongodb+srv://saigade044_db_user:AL1pkiG6VXYa6BaN@winonboard.gl3uh8u.mongodb.net/?appName=WinOnBoard');
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Delete ALL candidates
    const candidatesResult = await db.collection('candidates').deleteMany({});
    console.log(`✅ Deleted ${candidatesResult.deletedCount} candidate(s)`);
    
    // Delete ALL employees
    const employeesResult = await db.collection('employees').deleteMany({});
    console.log(`✅ Deleted ${employeesResult.deletedCount} employee(s)`);
    
    // Delete ALL onboarding submissions
    const submissionsResult = await db.collection('onboardingsubmissions').deleteMany({});
    console.log(`✅ Deleted ${submissionsResult.deletedCount} onboarding submission(s)`);
    
    // Delete ALL users except HR (keep admin account)
    const usersResult = await db.collection('users').deleteMany({ role: { $ne: 'HR' } });
    console.log(`✅ Deleted ${usersResult.deletedCount} user(s) (kept HR account)`);
    
    console.log('\n📊 Remaining counts:');
    console.log(`  Candidates: ${await db.collection('candidates').countDocuments()}`);
    console.log(`  Employees: ${await db.collection('employees').countDocuments()}`);
    console.log(`  Submissions: ${await db.collection('onboardingsubmissions').countDocuments()}`);
    console.log(`  Users: ${await db.collection('users').countDocuments()}`);

    await mongoose.connection.close();
    console.log('\n✅ Database cleaned - Ready for fresh start!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanAll();
