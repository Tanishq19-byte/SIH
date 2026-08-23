# NER-SmartRoute AI — SIH 2026 (Problem ID: SIH26002)

**AI-Based Smart Logistics and Accessibility Intelligence Platform for the North Eastern Region (NER) — Government Command Center**

Live Demo: https://sih-chi-one.vercel.app

---

## Architecture

`
Browser (React + Vite)  →  Node.js Express API Gateway  →  Python FastAPI AI Microservice
       (Vercel)                    (Render)                         (Render)
                                       ↕
                                  Supabase DB
`

---

## Folder Structure

| Folder | Purpose |
|---|---|
| rontend/ | React + Vite + TailwindCSS SPA |
| ackend/ | Node.js Express API Gateway (JWT, CORS, Rate Limiting) |
| i-service/ | Python FastAPI ML Prediction Microservice |
| supabase/ | Database schema + Row Level Security policies |

---

## Local Development Setup

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- npm

### 1. Clone the Repo
`ash
git clone https://github.com/Tanishq19-byte/SIH.git
cd SIH
`

### 2. Start the Python AI Service
`ash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Verify: http://localhost:8000/health
`

### 3. Configure and Start the Express Backend
`ash
cd backend
cp .env.example .env
# Edit .env — set SUPABASE_URL, SUPABASE_KEY, JWT_SECRET
# For local dev, AI_SERVICE_URL=http://localhost:8000 is already set
npm install
npm run dev
# Verify: http://localhost:5000/health
`

### 4. Start the React Frontend
`ash
cd frontend
# No .env needed for local dev — Vite proxy handles /api calls
npm install
npm run dev
# App: http://localhost:3000
`

---

## Deployment

### Backend + AI Service → Render

1. Push this repo to GitHub (already done).
2. Go to https://render.com → **New Blueprint**.
3. Connect your GitHub repo — Render will auto-detect ender.yaml.
4. In the Render dashboard, manually set these **secret** env vars for 
er-smartroute-backend:
   - SUPABASE_URL — your Supabase project URL
   - SUPABASE_KEY — your Supabase service role key
5. Deploy. Note down the backend URL (e.g. https://ner-smartroute-backend.onrender.com).

### Frontend → Vercel

1. Go to https://vercel.com → Import GitHub repo.
2. In **Environment Variables**, set:
   - VITE_API_BASE_URL = https://ner-smartroute-backend.onrender.com
3. Deploy. Your live URL will be https://sih-chi-one.vercel.app.

---

## Environment Variables Reference

### Backend (ackend/.env)
| Variable | Description | Required |
|---|---|---|
| PORT | Server port (default: 5000) | No |
| NODE_ENV | development or production | Yes |
| AI_SERVICE_URL | FastAPI service URL | Yes |
| SUPABASE_URL | Supabase project endpoint | Yes |
| SUPABASE_KEY | Supabase service role key | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| CORS_ORIGIN | Comma-separated allowed origins | Yes |

### Frontend (rontend/.env.local)
| Variable | Description | Required |
|---|---|---|
| VITE_API_BASE_URL | Express backend base URL | No (uses proxy in dev) |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /health | Backend health check |
| GET | /ready | Backend + AI service readiness |
| POST | /api/v1/ai/predict-disruption | AI disruption prediction |
| GET | /api/v1/vehicles | Vehicle fleet data |
| GET | /api/v1/routes | Route data |
| GET | /api/v1/incidents | Active incidents |
| GET | /api/v1/predictions | Historical predictions |
| GET | /api/v1/alerts | System alerts |
| GET | /api/v1/supplies | Supply chain status |
| GET | /api/v1/simulations | Simulation results |

---

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, MapLibre GL, Lucide Icons
- **Backend**: Node.js, Express, JWT, Custom Rate Limiter
- **AI Service**: Python 3, FastAPI, scikit-learn (Random Forest), Pydantic
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Deployment**: Vercel (frontend), Render (backend + AI service)
