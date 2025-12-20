/**
 * Test HR Secure Database Queries
 * Tests the secure database API with different scenarios
 */

require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Employee = require('../models/Employee.model');
const Candidate = require('../models/Candidate.model');
const OnboardingSubmission = require('../models/OnboardingSubmission.model');

const {
  getCollectionSummary,
  countDocuments,
  findDocuments,
  getCollectionStats,
} = require('../utils/secureDbQuery');

async function runTests() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║        SECURE HR DATABASE QUERY TESTS                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Test 1: Get Collection Schema
    console.log('━'.repeat(60));
    console.log('TEST 1: Get Available Collections and Fields');
    console.log('━'.repeat(60));
    try {
      const schema = await getCollectionSummary();
      console.log('✅ Available Collections:');
      for (const [name, info] of Object.entries(schema)) {
        console.log(`  📁 ${name}`);
        console.log(`     Fields: ${info.availableFields.slice(0, 5).join(', ')}...`);
      }
      console.log('✅ Test PASSED\n');
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}\n`);
    }

    // Test 2: Count Candidates
    console.log('━'.repeat(60));
    console.log('TEST 2: Count All Candidates');
    console.log('━'.repeat(60));
    try {
      const result = await countDocuments('Candidates');
      console.log(`✅ Total Candidates: ${result.count}`);
      console.log('✅ Test PASSED\n');
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}\n`);
    }

    // Test 3: Count Employees by Department
    console.log('━'.repeat(60));
    console.log('TEST 3: Count Employees in Engineering Department');
    console.log('━'.repeat(60));
    try {
      const result = await countDocuments('Employees', { department: 'Engineering' });
      console.log(`✅ Engineering Employees: ${result.count}`);
      console.log('✅ Test PASSED\n');
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}\n`);
    }

    // Test 4: Find Candidates with Filter
    console.log('━'.repeat(60));
    console.log('TEST 4: Find Candidates (with limit)');
    console.log('━'.repeat(60));
    try {
      const result = await findDocuments('Candidates', {}, { limit: 5 });
      console.log(`✅ Found ${result.count} candidates (limit: 5)`);
      if (result.data.length > 0) {
        console.log(`   First candidate: ${result.data[0].name}`);
      }
      console.log('✅ Test PASSED\n');
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}\n`);
    }

    // Test 5: Try to Access Forbidden Field (should fail)
    console.log('━'.repeat(60));
    console.log('TEST 5: Attempt to Filter by Sensitive Field (should fail)');
    console.log('━'.repeat(60));
    try {
      await countDocuments('Employees', { salary: { $gt: 50000 } });
      console.log('❌ Test FAILED: Should have blocked sensitive field access\n');
    } catch (error) {
      console.log(`✅ Correctly blocked: ${error.message}`);
      console.log('✅ Test PASSED\n');
    }

    // Test 6: Get Collection Statistics
    console.log('━'.repeat(60));
    console.log('TEST 6: Get Candidate Statistics');
    console.log('━'.repeat(60));
    try {
      const result = await getCollectionStats('Candidates');
      console.log(`✅ Total Candidates: ${result.statistics.total}`);
      if (result.statistics.byStatus) {
        console.log('   By Status:');
        result.statistics.byStatus.forEach(stat => {
          console.log(`     - ${stat._id}: ${stat.count}`);
        });
      }
      console.log('✅ Test PASSED\n');
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}\n`);
    }

    // Test 7: Get Employee Statistics
    console.log('━'.repeat(60));
    console.log('TEST 7: Get Employee Statistics by Department');
    console.log('━'.repeat(60));
    try {
      const result = await getCollectionStats('Employees');
      console.log(`✅ Total Employees: ${result.statistics.total}`);
      if (result.statistics.byDepartment) {
        console.log('   By Department:');
        result.statistics.byDepartment.forEach(stat => {
          console.log(`     - ${stat._id}: ${stat.count}`);
        });
      }
      console.log('✅ Test PASSED\n');
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}\n`);
    }

    // Test 8: Find with Sort
    console.log('━'.repeat(60));
    console.log('TEST 8: Find Candidates Sorted by Applied Date');
    console.log('━'.repeat(60));
    try {
      const result = await findDocuments(
        'Candidates',
        {},
        { limit: 3, sort: { appliedDate: -1 } }
      );
      console.log(`✅ Found ${result.count} candidates (sorted by date)`);
      console.log('✅ Test PASSED\n');
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}\n`);
    }

    // Test 9: Pagination
    console.log('━'.repeat(60));
    console.log('TEST 9: Pagination (skip and limit)');
    console.log('━'.repeat(60));
    try {
      const page1 = await findDocuments('Candidates', {}, { limit: 5, skip: 0 });
      const page2 = await findDocuments('Candidates', {}, { limit: 5, skip: 5 });
      console.log(`✅ Page 1: ${page1.count} candidates`);
      console.log(`✅ Page 2: ${page2.count} candidates`);
      console.log('✅ Test PASSED\n');
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}\n`);
    }

    // Test 10: Invalid Collection
    console.log('━'.repeat(60));
    console.log('TEST 10: Access Invalid Collection (should fail)');
    console.log('━'.repeat(60));
    try {
      await countDocuments('InvalidCollection');
      console.log('❌ Test FAILED: Should have rejected invalid collection\n');
    } catch (error) {
      console.log(`✅ Correctly rejected: ${error.message}`);
      console.log('✅ Test PASSED\n');
    }

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║        ALL TESTS COMPLETED                                ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
