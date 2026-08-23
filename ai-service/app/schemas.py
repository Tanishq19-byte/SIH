from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PredictRequest(BaseModel):
    routeId: Optional[str] = Field("NH-27", description="Corridor ID e.g. NH-27, NH-10")
    origin: Optional[str] = Field("Guwahati Logistics Hub", description="Origin depot name")
    destination: Optional[str] = Field("Silchar SMCH Hospital", description="Destination facility name")
    distanceKm: Optional[float] = Field(340.0, ge=1.0, le=2000.0, description="Corridor distance in km")
    elevation: Optional[float] = Field(1200.0, ge=0.0, le=6000.0, description="Peak elevation in meters")
    rainfall24h: float = Field(140.0, ge=0.0, le=500.0, description="24-hour accumulated rainfall in mm")
    rainfallForecast: Optional[float] = Field(154.0, ge=0.0, le=500.0, description="Forecasted 24-hour rainfall in mm")
    temperature: Optional[float] = Field(22.5, ge=-20.0, le=50.0, description="Ambient temperature in °C")
    terrainRisk: float = Field(0.85, ge=0.0, le=1.0, description="Terrain vulnerability risk score (0.0 to 1.0)")
    roadConditionScore: float = Field(3.8, ge=0.0, le=10.0, description="Road structural condition score (0.0 Worst to 10.0 Best)")
    historicalDisruptionCount: Optional[int] = Field(14, ge=0, le=100, description="Historical disruption event count per month")
    floodProbability: Optional[float] = Field(72.0, ge=0.0, le=100.0, description="Estimated flood probability (0 to 100%)")
    landslideProbability: Optional[float] = Field(88.0, ge=0.0, le=100.0, description="Estimated landslide probability (0 to 100%)")
    trafficScore: Optional[float] = Field(6.5, ge=0.0, le=10.0, description="Traffic congestion score (0.0 to 10.0)")
    riverLevelPercent: Optional[float] = Field(89.0, ge=0.0, le=100.0, description="River level saturation percent (0 to 100%)")
    activeIncidentCount: Optional[int] = Field(3, ge=0, le=50, description="Active field incident report count")
    shipmentPriority: Optional[str] = Field("Critical", description="Priority level: Critical, High, Normal, Low")
    vehicleCount: Optional[int] = Field(38, ge=0, le=500, description="Essential logistics vehicle count")
    supplyUrgency: Optional[float] = Field(9.2, ge=0.0, le=10.0, description="Essential supply urgency priority (0.0 to 10.0)")
    scenario: Optional[str] = Field(None, description="Preset scenario: NORMAL_OPERATION, HEAVY_RAINFALL, LANDSLIDE_ALERT, FLOOD_EVENT, ROAD_CLOSURE, MULTI_DISRUPTION, RECOVERY")

    class Config:
        json_schema_extra = {
            "example": {
                "routeId": "NH-27",
                "origin": "Guwahati Logistics Hub",
                "destination": "Silchar SMCH Hospital",
                "distanceKm": 340.0,
                "elevation": 1200.0,
                "rainfall24h": 185.0,
                "rainfallForecast": 210.0,
                "terrainRisk": 0.85,
                "roadConditionScore": 3.2,
                "historicalDisruptionCount": 16,
                "floodProbability": 82.0,
                "landslideProbability": 94.0,
                "trafficScore": 7.5,
                "riverLevelPercent": 92.0,
                "activeIncidentCount": 4,
                "shipmentPriority": "Critical",
                "scenario": "LANDSLIDE_ALERT"
            }
        }

class FactorExplanation(BaseModel):
    factor: str
    value: float
    weightPct: int
    points: float
    impact: str

class RiskFactorsBreakdown(BaseModel):
    rainfall: int
    terrain: int
    historicalDisruption: int
    roadCondition: int
    landslideFlood: int
    traffic: int

class PredictionDetails(BaseModel):
    routeId: str
    riskScore: int
    riskLevel: str  # LOW (0-30), MODERATE (31-55), HIGH (56-75), CRITICAL (76-100)
    disruptionProbability: float
    predictedDelayMinutes: int
    confidence: int
    confidenceLevel: str # VERY_HIGH, HIGH, MODERATE
    predictionLabel: str # LIKELY_DISRUPTION vs NO_MAJOR_DISRUPTION
    recommendation: str  # SAFE_TO_PROCEED, MONITOR_ROUTE, USE_ALTERNATIVE_ROUTE, DELAY_SHIPMENT, REROUTE_IMMEDIATELY
    explanation: str
    dataProvenance: str  # REAL_TIME, HISTORICAL, SIMULATED, DERIVED

class ExplanationDetails(BaseModel):
    topFactors: List[FactorExplanation]
    riskFactors: RiskFactorsBreakdown
    narrative: str

class ModelMetadata(BaseModel):
    name: str = "Random Forest & Transparent Multi-Attribute Decision Model"
    version: str = "v1.2.0"
    calibratedOn: str = "Northeast India Logistics Historical & Telemetry Benchmark Dataset"

class PredictResponse(BaseModel):
    success: bool = True
    prediction: PredictionDetails
    explanation: ExplanationDetails
    model: ModelMetadata
