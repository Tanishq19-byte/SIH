import os
import joblib
import pandas as pd
import numpy as np

from app.preprocessing import FeaturePreprocessor, FEATURE_NAMES

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "disruption_model.joblib")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.joblib")

# Configurable Risk Level Thresholds (Section 4)
RISK_THRESHOLDS = {
    "LOW_MAX": 30,
    "MODERATE_MAX": 55,
    "HIGH_MAX": 75,
    "CRITICAL_MAX": 100
}

# Explicit Multi-Factor Scoring Weights (Section 3)
FACTOR_WEIGHTS = {
    "rainfall": 0.20,
    "terrain": 0.15,
    "historical_disruption": 0.20,
    "road_condition": 0.15,
    "landslide_flood": 0.15,
    "traffic": 0.05,
    "incidents_delay": 0.10
}

# Deterministic Scenario Parameter Presets (Section 8)
SCENARIOS = {
    "NORMAL_OPERATION": {
        "rainfall24h": 25.0,
        "rainfallForecast": 30.0,
        "terrainRisk": 0.35,
        "roadConditionScore": 8.5,
        "historicalDisruptionCount": 3,
        "floodProbability": 12.0,
        "landslideProbability": 15.0,
        "trafficScore": 2.5,
        "activeIncidentCount": 0,
        "description": "Standard seasonal conditions with clear roadways and optimal transit efficiency."
    },
    "HEAVY_RAINFALL": {
        "rainfall24h": 165.0,
        "rainfallForecast": 190.0,
        "terrainRisk": 0.70,
        "roadConditionScore": 5.2,
        "historicalDisruptionCount": 12,
        "floodProbability": 68.0,
        "landslideProbability": 74.0,
        "trafficScore": 6.0,
        "activeIncidentCount": 2,
        "description": "Monsoon downpour causing slope instability and waterlogging along gorge passes."
    },
    "LANDSLIDE_ALERT": {
        "rainfall24h": 220.0,
        "rainfallForecast": 245.0,
        "terrainRisk": 0.85,
        "roadConditionScore": 3.2,
        "historicalDisruptionCount": 18,
        "floodProbability": 78.0,
        "landslideProbability": 92.0,
        "trafficScore": 8.0,
        "activeIncidentCount": 4,
        "description": "Active mudslide confirmed at mountain portal approach with partial carriageway collapse."
    },
    "FLOOD_EVENT": {
        "rainfall24h": 260.0,
        "rainfallForecast": 280.0,
        "terrainRisk": 0.65,
        "roadConditionScore": 2.8,
        "historicalDisruptionCount": 15,
        "floodProbability": 94.0,
        "landslideProbability": 65.0,
        "trafficScore": 8.5,
        "activeIncidentCount": 3,
        "description": "River inundation at low-lying bridge approaches causing severe waterlogging."
    },
    "ROAD_CLOSURE": {
        "rainfall24h": 280.0,
        "rainfallForecast": 310.0,
        "terrainRisk": 0.90,
        "roadConditionScore": 1.5,
        "historicalDisruptionCount": 22,
        "floodProbability": 90.0,
        "landslideProbability": 98.0,
        "trafficScore": 9.5,
        "activeIncidentCount": 6,
        "description": "Total highway carriageway washout; corridor closed by emergency road authority."
    },
    "MULTI_DISRUPTION": {
        "rainfall24h": 295.0,
        "rainfallForecast": 330.0,
        "terrainRisk": 0.95,
        "roadConditionScore": 1.0,
        "historicalDisruptionCount": 25,
        "floodProbability": 98.0,
        "landslideProbability": 99.0,
        "trafficScore": 10.0,
        "activeIncidentCount": 7,
        "description": "Simultaneous flash flooding, major mudslides, and stagnant convoy gridlock."
    },
    "RECOVERY": {
        "rainfall24h": 45.0,
        "rainfallForecast": 50.0,
        "terrainRisk": 0.60,
        "roadConditionScore": 6.0,
        "historicalDisruptionCount": 10,
        "floodProbability": 35.0,
        "landslideProbability": 40.0,
        "trafficScore": 4.5,
        "activeIncidentCount": 1,
        "description": "Clearing operations active by road maintenance crews; risk returning to moderate baseline."
    }
}

