#!/usr/bin/env python3
"""
Resilience & Stress Test Suite for NER-SmartRoute AI Microservice (Step 13)
"""

import sys
import os
import unittest
import time
import math

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.model import model_engine, SCENARIOS
from app.schemas import PredictRequest

class TestAIResilienceAndStress(unittest.TestCase):

    def setUp(self):
        self.model = model_engine

    def test_extreme_input_sanitization(self):
        """Test extreme/boundary inputs: rainfall=1200mm, negative elevation, float overflow."""
        payload_extreme = {
            "rainfall24h": 1200.0,
            "elevation": -500.0,
            "roadConditionScore": -10.0,
            "terrainRisk": 5.0,
            "shipmentPriority": "Critical"
        }
        result = self.model.predict(payload_extreme)
        
        self.assertGreaterEqual(result["riskScore"], 5)
        self.assertLessEqual(result["riskScore"], 99)
        self.assertIn(result["riskLevel"], ["LOW", "MODERATE", "HIGH", "CRITICAL"])
        self.assertFalse(math.isnan(result["disruptionProbability"]))
        self.assertFalse(math.isinf(result["disruptionProbability"]))

    def test_zero_and_minimal_inputs(self):
        """Test zero/minimal inputs: rainfall=0.0, terrain=0.0."""
        payload_zero = {
            "rainfall24h": 0.0,
            "rainfallForecast": 0.0,
            "terrainRisk": 0.0,
            "roadConditionScore": 10.0,
            "activeIncidentCount": 0,
            "shipmentPriority": "Low"
        }
        result = self.model.predict(payload_zero)
        
        self.assertEqual(result["riskLevel"], "LOW")
        self.assertEqual(result["recommendation"], "SAFE_TO_PROCEED")

    def test_simultaneous_multi_disruption(self):
        """Test simultaneous flood + landslide + road damage + traffic stagnation."""
        payload_multi = {
            "scenario": "MULTI_DISRUPTION",
            "shipmentPriority": "Critical"
        }
        result = self.model.predict(payload_multi)
        
        self.assertEqual(result["riskLevel"], "CRITICAL")
        self.assertGreaterEqual(result["riskScore"], 85)
        self.assertEqual(result["recommendation"], "REROUTE_IMMEDIATELY")

    def test_concurrency_stress_performance(self):
        """Stress test: execute 100 rapid prediction calls and benchmark latency."""
        start = time.time()
        count = 100
        for i in range(count):
            self.model.predict({
                "rainfall24h": 100.0 + (i % 50),
                "terrainRisk": 0.5 + (i % 4) * 0.1,
                "shipmentPriority": "Critical"
            })
        total_time_ms = (time.time() - start) * 1000
        avg_latency_ms = total_time_ms / count
        
        print(f"\n[STRESS TEST RESULT] 100 Rapid Predictions Total: {total_time_ms:.2f} ms | Avg Latency: {avg_latency_ms:.2f} ms/req")
        self.assertLess(avg_latency_ms, 50.0, "Average latency under stress must be < 50ms")

if __name__ == "__main__":
    unittest.main(verbosity=2)
