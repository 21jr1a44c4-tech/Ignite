const mongoose = require('./backend/node_modules/mongoose');

async function deleteAllEmployees() {
  try {
    await mongoose.connect('mongodb+srv://saigade044_db_user:AL1pkiG6VXYa6BaN@winonboard.gl3uh8u.mongodb.net/?appName=WinOnBoard');
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Delete ALL employees
    const result = await db.collection('employees').deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} employee(s) from database\n`);
    
    // Verify empty
    const count = await db.collection('employees').countDocuments();
    console.log(`📊 Remaining employees: ${count}`);
    
    if (count === 0) {
      console.log('✅ Database is now clean - ready for fresh start!');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteAllEmployees();
