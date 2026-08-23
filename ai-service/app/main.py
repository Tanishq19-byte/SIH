import os
import logging
import time
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.schemas import (
    PredictRequest, PredictResponse, PredictionDetails,
    ExplanationDetails, ModelMetadata, FactorExplanation, RiskFactorsBreakdown
)
from app.model import model_engine, SCENARIOS, RISK_THRESHOLDS, FACTOR_WEIGHTS

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("NER-SmartRoute-AI")

app = FastAPI(
    title="NER-SmartRoute AI Prediction Microservice",
    description="Python FastAPI Microservice for Northeast India Logistics Route Disruption & Risk Validation.",
    version="1.2.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Production CORS Configuration (Section 6)
cors_env = os.getenv(
    "CORS_ORIGIN",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5000,http://127.0.0.1:5000"
)
origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Lightweight Health Endpoint (Section 3)
@app.get("/health")
@app.get("/api/v1/health")
def health_check():
    return {
        "success": True,
        "service": "NER-SmartRoute AI Prediction Service",
        "version": "v1.2.0",
        "status": "healthy",
        "modelLoaded": model_engine.is_loaded,
        "supportedScenarios": list(SCENARIOS.keys())
    }

# Readiness Endpoint (Section 4)
@app.get("/ready")
@app.get("/api/v1/ready")
def readiness_check():
    # Model is ready either via joblib artifacts or transparent multi-attribute decision model
    is_ready = True
    if is_ready:
        return {
            "success": True,
            "status": "READY",
            "modelLoaded": model_engine.is_loaded,
            "engineStatus": "OPERATIONAL",
            "supportedScenariosCount": len(SCENARIOS)
        }
    else:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "status": "NOT_READY",
                "message": "AI Disruption Prediction Model Engine unavailable"
            }
        )

@app.get("/api/v1/scenarios")
def get_scenarios():
    """Returns all 7 deterministic demonstration scenarios with parameters & description."""
    scenario_list = []
    for code, details in SCENARIOS.items():
        scenario_list.append({
            "code": code,
            "name": code.replace("_", " ").title(),
            "description": details.get("description", ""),
            "parameters": {k: v for k, v in details.items() if k != "description"}
        })
    return {
        "success": True,
        "count": len(scenario_list),
        "scenarios": scenario_list
    }

@app.post("/api/v1/predict-disruption", response_model=PredictResponse)
def predict_disruption(payload: PredictRequest):
    start_time = time.time()
    try:
        data_dict = payload.model_dump()
        result = model_engine.predict(data_dict)

        top_factors = [
            FactorExplanation(
                factor=f["factor"],
                value=f["value"],
                weightPct=f["weightPct"],
                points=f["points"],
                impact=f["impact"]
            )
            for f in result["topFactors"]
        ]

        risk_factors_breakdown = RiskFactorsBreakdown(
            rainfall=result["riskFactors"]["rainfall"],
            terrain=result["riskFactors"]["terrain"],
            historicalDisruption=result["riskFactors"]["historicalDisruption"],
            roadCondition=result["riskFactors"]["roadCondition"],
            landslideFlood=result["riskFactors"]["landslideFlood"],
            traffic=result["riskFactors"]["traffic"]
        )

        duration_ms = round((time.time() - start_time) * 1000, 2)
        logger.info(
            f"Prediction | routeId={result['routeId']} | scenario={payload.scenario or 'CUSTOM'} | "
            f"riskScore={result['riskScore']} | riskLevel={result['riskLevel']} | "
            f"recommendation={result['recommendation']} | duration={duration_ms}ms"
        )

        return PredictResponse(
            success=True,
            prediction=PredictionDetails(
                routeId=result["routeId"],
                riskScore=result["riskScore"],
                riskLevel=result["riskLevel"],
                disruptionProbability=result["disruptionProbability"],
                predictedDelayMinutes=result["predictedDelayMinutes"],
                confidence=result["confidence"],
                confidenceLevel=result["confidenceLevel"],
                predictionLabel=result["predictionLabel"],
                recommendation=result["recommendation"],
                explanation=result["explanation"],
                dataProvenance=result["dataProvenance"]
            ),
            explanation=ExplanationDetails(
                topFactors=top_factors,
                riskFactors=risk_factors_breakdown,
                narrative=result["explanation"]
            ),
            model=ModelMetadata(
                name="Random Forest & Transparent Multi-Attribute Model",
                version="v1.2.0",
                calibratedOn="Northeast India Logistics Historical & Telemetry Benchmark Dataset"
            )
        )
    except ValueError as ve:
        logger.warning(f"Validation error processing prediction: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid parameter format: {str(ve)}"
        )
    except Exception as e:
        logger.exception("Error processing disruption prediction")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while evaluating the disruption prediction model."
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting NER-SmartRoute AI Microservice on {host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)
