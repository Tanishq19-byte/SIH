# Production Cloud Deployment Guide (WITHOUT Render)
## Vercel (Frontend) + Koyeb/Railway (Backend & AI) + Supabase (Database)

**GitHub Repository**: [https://github.com/Tanishq19-byte/SIH.git](https://github.com/Tanishq19-byte/SIH.git)  

---

## 1. Supabase Setup (Database - 1 Minute)

1. Open [https://supabase.com](https://supabase.com) and log in.
2. Click **New Project** (Name: `NER-SmartRoute-AI`).
3. Click **SQL Editor** in the left menu $\rightarrow$ Click **New Query**.
4. Copy the complete SQL script from [`supabase/schema.sql`](file:///c:/Users/tanis/Downloads/Sih%20winning%20project/supabase/schema.sql) and paste it into the editor.
5. Click **RUN**.
6. Go to **Project Settings** $\rightarrow$ **API** and copy:
   - **Project URL**: `https://<your-project-id>.supabase.co`
   - **service_role key**: `eyJhbG...`

---

## 2. Python AI Service Deployment on Koyeb / Railway (2 Minutes)

1. Open [https://www.koyeb.com](https://www.koyeb.com) (or [https://railway.app](https://railway.app)) and log in with GitHub.
2. Click **Create Web Service** $\rightarrow$ Select **GitHub**.
3. Choose repository: `Tanishq19-byte/SIH`.
4. Configure service settings:
   - **Root Directory**: `ai-service`
   - **Builder**: `Buildpack` or `Dockerfile`
   - **Port**: `8000`
5. Click **Deploy**.
6. Copy your live AI URL: `https://<your-ai-service-name>.koyeb.app`

---

## 3. Node.js Express Backend Deployment on Koyeb / Railway (2 Minutes)

1. In Koyeb (or Railway), click **Create Web Service** $\rightarrow$ Select **GitHub** (`Tanishq19-byte/SIH`).
2. Configure backend settings:
   - **Root Directory**: `backend`
   - **Port**: `5000`
3. Add **Environment Variables**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `AI_SERVICE_URL`: `https://<your-ai-service-name>.koyeb.app` *(The AI URL from Step 2)*
   - `SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `SUPABASE_KEY`: `<your-supabase-service-role-key>`
   - `CORS_ORIGIN`: `*`
4. Click **Deploy**.
5. Copy your live Backend URL: `https://<your-backend-name>.koyeb.app`

---

## 4. Frontend Website Deployment on Vercel (1 Minute)

1. Open [https://vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Import repository `Tanishq19-byte/SIH`.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit $\rightarrow$ Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_BASE_URL`: `https://<your-backend-name>.koyeb.app/api/v1` *(The Backend URL from Step 3)*
5. Click **Deploy**!
6. Vercel will build your application and generate your live working website link: `https://<your-app-name>.vercel.app`
