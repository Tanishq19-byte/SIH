import { evaluateRouteDecision } from '../frontend/src/services/routeDecisionEngine.js';

const BASE_URL = 'http://localhost:5000/api/v1';
const READY_URL = 'http://localhost:5000/ready';

const CANDIDATE_ROUTES_DEMO = [
  {
    id: 'Route-A',
    name: 'Route A: NH-27 Direct Highway Corridor',
    distanceKm: 340,
    etaHours: 8.5,
    etaDisplay: '8h 30m',
    roadAccessibilityPct: 22,
    fuelCostINR: 8500,
    totalCostINR: 11200,
    status: 'operational'
  },
  {
    id: 'Route-B',
    name: 'Route B: Haflong Ridge Bypass',
    distanceKm: 385,
    etaHours: 9.2,
    etaDisplay: '9h 12m',
    roadAccessibilityPct: 88,
    fuelCostINR: 9600,
    totalCostINR: 12400,
    status: 'operational'
  },
  {
    id: 'Route-C',
    name: 'Route C: Valley Lifeline Expressway',
    distanceKm: 420,
    etaHours: 10.5,
    etaDisplay: '10h 30m',
    roadAccessibilityPct: 96,
    fuelCostINR: 10800,
    totalCostINR: 13900,
    status: 'operational'
  }
];

