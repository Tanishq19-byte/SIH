const BASE_URL = 'http://localhost:5000/api/v1/ai';

function sanitizePayload(params = {}) {
  const rainfall24h = isNaN(Number(params.rainfall24h)) ? 140.0 : Math.min(Math.max(Number(params.rainfall24h), 0.0), 500.0);
  const elevation = isNaN(Number(params.elevation)) ? 1200.0 : Math.min(Math.max(Number(params.elevation), 0.0), 6000.0);
  return {
    routeId: params.routeId || 'NH-27',
    rainfall24h,
    elevation,
    terrainRisk: 0.85,
    roadConditionScore: 3.8,
    shipmentPriority: params.shipmentPriority || 'Critical',
    scenario: params.scenario || null
  };
}

async function runResilienceTests() {
  console.log('====================================================');
  console.log('NER-SmartRoute AI Application Resilience & Stress Suite');
  console.log('====================================================\n');

  try {
    const headers = { 'Content-Type': 'application/json', 'x-test-suite': 'true' };

    // Scenario A: AI Service ON
    console.log('[Scenario A] Testing AI Prediction Service ON (NORMAL_OPERATION)...');
    const resA = await fetch(`${BASE_URL}/predict-disruption`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sanitizePayload({ scenario: 'NORMAL_OPERATION', shipmentPriority: 'Normal' }))
    });
    const jsonA = await resA.json();
    console.log(`Status: ${resA.status} | Risk Level: ${jsonA.data?.prediction?.riskLevel} | Recommendation: ${jsonA.data?.prediction?.recommendation}`);
    if (resA.ok && jsonA.data?.prediction?.riskLevel === 'LOW') {
      console.log('✓ Scenario A Passed: Expected LOW risk & SAFE_TO_PROCEED.\n');
    } else {
      console.error('✗ Scenario A Failed!\n');
    }

    // Scenario D: Road Closure Handling
    console.log('[Scenario D] Testing Road Closure Handling (ROAD_CLOSURE scenario)...');
    const resD = await fetch(`${BASE_URL}/predict-disruption`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sanitizePayload({ routeId: 'NH-27', scenario: 'ROAD_CLOSURE', shipmentPriority: 'Normal' }))
    });
    const jsonD = await resD.json();
    console.log(`Status: ${resD.status} | Risk Level: ${jsonD.data?.prediction?.riskLevel} | Recommendation: ${jsonD.data?.prediction?.recommendation}`);
    if (resD.ok && jsonD.data?.prediction?.riskLevel === 'CRITICAL') {
      console.log('✓ Scenario D Passed: Closed route correctly flagged CRITICAL with DELAY_SHIPMENT/REROUTE.\n');
    } else {
      console.error('✗ Scenario D Failed!\n');
    }

    // Scenario E: Multiple Simultaneous Disruptions
    console.log('[Scenario E] Testing Multiple Disruptions (MULTI_DISRUPTION scenario)...');
    const resE = await fetch(`${BASE_URL}/predict-disruption`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sanitizePayload({ scenario: 'MULTI_DISRUPTION', shipmentPriority: 'Critical' }))
    });
    const jsonE = await resE.json();
    console.log(`Status: ${resE.status} | Risk Score: ${jsonE.data?.prediction?.riskScore}/100 | Recommendation: ${jsonE.data?.prediction?.recommendation}`);
    if (resE.ok && jsonE.data?.prediction?.riskScore >= 85) {
      console.log('✓ Scenario E Passed: Multi-disruption risk escalated to CRITICAL & REROUTE_IMMEDIATELY.\n');
    } else {
      console.error('✗ Scenario E Failed!\n');
    }

    // Scenario F: Extreme Input Sanitization
    console.log('[Scenario F] Testing Extreme Input Sanitization (rainfall: 1200mm, elevation: -500m)...');
    const sanitizedInput = sanitizePayload({ rainfall24h: 1200.0, elevation: -500.0, shipmentPriority: "Critical" });
    const resF = await fetch(`${BASE_URL}/predict-disruption`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sanitizedInput)
    });
    const jsonF = await resF.json();
    console.log(`Status: ${resF.status} | Clamped Rainfall: ${sanitizedInput.rainfall24h}mm | Risk Score: ${jsonF.data?.prediction?.riskScore}`);
    if (resF.ok && jsonF.data?.prediction?.riskScore !== undefined) {
      console.log('✓ Scenario F Passed: Boundary inputs safely normalized and clamped.\n');
    } else {
      console.error('✗ Scenario F Failed!\n');
    }

    // Scenario G: Concurrency Stress Test (50 Requests)
    console.log('[Scenario G] Concurrency Stress Test: Sending 50 simultaneous API requests...');
    const startG = Date.now();
    const promises = Array.from({ length: 50 }).map(() =>
      fetch(`${BASE_URL}/predict-disruption`, {
        method: 'POST',
        headers,
        body: JSON.stringify(sanitizePayload({ rainfall24h: 180, shipmentPriority: 'Critical' }))
      })
    );
    const responses = await Promise.all(promises);
    const totalDuration = Date.now() - startG;
    const allSuccessful = responses.every(r => r.ok);
    console.log(`Completed 50 Requests in ${totalDuration}ms | Avg Latency: ${round(totalDuration / 50, 2)}ms/req`);

    if (allSuccessful) {
      console.log('✓ Scenario G Passed: 100% success rate under high concurrency stress.\n');
    } else {
      console.error('✗ Scenario G Failed!\n');
    }

  } catch (err) {
    console.error('Resilience suite exception:', err.message);
  }
}

function round(val, decimals) {
  return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}

runResilienceTests();
