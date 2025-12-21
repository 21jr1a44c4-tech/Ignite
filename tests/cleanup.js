const mongoose = require('./backend/node_modules/mongoose');

async function cleanup() {
  try {
    await mongoose.connect('mongodb+srv://saigade044_db_user:AL1pkiG6VXYa6BaN@winonboard.gl3uh8u.mongodb.net/?appName=WinOnBoard');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Delete employees with NULL or missing employeeId/department
    const result = await db.collection('employees').deleteMany({
      $or: [
        { employeeId: { $exists: false } },
        { employeeId: null },
        { department: null },
        { department: { $exists: false } }
      ]
    });

    console.log(`✅ Deleted ${result.deletedCount} employee(s) with incomplete data`);
    
    // Show remaining employees
    const remainingEmployees = await db.collection('employees').find({}).toArray();
    console.log(`\n📊 Remaining employees: ${remainingEmployees.length}`);
    
    if (remainingEmployees.length > 0) {
      remainingEmployees.forEach(emp => {
        console.log(`  - ${emp.fullName} (ID: ${emp.employeeId}, Dept: ${emp.department})`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Database cleanup complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanup();