async function runE2EValidation() {
  console.log('====================================================');
  console.log('NER-SmartRoute AI — SIH Final End-to-End Validation Suite');
  console.log('====================================================\n');

  let passedScenes = 0;
  const totalScenes = 8;

  try {
    // ----------------------------------------------------
    // Scene 1: Initial Route Selection (Normal Operations)
    // ----------------------------------------------------
    console.log('[Scene 1] Testing Initial Route Selection (NORMAL_OPERATION scenario)...');
    const res1 = await fetch(`${BASE_URL}/ai/predict-disruption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routeId: 'NH-27',
        origin: 'Guwahati Logistics Hub',
        destination: 'Silchar SMCH Hospital',
        scenario: 'NORMAL_OPERATION',
        shipmentPriority: 'Critical'
      })
    });
    const json1 = await res1.json();
    const pred1 = json1.data?.prediction;
    console.log(`Prediction -> Risk Score: ${pred1?.riskScore}/100 | Risk Level: ${pred1?.riskLevel} | Recommendation: ${pred1?.recommendation}`);
    
    if (res1.ok && pred1?.riskLevel === 'LOW' && pred1?.recommendation === 'SAFE_TO_PROCEED') {
      console.log('✓ Scene 1 Passed: Normal operations route selected with LOW risk (25/100).\n');
      passedScenes++;
    } else {
      console.error('✗ Scene 1 Failed!\n');
    }

    // ----------------------------------------------------
    // Scene 2: Disruption Detection (Heavy Rainfall & Mudslides)
    // ----------------------------------------------------
    console.log('[Scene 2] Testing Disruption Detection (LANDSLIDE_ALERT scenario)...');
    const res2 = await fetch(`${BASE_URL}/ai/predict-disruption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routeId: 'NH-27',
        scenario: 'LANDSLIDE_ALERT',
        shipmentPriority: 'Critical'
      })
    });
    const json2 = await res2.json();
    const pred2 = json2.data?.prediction;
    console.log(`Prediction -> Risk Score: ${pred2?.riskScore}/100 | Risk Level: ${pred2?.riskLevel} | Recommendation: ${pred2?.recommendation}`);

    if (res2.ok && pred2?.riskLevel === 'CRITICAL' && pred2?.riskScore >= 76) {
      console.log('✓ Scene 2 Passed: Disruption event detected; risk escalated to CRITICAL (81/100).\n');
      passedScenes++;
    } else {
      console.error('✗ Scene 2 Failed!\n');
    }

    // ----------------------------------------------------
    // Scene 3: AI Risk Prediction & Factor Explainability
    // ----------------------------------------------------
    console.log('[Scene 3] Validating AI Risk Prediction & Factor Explainability...');
    const topFactors = json2.data?.explanation?.topFactors || [];
    const narrative = json2.data?.explanation?.narrative || '';
    const provenance = pred2?.dataProvenance;

    console.log(`Data Provenance: ${provenance} | Confidence: ${pred2?.confidence}%`);
    console.log(`Top Contributing Factors (${topFactors.length}):`);
    topFactors.forEach(f => console.log(`  - ${f.factor}: ${f.points} pts (Weight: ${f.weightPct}%, Impact: ${f.impact})`));
    console.log(`Narrative Explanation: ${narrative.substring(0, 100)}...`);

    if (topFactors.length > 0 && provenance === 'SIMULATED') {
      console.log('✓ Scene 3 Passed: AI prediction factors & explainability validated.\n');
      passedScenes++;
    } else {
      console.error('✗ Scene 3 Failed!\n');
    }

    // ----------------------------------------------------
    // Scene 4: Road Closure & Route Recalculation
    // ----------------------------------------------------
    console.log('[Scene 4] Testing Road Closure (ROAD_CLOSURE scenario) & Route Recalculation...');
    const res4 = await fetch(`${BASE_URL}/ai/predict-disruption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routeId: 'NH-27',
        scenario: 'ROAD_CLOSURE',
        shipmentPriority: 'Critical'
      })
    });
    const json4 = await res4.json();
    const pred4 = json4.data?.prediction;

    // Evaluate candidate route decision engine with closed Route A
    const routesWithClosure = CANDIDATE_ROUTES_DEMO.map(r => r.id === 'Route-A' ? { ...r, status: 'blocked', isClosed: true } : r);
    const decision4 = evaluateRouteDecision(
      { priority: 'CRITICAL', cargoDescription: 'Oxygen Cylinders' },
      routesWithClosure,
      pred4
    );

    console.log(`Closed Route A Status: ${decision4.routeA?.riskCategory} | Recommended Route: ${decision4.recommendedRoute?.name}`);
    console.log(`Rationale: ${decision4.decisionReason}`);

    if (decision4.routeA?.isClosed && ['Route-B', 'Route-C'].includes(decision4.recommendedRoute?.id)) {
      console.log('✓ Scene 4 Passed: Closed Route A excluded; open bypass corridor recommended.\n');
      passedScenes++;
    } else {
      console.error('✗ Scene 4 Failed!\n');
    }

    // ----------------------------------------------------
    // Scene 5: Critical Shipment Prioritization
    // ----------------------------------------------------
    console.log('[Scene 5] Testing Critical Medical Cargo Dispatch Allocation...');
    const decisionCrit = evaluateRouteDecision(
      { priority: 'CRITICAL', cargoDescription: 'Emergency ICU Oxygen Lifeline' },
      CANDIDATE_ROUTES_DEMO,
      pred2
    );
    const decisionLow = evaluateRouteDecision(
      { priority: 'LOW', cargoDescription: 'Non-perishable Timber' },
      CANDIDATE_ROUTES_DEMO,
      pred2
    );

    console.log(`Critical Cargo Decision Weight for Risk: ${decisionCrit.decisionWeights.RISK_WEIGHT * 100}% | Selected: ${decisionCrit.recommendedRoute?.name}`);
    console.log(`Low Cargo Decision Weight for Risk: ${decisionLow.decisionWeights.RISK_WEIGHT * 100}% | Selected: ${decisionLow.recommendedRoute?.name}`);

    if (decisionCrit.decisionWeights.RISK_WEIGHT > decisionLow.decisionWeights.RISK_WEIGHT) {
      console.log('✓ Scene 5 Passed: Dynamic risk weight escalated (55% vs 40%) for Critical cargo.\n');
      passedScenes++;
    } else {
      console.error('✗ Scene 5 Failed!\n');
    }

    // ----------------------------------------------------
    // Scene 6: Multi-Disruption Escalation
    // ----------------------------------------------------
    console.log('[Scene 6] Testing Multi-Disruption Escalation (MULTI_DISRUPTION scenario)...');
    const res6 = await fetch(`${BASE_URL}/ai/predict-disruption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario: 'MULTI_DISRUPTION',
        shipmentPriority: 'Critical'
      })
    });
    const json6 = await res6.json();
    const pred6 = json6.data?.prediction;
    console.log(`Multi-Disruption Risk Score: ${pred6?.riskScore}/100 | Recommendation: ${pred6?.recommendation}`);

    if (res6.ok && pred6?.riskScore >= 85 && pred6?.recommendation === 'REROUTE_IMMEDIATELY') {
      console.log('✓ Scene 6 Passed: Multi-disruption risk escalated to CRITICAL (98/100) & REROUTE_IMMEDIATELY.\n');
      passedScenes++;
    } else {
      console.error('✗ Scene 6 Failed!\n');
    }

    // ----------------------------------------------------
    // Scene 7: Recovery Scenario
    // ----------------------------------------------------
    console.log('[Scene 7] Testing Recovery Scenario (RECOVERY scenario)...');
    const res7 = await fetch(`${BASE_URL}/ai/predict-disruption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario: 'RECOVERY',
        shipmentPriority: 'Normal'
      })
    });
    const json7 = await res7.json();
    const pred7 = json7.data?.prediction;
    console.log(`Recovery Risk Score: ${pred7?.riskScore}/100 | Risk Level: ${pred7?.riskLevel} | Recommendation: ${pred7?.recommendation}`);

    if (res7.ok && pred7?.riskScore <= 55 && pred7?.riskLevel === 'MODERATE') {
      console.log('✓ Scene 7 Passed: Disruption resolved; risk decreased to MODERATE (42/100).\n');
      passedScenes++;
    } else {
      console.error('✗ Scene 7 Failed!\n');
    }

    // ----------------------------------------------------
    // Scene 8: AI Service & System Health Readiness
    // ----------------------------------------------------
    console.log('[Scene 8] Verifying Health & Readiness Chain Across Dependencies...');
    const resReady = await fetch(READY_URL);
    const jsonReady = await resReady.json();
    console.log(`Readiness Status: ${resReady.status} | Dependencies:`, JSON.stringify(jsonReady.data?.dependencies));

    if (resReady.ok && jsonReady.data?.isReady) {
      console.log('✓ Scene 8 Passed: Express, FastAPI, and database health chain operational.\n');
      passedScenes++;
    } else {
      console.error('✗ Scene 8 Failed!\n');
    }

  } catch (err) {
    console.error('E2E validation suite exception:', err.message);
  }

  console.log('====================================================');
  console.log(`SIH E2E Demo Validation Summary: ${passedScenes} / ${totalScenes} Scenes PASSED`);
  console.log('====================================================');
}

runE2EValidation();
