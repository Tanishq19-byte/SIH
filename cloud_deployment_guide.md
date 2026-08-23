# Production Cloud Deployment Guide — Vercel + Render + Supabase

**Project**: NER-SmartRoute AI (SIH Problem ID: SIH26002)  
**GitHub Repository**: [https://github.com/Tanishq19-byte/SIH.git](https://github.com/Tanishq19-byte/SIH.git)  

---

## 1. Supabase Database Deployment (1 Minute)

1. Open [https://supabase.com](https://supabase.com) and log in to your account.
2. Click **New Project** (Name: `NER-SmartRoute-AI`, Region: `South Asia (Mumbai)`).
3. Once created, go to **SQL Editor** in the left sidebar $\rightarrow$ Click **New Query**.
4. Copy the complete SQL schema from [`supabase/schema.sql`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/supabase/schema.sql) and paste it into the query window.
5. Click **RUN**.
   - *This creates PostGIS PostGIS extensions, 12 production tables, performance indices, and Row Level Security (RLS) policies.*
6. Go to **Project Settings** $\rightarrow$ **API** and copy:
   - **Project URL**: `https://<your-project-id>.supabase.co`
   - **anon / public key**: `eyJhbG...`
   - **service_role key**: `eyJhbG...` (Keep strictly server-side)

---

## 2. Render Cloud Services Deployment (2 Minutes)

We have configured an automated **Infrastructure-as-Code Blueprint** ([`render.yaml`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/render.yaml)).

1. Open [https://dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** (top right) $\rightarrow$ Select **Blueprint**.
3. Connect your GitHub account and select repository: `Tanishq19-byte/SIH`.
4. Render will automatically detect [`render.yaml`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/render.yaml) and configure two web services:
   - `ner-smartroute-ai` (Python FastAPI AI Microservice)
   - `ner-smartroute-backend` (Node.js Express Backend API)
5. Under Environment Variables for `ner-smartroute-backend`, add:
   - `SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `SUPABASE_KEY`: `<your-supabase-service-role-key>`
6. Click **Apply**. Render will automatically build, deploy, and connect both services.
7. Note down the generated URLs:
   - **Python AI Microservice URL**: `https://ner-smartroute-ai.onrender.com`
   - **Node.js Express Backend URL**: `https://ner-smartroute-backend.onrender.com`

---

## 3. Vercel Frontend Deployment (1 Minute)

1. Open [https://vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Import repository `Tanishq19-byte/SIH`.
3. Configure the Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit $\rightarrow$ Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://ner-smartroute-backend.onrender.com/api/v1`
5. Click **Deploy**.
   - *Vercel will build the frontend and generate your live production link!* (e.g. `https://sih-ner-smartroute.vercel.app`)

---

## 4. Live Verification & Health Checks

Once deployed, verify that all three tiers are communicating:

- **Frontend Production URL**: `https://sih-ner-smartroute.vercel.app`
- **Backend API Health Check**: `https://ner-smartroute-backend.onrender.com/health`
- **Backend Dependency Readiness Check**: `https://ner-smartroute-backend.onrender.com/ready`
- **Python AI Microservice Health**: `https://ner-smartroute-ai.onrender.com/health`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All system dependencies ready for operational traffic",
  "data": {
    "service": "NER-SmartRoute AI API",
    "isReady": true,
    "dependencies": {
      "expressServer": "healthy",
      "aiService": "healthy",
      "database": "healthy_mock"
    }
  }
}
```
