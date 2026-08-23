#!/usr/bin/env python3
"""
Validation Test Suite for NER-SmartRoute AI Data Pipeline & Prediction Microservice (Step 12)
"""

import sys
import os
import unittest
import time

# Ensure python path includes ai-service directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.model import model_engine, SCENARIOS, RISK_THRESHOLDS
from app.schemas import PredictRequest

class TestAIPredictionPipeline(unittest.TestCase):

    def setUp(self):
        self.model = model_engine

    def test_model_loaded(self):
        """Verify model artifacts are loaded or engine fallback is operational."""
        self.assertIsNotNone(self.model, "Model engine instance must exist.")

    def test_scenario_normal_operation(self):
        """Test Scenario 1: NORMAL_OPERATION (Expected LOW or MODERATE risk)."""
        payload = {"scenario": "NORMAL_OPERATION", "shipmentPriority": "Normal"}
        result = self.model.predict(payload)
        
        self.assertIn(result["riskLevel"], ["LOW", "MODERATE"], f"NORMAL_OPERATION should yield LOW/MODERATE risk, got {result['riskLevel']}")
        self.assertLessEqual(result["riskScore"], 55)
        self.assertIn(result["recommendation"], ["SAFE_TO_PROCEED", "MONITOR_ROUTE"])
        self.assertEqual(result["dataProvenance"], "SIMULATED")

    def test_scenario_heavy_rainfall(self):
        """Test Scenario 2: HEAVY_RAINFALL (Expected HIGH or CRITICAL risk)."""
        payload = {"scenario": "HEAVY_RAINFALL", "shipmentPriority": "High"}
        result = self.model.predict(payload)
        
        self.assertIn(result["riskLevel"], ["HIGH", "CRITICAL"], f"HEAVY_RAINFALL should yield HIGH/CRITICAL risk, got {result['riskLevel']}")
        self.assertGreater(result["riskScore"], 55)
        self.assertIn(result["recommendation"], ["USE_ALTERNATIVE_ROUTE", "REROUTE_IMMEDIATELY", "DELAY_SHIPMENT"])

    def test_scenario_landslide_alert(self):
        """Test Scenario 3: LANDSLIDE_ALERT (Expected CRITICAL risk)."""
        payload = {"scenario": "LANDSLIDE_ALERT", "shipmentPriority": "Critical"}
        result = self.model.predict(payload)
        
        self.assertEqual(result["riskLevel"], "CRITICAL", f"LANDSLIDE_ALERT must yield CRITICAL risk, got {result['riskLevel']}")
        self.assertGreaterEqual(result["riskScore"], 76)
        self.assertEqual(result["recommendation"], "REROUTE_IMMEDIATELY")

    def test_scenario_flood_event(self):
        """Test Scenario 4: FLOOD_EVENT (Expected HIGH or CRITICAL risk)."""
        payload = {"scenario": "FLOOD_EVENT", "shipmentPriority": "Critical"}
        result = self.model.predict(payload)
        
        self.assertIn(result["riskLevel"], ["HIGH", "CRITICAL"])
        self.assertGreaterEqual(result["riskScore"], 60)

    def test_scenario_road_closure(self):
        """Test Scenario 5: ROAD_CLOSURE (Expected CRITICAL risk)."""
        payload = {"scenario": "ROAD_CLOSURE", "shipmentPriority": "Normal"}
        result = self.model.predict(payload)
        
        self.assertEqual(result["riskLevel"], "CRITICAL")
        self.assertEqual(result["recommendation"], "DELAY_SHIPMENT")

    def test_scenario_multi_disruption(self):
        """Test Scenario 6: MULTI_DISRUPTION (Expected CRITICAL risk > 85)."""
        payload = {"scenario": "MULTI_DISRUPTION", "shipmentPriority": "Critical"}
        result = self.model.predict(payload)
        
        self.assertEqual(result["riskLevel"], "CRITICAL")
        self.assertGreaterEqual(result["riskScore"], 85)
        self.assertEqual(result["recommendation"], "REROUTE_IMMEDIATELY")

    def test_scenario_recovery(self):
        """Test Scenario 7: RECOVERY (Expected risk decreasing to MODERATE or LOW)."""
        payload = {"scenario": "RECOVERY", "shipmentPriority": "Normal"}
        result = self.model.predict(payload)
        
        self.assertIn(result["riskLevel"], ["LOW", "MODERATE"])
        self.assertLessEqual(result["riskScore"], 55)

    def test_shipment_priority_impact(self):
        """Verify that shipment priority influences operational action recommendation for critical risk."""
        payload_critical = {"scenario": "LANDSLIDE_ALERT", "shipmentPriority": "Critical"}
        payload_low = {"scenario": "LANDSLIDE_ALERT", "shipmentPriority": "Low"}
        
        result_crit = self.model.predict(payload_critical)
        result_low = self.model.predict(payload_low)
        
        self.assertEqual(result_crit["recommendation"], "REROUTE_IMMEDIATELY")
        self.assertEqual(result_low["recommendation"], "DELAY_SHIPMENT")

    def test_data_provenance_labeling(self):
        """Verify data provenance metadata is properly tagged."""
        res_sim = self.model.predict({"scenario": "NORMAL_OPERATION"})
        res_derived = self.model.predict({"rainfall24h": 120.0})
        
        self.assertEqual(res_sim["dataProvenance"], "SIMULATED")
        self.assertEqual(res_derived["dataProvenance"], "DERIVED")

    def test_prediction_latency(self):
        """Verify prediction execution latency is < 50ms."""
        start = time.time()
        for _ in range(100):
            self.model.predict({"rainfall24h": 140.0, "terrainRisk": 0.85})
        total_time = (time.time() - start) * 1000 / 100
        print(f"\n[Performance Benchmark] Average Prediction Latency: {total_time:.2f} ms")
        self.assertLess(total_time, 50.0, "Average prediction latency must be under 50ms")

if __name__ == "__main__":
    unittest.main(verbosity=2)
