const mongoose = require('./backend/node_modules/mongoose');

async function checkDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/winwire_onboarding');
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Get all employees
    const employees = await db.collection('employees').find({}).toArray();
    console.log(`📊 Total Employees: ${employees.length}\n`);
    
    employees.forEach((emp, index) => {
      console.log(`Employee #${index + 1}:`);
      console.log(`  _id: ${emp._id}`);
      console.log(`  Employee ID: ${emp.employeeId || 'NULL/MISSING'}`);
      console.log(`  Full Name: ${emp.fullName}`);
      console.log(`  Email: ${emp.email}`);
      console.log(`  Department: ${emp.department || 'NULL/MISSING'}`);
      console.log(`  Phone: ${emp.phone || 'NULL/MISSING'}`);
      console.log(`  isActive: ${emp.isActive}`);
      console.log(`  userId: ${emp.userId}`);
      console.log('  ---');
    });

    // Delete ALL employees with missing data
    console.log('\n🗑️  Deleting employees with incomplete data...\n');
    
    const deleteResult = await db.collection('employees').deleteMany({
      $or: [
        { employeeId: { $exists: false } },
        { employeeId: null },
        { employeeId: '' },
        { department: null },
        { department: '' },
        { department: { $exists: false } },
        { phone: null },
        { phone: { $exists: false } },
        { isActive: false }
      ]
    });

    console.log(`✅ Deleted ${deleteResult.deletedCount} employee(s) with incomplete data\n`);

    // Show remaining
    const remaining = await db.collection('employees').find({}).toArray();
    console.log(`📊 Remaining Employees: ${remaining.length}`);
    
    if (remaining.length > 0) {
      remaining.forEach(emp => {
        console.log(`  ✓ ${emp.fullName} - ID: ${emp.employeeId}, Dept: ${emp.department}, Active: ${emp.isActive}`);
      });
    } else {
      console.log('  ✓ Database is now clean - no employees');
    }

    await mongoose.connection.close();
    console.log('\n✅ Database check complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
