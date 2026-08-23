# Step 16A — Production Deployment Preparation: FastAPI AI Service

**Project**: NER-SmartRoute AI (SIH Problem ID: SIH26002)  
**Target Component**: Python FastAPI AI Prediction Microservice (`ai-service/`)  
**Deployment Preparedness Status**: **DEPLOYMENT-READY**

---

## 1. AI Service Architecture Audit

```
[ Express API Proxy (Port 5000) ]
              │
              │ (HTTP POST /api/v1/predict-disruption)
              ▼
[ FastAPI App (`app.main:app`) ]
   ├── Configurable CORS Middleware (`CORS_ORIGIN`)
   ├── Health Check Endpoint (`/health` & `/api/v1/health`)
   ├── Readiness Endpoint (`/ready` & `/api/v1/ready`)
   ├── Demonstration Scenarios Endpoint (`/api/v1/scenarios`)
   ├── Model Engine Singleton (`app.model.model_engine`)
   │      ├── Loads `disruption_model.joblib` & `preprocessor.joblib` at startup
   │      └── Evaluates transparent multi-factor weighted risk decision rules
   └── Structured Request & Exception Logging
```

---

## 2. Production Entry Point & Start Command

- **FastAPI Module & Application Variable**: `app.main:app`
- **Production Host Binding**: `0.0.0.0`
- **Dynamic Port Environment Variable**: `$PORT` (Defaults to `8000` for local development)
- **Production Execution Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
  ```
- **Procfile Process Definition**:
  ```
  web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

---

## 3. Health & Readiness Endpoints

| Endpoint | Method | Response Output | Description |
| :--- | :---: | :--- | :--- |
| `/health` | `GET` | `{"success": true, "service": "NER-SmartRoute AI Prediction Service", "status": "healthy", "modelLoaded": true}` | Lightweight process alive confirmation. |
| `/ready` | `GET` | `{"success": true, "status": "READY", "modelLoaded": true, "engineStatus": "OPERATIONAL"}` | Verifies model engine artifacts & inference readiness. |

---

## 4. Environment Variables Audit

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `HOST` | Optional | `0.0.0.0` | Production network binding address. |
| `PORT` | Required (PaaS) | `8000` | Dynamic HTTP port injected by cloud provider. |
| `CORS_ORIGIN` | Required | Allowed origin list | Whitelisted origins allowed to query prediction endpoints. |
| `NODE_ENV` | Optional | `production` | Deployment environment mode. |

---

## 5. Model Loading Strategy

- **Startup Strategy**: Single-instantiation module singleton pattern (`model_engine = DisruptionPredictionModel()`).
- **Behavior**: Loaded once at process initialization. Does **NOT** reload model files on per-request calls.
- **Latency Benchmark**: Average prediction inference latency is **0.01 ms to 0.02 ms per request**.

---

## 6. Deployment Artifacts Created

- [`ai-service/Procfile`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/ai-service/Procfile): PaaS process definition.
- [`ai-service/Dockerfile`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/ai-service/Dockerfile): Container configuration (Python 3.11-slim, healthcheck, dynamic `$PORT` binding).
- [`ai-service/render.yaml`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/ai-service/render.yaml): Render cloud deployment configuration.
- [`ai-service/.env.example`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/ai-service/.env.example): Environment variable template.

---

## 7. Local Production Simulation Results

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- **Process Startup**: Success (0 crashes).
- **Network Binding**: Bound to `0.0.0.0:8000`.
- **Health Check**: Returned `200 OK`.
- **Readiness Check**: Returned `200 OK` (`is_ready: true`).
- **Prediction Request**: Returned `200 OK` (`riskScore: 81`, `CRITICAL`).

---

## 8. System Regression Test Execution Matrix

| Test Suite | File Path | Executed Tests | Status |
| :--- | :--- | :---: | :---: |
| **Step 12 AI Model Tests** | [`ai-service/test_scenarios.py`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/ai-service/test_scenarios.py) | 11 / 11 PASSED | **PASS** |
| **Step 13 Resilience Tests** | [`ai-service/test_resilience.py`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/ai-service/test_resilience.py) | 4 / 4 PASSED | **PASS** |
| **Step 14 Security Tests** | [`backend/test_security.js`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/backend/test_security.js) | 10 / 10 PASSED | **PASS** |
| **Step 15 E2E SIH Tests** | [`backend/test_e2e_sih.js`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/backend/test_e2e_sih.js) | 8 / 8 PASSED | **PASS** |