class DisruptionPredictionModel:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        """Loads joblib model and preprocessor artifacts if available."""
        if os.path.exists(MODEL_PATH) and os.path.exists(PREPROCESSOR_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.preprocessor = joblib.load(PREPROCESSOR_PATH)
                self.is_loaded = True
            except Exception:
                self.is_loaded = False
        else:
            self.is_loaded = False

    def predict(self, feature_dict: dict) -> dict:
        # Check if a deterministic scenario preset was specified
        scenario_name = feature_dict.get("scenario")
        data_provenance = "SIMULATED" if scenario_name else "DERIVED"

        if scenario_name and scenario_name in SCENARIOS:
            preset = SCENARIOS[scenario_name]
            # Merge scenario parameters into feature_dict
            for key, val in preset.items():
                if key != "description":
                    feature_dict[key] = val

        # Extract features with defaults
        rainfall = float(feature_dict.get("rainfall24h", 140.0))
        terrain = float(feature_dict.get("terrainRisk", 0.85))
        history_cnt = int(feature_dict.get("historicalDisruptionCount", 14))
        road_score = float(feature_dict.get("roadConditionScore", 3.8))
        flood_prob = float(feature_dict.get("floodProbability", 72.0))
        landslide_prob = float(feature_dict.get("landslideProbability", 88.0))
        traffic = float(feature_dict.get("trafficScore", 6.5))
        incidents_cnt = int(feature_dict.get("activeIncidentCount", 3))
        shipment_priority = feature_dict.get("shipmentPriority", "Critical")
        route_id = feature_dict.get("routeId", "NH-27")

        # 1. Multi-factor Transparent Risk Score Calculation (Section 3)
        # Factor 1: Rainfall (20% weight) -> 0 to 100 score
        score_rainfall = min((rainfall / 250.0) * 100.0, 100.0)
        # Factor 2: Terrain (15% weight) -> 0 to 100 score
        score_terrain = min(terrain * 100.0, 100.0)
        # Factor 3: Historical Disruption (20% weight) -> 0 to 100 score
        score_history = min((history_cnt / 25.0) * 100.0, 100.0)
        # Factor 4: Road Condition (15% weight) -> 10.0 Best (0 score) to 0.0 Worst (100 score)
        score_road = max((10.0 - road_score) * 10.0, 0.0)
        # Factor 5: Landslide/Flood Risk (15% weight) -> max of landslide and flood probability
        score_hazard = max(landslide_prob, flood_prob)
        # Factor 6: Traffic Level (5% weight) -> 0 to 100 score
        score_traffic = min(traffic * 10.0, 100.0)
        # Factor 7: Incidents/Delay (10% weight) -> active incidents score
        score_incidents = min((incidents_cnt / 5.0) * 100.0, 100.0)

        raw_weighted_score = (
            score_rainfall * FACTOR_WEIGHTS["rainfall"] +
            score_terrain * FACTOR_WEIGHTS["terrain"] +
            score_history * FACTOR_WEIGHTS["historical_disruption"] +
            score_road * FACTOR_WEIGHTS["road_condition"] +
            score_hazard * FACTOR_WEIGHTS["landslide_flood"] +
            score_traffic * FACTOR_WEIGHTS["traffic"] +
            score_incidents * FACTOR_WEIGHTS["incidents_delay"]
        )

        risk_score = int(round(min(max(raw_weighted_score, 5.0), 99.0)))

        # 2. Risk Classification Thresholds (Section 4)
        if risk_score > RISK_THRESHOLDS["HIGH_MAX"]:
            risk_level = "CRITICAL"
        elif risk_score > RISK_THRESHOLDS["MODERATE_MAX"]:
            risk_level = "HIGH"
        elif risk_score > RISK_THRESHOLDS["LOW_MAX"]:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"

        # 3. Disruption Probability & Predicted Delay Minutes
        disruption_prob = round(min(max(risk_score * 0.96 / 100.0, 0.05), 0.99), 4)
        predicted_delay_minutes = int(round(risk_score * 2.8))

        # 4. Action Recommendation based on Risk Level & Shipment Priority (Section 9 & 10)
        if risk_level == "CRITICAL":
            if shipment_priority in ["Critical", "High"]:
                recommendation = "REROUTE_IMMEDIATELY"
            else:
                recommendation = "DELAY_SHIPMENT"
        elif risk_level == "HIGH":
            recommendation = "USE_ALTERNATIVE_ROUTE"
        elif risk_level == "MODERATE":
            recommendation = "MONITOR_ROUTE"
        else:
            recommendation = "SAFE_TO_PROCEED"

        # 5. Explainable Narrative Generation (Section 6)
        top_factor_parts = []
        if score_rainfall > 50:
            top_factor_parts.append(f"Heavy rainfall ({rainfall}mm, +{int(score_rainfall * 0.20)} pts)")
        if score_hazard > 50:
            top_factor_parts.append(f"High landslide/flood probability ({int(score_hazard)}%, +{int(score_hazard * 0.15)} pts)")
        if score_terrain > 50:
            top_factor_parts.append(f"Steep gorge terrain vulnerability (+{int(score_terrain * 0.15)} pts)")
        if score_history > 50:
            top_factor_parts.append(f"Historical disruption frequency ({history_cnt} events/mo, +{int(score_history * 0.20)} pts)")
        if score_road > 50:
            top_factor_parts.append(f"Damaged road surface (+{int(score_road * 0.15)} pts)")

        if top_factor_parts:
            explanation_str = f"Risk score {risk_score}/100 ({risk_level}) driven by " + ", ".join(top_factor_parts) + "."
        else:
            explanation_str = f"Risk score {risk_score}/100 ({risk_level}). Corridor operating within baseline environmental thresholds."

        # Model Confidence Level
        if disruption_prob >= 0.85 or disruption_prob <= 0.15:
            confidence_level = "VERY_HIGH"
            confidence = 92
        elif disruption_prob >= 0.70 or disruption_prob <= 0.30:
            confidence_level = "HIGH"
            confidence = 86
        else:
            confidence_level = "MODERATE"
            confidence = 78

        prediction_label = "LIKELY_DISRUPTION" if disruption_prob >= 0.5 else "NO_MAJOR_DISRUPTION"

        # Factor explanations for detailed response
        factor_list = [
            {"factor": "Rainfall Intensity", "value": float(rainfall), "weightPct": 20, "points": round(score_rainfall * 0.20, 1), "impact": "HIGH" if score_rainfall > 60 else "MEDIUM" if score_rainfall > 30 else "LOW"},
            {"factor": "Historical Disruption Frequency", "value": float(history_cnt), "weightPct": 20, "points": round(score_history * 0.20, 1), "impact": "HIGH" if score_history > 60 else "MEDIUM" if score_history > 30 else "LOW"},
            {"factor": "Landslide & Flood Hazard", "value": float(score_hazard), "weightPct": 15, "points": round(score_hazard * 0.15, 1), "impact": "HIGH" if score_hazard > 60 else "MEDIUM" if score_hazard > 30 else "LOW"},
            {"factor": "Terrain Vulnerability", "value": float(terrain), "weightPct": 15, "points": round(score_terrain * 0.15, 1), "impact": "HIGH" if score_terrain > 60 else "MEDIUM" if score_terrain > 30 else "LOW"},
            {"factor": "Road Structural Condition", "value": float(road_score), "weightPct": 15, "points": round(score_road * 0.15, 1), "impact": "HIGH" if score_road > 60 else "MEDIUM" if score_road > 30 else "LOW"},
            {"factor": "Active Incidents & Delay", "value": float(incidents_cnt), "weightPct": 10, "points": round(score_incidents * 0.10, 1), "impact": "HIGH" if score_incidents > 60 else "MEDIUM" if score_incidents > 30 else "LOW"},
            {"factor": "Traffic Congestion", "value": float(traffic), "weightPct": 5, "points": round(score_traffic * 0.05, 1), "impact": "HIGH" if score_traffic > 60 else "MEDIUM" if score_traffic > 30 else "LOW"}
        ]

        factor_list.sort(key=lambda x: x["points"], reverse=True)

        return {
            "routeId": route_id,
            "disruptionProbability": disruption_prob,
            "riskScore": risk_score,
            "riskLevel": risk_level,
            "predictedDelayMinutes": predicted_delay_minutes,
            "confidence": confidence,
            "confidenceLevel": confidence_level,
            "predictionLabel": prediction_label,
            "recommendation": recommendation,
            "explanation": explanation_str,
            "dataProvenance": data_provenance,
            "topFactors": factor_list[:4],
            "riskFactors": {
                "rainfall": int(round(score_rainfall)),
                "terrain": int(round(score_terrain)),
                "historicalDisruption": int(round(score_history)),
                "roadCondition": int(round(score_road)),
                "landslideFlood": int(round(score_hazard)),
                "traffic": int(round(score_traffic))
            }
        }

model_engine = DisruptionPredictionModel()
