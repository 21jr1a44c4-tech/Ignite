require('dotenv').config();
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate.model');

async function checkStatuses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Checking Candidate statuses...\n');
    
    const candidates = await Candidate.find().select('status offerStatus name -_id').lean();
    console.log('All candidates:');
    candidates.forEach((c, i) => {
      console.log(`  ${i+1}. Name: ${c.name}, Status: ${c.status}, OfferStatus: ${c.offerStatus}`);
    });
    
    const statuses = await Candidate.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('\nStatus values distribution:');
    statuses.forEach(s => {
      console.log(`  - "${s._id}": ${s.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkStatuses();
