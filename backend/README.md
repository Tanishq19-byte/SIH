# NER-SmartRoute AI Express Backend API (SIH26002)

Node.js + Express REST API Gateway communicating with the Python FastAPI AI Microservice and Supabase PostgreSQL Database.

## Architecture
`React SPA` &rarr; `Express Backend (Port 5000)` &rarr; `FastAPI AI Microservice (Port 8000)` &rarr; `Random Forest Model`

## Local Development Startup Order

### Terminal 1: Python FastAPI AI Microservice
```bash
cd ai-service
uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Node.js Express Backend
```bash
cd backend
npm start
```

### Terminal 3: React Frontend Application
```bash
cd frontend
npm run dev
```

## API Endpoints
- Express Health: `GET http://localhost:5000/health`
- AI Service Health Proxy: `GET http://localhost:5000/api/v1/ai/health`
- AI Prediction Proxy: `POST http://localhost:5000/api/v1/ai/predict-disruption`
- Vehicles API: `GET & POST http://localhost:5000/api/v1/vehicles`
- Incidents API: `GET & POST http://localhost:5000/api/v1/incidents`
- Predictions API: `GET & POST http://localhost:5000/api/v1/predictions`
- Supplies API: `GET & POST http://localhost:5000/api/v1/supplies`
- Simulations API: `GET & POST http://localhost:5000/api/v1/simulations`
