-- ====================================================================
-- NER-SmartRoute AI: Supabase / PostgreSQL Production Schema (SIH26002)
-- North Eastern Region Smart Logistics & Accessibility Intelligence Platform
-- ====================================================================

-- Enable PostGIS extension for geospatial queries & routing
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table (Command Officers & Field Inspectors)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role VARCHAR(50) DEFAULT 'officer', -- admin, officer, analyst, field_inspector, viewer
  agency VARCHAR(150) NOT NULL, -- NDMA, MDoNER, BRO, PWD, NHIDCL
  phone VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Logistics Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(50) PRIMARY KEY,
  reg_number VARCHAR(30) UNIQUE NOT NULL,
  driver_name VARCHAR(100) NOT NULL,
  driver_phone VARCHAR(20),
  agency VARCHAR(150) NOT NULL,
  status VARCHAR(30) DEFAULT 'on_duty', -- on_duty, delayed, route_interrupted, rerouted, halted
  speed_kmh NUMERIC(5,2) DEFAULT 0,
  fuel_level_pct NUMERIC(5,2) DEFAULT 100,
  location_name VARCHAR(255),
  current_position GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Essential Supply Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
  id VARCHAR(50) PRIMARY KEY,
  vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE CASCADE,
  cargo_category VARCHAR(100) NOT NULL,
  cargo_description TEXT NOT NULL,
  cargo_quantity VARCHAR(100) NOT NULL,
  origin_depot VARCHAR(255) NOT NULL,
  destination_hub VARCHAR(255) NOT NULL,
  priority_level VARCHAR(30) DEFAULT 'High', -- Critical, High, Medium, Low
  eta_original TIMESTAMPTZ NOT NULL,
  eta_revised TIMESTAMPTZ NOT NULL,
  delay_hours NUMERIC(5,2) DEFAULT 0,
  status VARCHAR(30) DEFAULT 'in_transit',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. National Highway Routes Table
