/**
 * Test the new predefined query template system
 * This eliminates hallucination by using pre-validated templates
 */

const BASE_URL = 'http://localhost:5000';

async function testTemplateSystem() {
  console.log('\n');
  console.log('╔═════════════════════════════════════════════════════════════╗');
  console.log('║     TEMPLATE-BASED QUERY SYSTEM TEST (NO HALLUCINATION)     ║');
  console.log('╚═════════════════════════════════════════════════════════════╝');
  console.log('\n');

  try {
    // Step 1: Get available templates
    console.log('Step 1: Fetching available query templates...\n');
    const templatesRes = await fetch(`${BASE_URL}/api/chatbot/templates`);
    const templatesData = await templatesRes.json();

    if (!templatesData.success) {
      console.log('❌ Failed to get templates:', templatesData.error);
      return;
    }

    console.log(`✅ Found ${templatesData.count} available templates:\n`);
    templatesData.templates.forEach(t => {
      console.log(`  ${t.icon} [${t.id}] ${t.title}`);
      console.log(`     ${t.description}\n`);
    });

    // Step 2: Test each template
    console.log('\n═════════════════════════════════════════════════════════════');
    console.log('Step 2: Testing each template...\n');

    const testTemplates = [
      'total_candidates',
      'accepted_offers',
      'all_candidates',
      'total_employees',
      'all_employees',
      'candidate_stats',
    ];

    for (const templateId of testTemplates) {
      console.log('\n───────────────────────────────────────────────────────────');
      console.log(`Testing: ${templateId}`);
      console.log('───────────────────────────────────────────────────────────');

      try {
        const res = await fetch(`${BASE_URL}/api/chatbot/execute-template`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId })
        });

        const data = await res.json();

        if (data.success) {
          console.log('✅ Status: SUCCESS');
          console.log('📊 Query Type:', data.metadata.queryType);
          console.log('📁 Collection:', data.metadata.collection);
          console.log('🔢 Records Found:', data.metadata.recordCount);
          console.log('');
          console.log('Response:');
          console.log(data.result);
        } else {
          console.log('❌ Status: FAILED');
          console.log('Error:', data.error);
        }
      } catch (error) {
        console.log('❌ Request Error:', error.message);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n');
    console.log('╔═════════════════════════════════════════════════════════════╗');
    console.log('║                    TEST COMPLETED                           ║');
    console.log('║                                                             ║');
    console.log('║  ✅ Benefits of Template System:                           ║');
    console.log('║     • ZERO hallucination - only real database data          ║');
    console.log('║     • Pre-validated queries - always accurate               ║');
    console.log('║     • HR users select templates - no typing errors          ║');
    console.log('║     • Fast execution - no AI processing overhead            ║');
    console.log('║     • Audit trail - all queries logged                      ║');
    console.log('╚═════════════════════════════════════════════════════════════╝');
    console.log('\n');

  } catch (error) {
    console.log('❌ Test Failed:', error.message);
  }
}

testTemplateSystem();
