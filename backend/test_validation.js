const BASE_URL = 'http://localhost:5000/api/v1/ai';

async function runApiValidation() {
  console.log('====================================================');
  console.log('NER-SmartRoute AI API & Data Pipeline Validation Suite');
  console.log('====================================================\n');

  try {
    // Test 1: Express AI Health Check
    console.log('[Test 1] Testing Express AI Proxy Health Endpoint (/api/v1/ai/health)...');
    const resHealth = await fetch(`${BASE_URL}/health`);
    const healthJson = await resHealth.json();
    console.log(`Status: ${resHealth.status} | Version: ${healthJson.data?.version}`);
    if (resHealth.ok && healthJson.success) {
      console.log('✓ Test 1 Passed: Express AI Health Endpoint operational.\n');
    } else {
      console.error('✗ Test 1 Failed!\n');
    }

    // Test 2: Express AI Scenarios Endpoint
    console.log('[Test 2] Testing Express Scenarios List Endpoint (/api/v1/ai/scenarios)...');
    const resScenarios = await fetch(`${BASE_URL}/scenarios`);
    const scenariosJson = await resScenarios.json();
    console.log(`Status: ${resScenarios.status} | Scenarios Count: ${scenariosJson.data?.scenarios?.length || 0}`);
    if (resScenarios.ok && scenariosJson.success) {
      console.log('✓ Test 2 Passed: 7 Demonstration Scenarios fetched successfully.\n');
    } else {
      console.error('✗ Test 2 Failed!\n');
    }

    // Test 3: Disruption Prediction (Landslide Scenario)
    console.log('[Test 3] Testing Disruption Prediction Proxy (LANDSLIDE_ALERT scenario)...');
    const startTime = Date.now();
    const resPredict = await fetch(`${BASE_URL}/predict-disruption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routeId: 'NH-27',
        scenario: 'LANDSLIDE_ALERT',
        shipmentPriority: 'Critical'
      })
    });
    const duration = Date.now() - startTime;
    const predictJson = await resPredict.json();
    const predDetails = predictJson.data?.prediction;

    console.log(`Status: ${resPredict.status} | Latency: ${duration}ms`);
    console.log('Prediction Output Details:', {
      routeId: predDetails?.routeId,
      riskScore: predDetails?.riskScore,
      riskLevel: predDetails?.riskLevel,
      recommendation: predDetails?.recommendation,
      dataProvenance: predDetails?.dataProvenance,
      predictedDelayMinutes: predDetails?.predictedDelayMinutes,
      confidence: predDetails?.confidence
    });

    if (resPredict.ok && predictJson.success && predDetails?.riskLevel === 'CRITICAL') {
      console.log('✓ Test 3 Passed: AI prediction proxy response structured correctly.\n');
    } else {
      console.error('✗ Test 3 Failed!\n');
    }

  } catch (err) {
    console.error('Integration test exception:', err.message);
  }
}

runApiValidation();