CREATE TABLE IF NOT EXISTS routes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  states TEXT[] NOT NULL,
  distance_km NUMERIC(8,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'operational', -- operational, warning, blocked
  disruption_type VARCHAR(255),
  location_description TEXT,
  accessibility_score NUMERIC(5,2) DEFAULT 100.00,
  normal_travel_hours NUMERIC(5,2) NOT NULL,
  current_travel_hours NUMERIC(5,2) NOT NULL,
  risk_level VARCHAR(30) DEFAULT 'Low', -- Critical, High, Medium, Low
  geom GEOMETRY(LineString, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Sub-Highway Road Segments Table
CREATE TABLE IF NOT EXISTS road_segments (
  id VARCHAR(50) PRIMARY KEY,
  route_id VARCHAR(50) REFERENCES routes(id) ON DELETE CASCADE,
  segment_name VARCHAR(255) NOT NULL,
  start_km NUMERIC(6,2) NOT NULL,
  end_km NUMERIC(6,2) NOT NULL,
  terrain_type VARCHAR(50) NOT NULL,
  current_condition VARCHAR(50) DEFAULT 'excellent',
  risk_score NUMERIC(5,2) DEFAULT 0.0,
  geom GEOMETRY(LineString, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Field Incident Reports Table
CREATE TABLE IF NOT EXISTS incidents (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  corridor_id VARCHAR(50) REFERENCES routes(id),
  state VARCHAR(50) NOT NULL,
  district VARCHAR(100) NOT NULL,
  location_description TEXT NOT NULL,
  photo_url TEXT,
  reported_by VARCHAR(150) NOT NULL,
  reporter_agency VARCHAR(150) NOT NULL,
  status VARCHAR(30) DEFAULT 'Reported',
  clearing_agency VARCHAR(150),
  impact_summary TEXT,
  ai_risk_index NUMERIC(5,2),
  coordinates GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Risk Predictions Log Table
CREATE TABLE IF NOT EXISTS risk_predictions (
  id VARCHAR(50) PRIMARY KEY,
  corridor_id VARCHAR(50) REFERENCES routes(id),
  prediction_type VARCHAR(100) NOT NULL,
  risk_score NUMERIC(5,2) NOT NULL,
  confidence_interval VARCHAR(50) NOT NULL,
  predicted_cause TEXT NOT NULL,
  recommended_bypass TEXT NOT NULL,
  time_saved_hours NUMERIC(5,2) DEFAULT 0,
  model_name VARCHAR(100) DEFAULT 'Prototype Risk Model',
  evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Centralized Command Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  time_display VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  location TEXT NOT NULL,
  affected_vehicle TEXT,
  affected_delivery_id VARCHAR(50) REFERENCES deliveries(id),
  recommended_action TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NER Districts Registry Table
CREATE TABLE IF NOT EXISTS districts (
  id VARCHAR(50) PRIMARY KEY,
  district_name VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  population INT NOT NULL,
  hospitals_count INT DEFAULT 1,
  primary_hospital VARCHAR(255) NOT NULL,
  isolation_risk VARCHAR(50) DEFAULT 'Low',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. District Supply Inventory Table
CREATE TABLE IF NOT EXISTS supply_inventory (
  id VARCHAR(50) PRIMARY KEY,
  district_id VARCHAR(50) REFERENCES districts(id) ON DELETE CASCADE,
  oxygen_days_remaining NUMERIC(5,2) NOT NULL,
  oxygen_total_units VARCHAR(100) NOT NULL,
  fuel_days_remaining NUMERIC(5,2) NOT NULL,
  fuel_total_units VARCHAR(100) NOT NULL,
  grains_days_remaining NUMERIC(5,2) NOT NULL,
  grains_total_units VARCHAR(100) NOT NULL,
  meds_days_remaining NUMERIC(5,2) NOT NULL,
  meds_total_units VARCHAR(100) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. What-If Simulation Runs Table
CREATE TABLE IF NOT EXISTS simulation_runs (
  id VARCHAR(50) PRIMARY KEY,
  scenario_name VARCHAR(255) NOT NULL,
  rainfall_mm NUMERIC(6,2) NOT NULL,
  num_blockages INT NOT NULL,
  flood_severity VARCHAR(30) NOT NULL,
  landslide_prob NUMERIC(5,2) NOT NULL,
  traffic_congestion VARCHAR(30) NOT NULL,
  accessible_pct_after NUMERIC(5,2) NOT NULL,
  blocked_pct_after NUMERIC(5,2) NOT NULL,
  prepared_actions TEXT[] NOT NULL,
  executed_by VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Official Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  officer_id VARCHAR(100) NOT NULL,
  officer_name VARCHAR(150) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  vehicle_reg_number VARCHAR(30),
  previous_route TEXT,
  applied_route TEXT,
  justification TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'VERIFIED & ENFORCED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indices for Performance
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_priority ON deliveries(priority_level);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & HARDENING (Step 14)
-- ====================================================================

-- Enable RLS on all 12 tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public / Authenticated Read Access for Regional Command Visibility
CREATE POLICY "Public Read Access for Routes" ON routes FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Road Segments" ON road_segments FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Supply Inventory" ON supply_inventory FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Deliveries" ON deliveries FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Risk Predictions" ON risk_predictions FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Simulation Runs" ON simulation_runs FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Audit Logs" ON audit_logs FOR SELECT USING (true);

-- 2. Restricted Write Access (Insert/Update/Delete) for Authenticated Officers & Admins
CREATE POLICY "Officer Write Access for Incidents" ON incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Officer Write Access for Audit Logs" ON audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Officer Write Access for Alerts" ON alerts FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 3. Users Table Strict Self / Service Role Access
CREATE POLICY "Users Read Self or Officer" ON users FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access Users" ON users FOR ALL USING (auth.role() = 'service_role');
