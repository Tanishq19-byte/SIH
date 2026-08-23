# NER-SmartRoute AI Microservice (SIH26002)

Python 3.11 / FastAPI AI Predictive Service for North East India Logistics Corridor Disruption Prediction.

## Model Metadata (v1.1)
- **Model**: RandomForestClassifier (n_estimators=100, max_depth=5, random_state=42)
- **Preprocessor**: StandardScaler
- **Training Records**: 110 normalized prototype records (`TRAIN-001` through `TRAIN-110`)
- **Evaluation**: 80/20 Holdout Test + 5-Fold Stratified K-Fold Cross-Validation

## CURRENT DATA STATUS & PROTOTYPE LIMITATIONS

> [!IMPORTANT]
> The current machine learning model is trained on synthetic prototype data created for SIH proof-of-concept and system architecture development.
> 
> The dataset is **NOT**:
> - Official government disaster data
> - Production IMD meteorological observations
> - Real-time automated road sensor telemetry
> - An official historical disaster database
> 
> The architecture is designed to seamlessly ingest production data sources in the future:
> - Real-time IMD weather observations & rainfall forecasts
> - CWC river gauge & water level telemetry
> - Geological Survey of India (GSI) slope & elevation risk maps
> - NHAI / BRO road structural condition reports
> - Real-time convoy GPS telemetry & field officer incident reports
> 
> Accuracy metrics (e.g. 90.91%) reflect synthetic prototype data patterns and should NOT be interpreted as real-world predictive performance.

## Project Structure
```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── model.py
│   ├── schemas.py
│   └── preprocessing.py
├── data/
│   └── training_data.json
├── models/
│   ├── disruption_model.joblib
│   └── preprocessor.joblib
├── train_model.py
├── test_scenarios.py
├── requirements.txt
└── README.md
```

## How to Run

1. Install Dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Train Model & Run Cross-Validation:
   ```bash
   python train_model.py
   ```

3. Start FastAPI Microservice:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. Run 5-Scenario Monotonicity Test Script:
   ```bash
   python test_scenarios.py
   ```

5. Service Endpoints:
   - Health Check: `GET http://localhost:8000/api/v1/health`
   - Swagger Documentation: `http://localhost:8000/docs`
   - Prediction Endpoint: `POST http://localhost:8000/api/v1/predict-disruption`
