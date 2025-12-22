require('dotenv').config();
const mongoose = require('mongoose');
const { executeHRDatabaseQuery, formatQueryResult } = require('./utils/hrQueryParser');

async function testQuery() {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Test 1: How many candidates accepted offers
    console.log('TEST: "how many candidates accepted offer"\n');
    const result1 = await executeHRDatabaseQuery('how many candidates accepted offer');
    console.log('Query Result:', JSON.stringify(result1, null, 2));
    console.log('Formatted:', formatQueryResult(result1));
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test 2: Total candidates
    console.log('TEST: "total candidates"\n');
    const result2 = await executeHRDatabaseQuery('total candidates');
    console.log('Query Result:', JSON.stringify(result2, null, 2));
    console.log('Formatted:', formatQueryResult(result2));
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test 3: Show me candidates with accepted offers
    console.log('TEST: "show me candidates with accepted offers"\n');
    const result3 = await executeHRDatabaseQuery('show me candidates with accepted offers');
    console.log('Query Result:', JSON.stringify(result3, null, 2));
    console.log('Formatted:', formatQueryResult(result3));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testQuery();
