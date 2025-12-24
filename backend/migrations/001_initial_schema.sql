-- EV Management Platform Database Schema
-- Migration 001: Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- MANUFACTURERS TABLE
-- ====================================
CREATE TABLE ev_manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(100),
    logo_url VARCHAR(500),
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_manufacturers_name ON ev_manufacturers(name);

-- ====================================
-- EV MODELS TABLE
-- ====================================
CREATE TABLE ev_models (
    id SERIAL PRIMARY KEY,
    manufacturer_id INTEGER NOT NULL REFERENCES ev_manufacturers(id) ON DELETE CASCADE,
    model_name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    battery_capacity_kwh DECIMAL(10, 2) NOT NULL,
    range_km INTEGER NOT NULL,
    charging_type VARCHAR(100),
    fast_charging_time_minutes INTEGER,
    energy_consumption_kwh_per_km DECIMAL(10, 4) NOT NULL,
    drivetrain VARCHAR(50),
    body_type VARCHAR(50),
    price_usd DECIMAL(12, 2),
    image_url VARCHAR(500),
    specifications JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_model_year UNIQUE(manufacturer_id, model_name, year)
);

CREATE INDEX idx_ev_models_manufacturer ON ev_models(manufacturer_id);
CREATE INDEX idx_ev_models_year ON ev_models(year);
CREATE INDEX idx_ev_models_range ON ev_models(range_km);
CREATE INDEX idx_ev_models_price ON ev_models(price_usd);

-- ====================================
-- CHARGING STATIONS TABLE
-- ====================================
CREATE TABLE ev_charging_stations (
    id SERIAL PRIMARY KEY,
    station_name VARCHAR(255) NOT NULL,
    operator VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Ghana',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    charger_type VARCHAR(100) NOT NULL,
    power_output_kw DECIMAL(10, 2) NOT NULL,
    number_of_chargers INTEGER DEFAULT 1,
    cost_per_kwh DECIMAL(10, 4),
    availability_status VARCHAR(50) DEFAULT 'operational',
    operating_hours VARCHAR(255),
    payment_methods TEXT,
    amenities TEXT[],
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_charging_stations_location ON ev_charging_stations(latitude, longitude);
CREATE INDEX idx_charging_stations_country ON ev_charging_stations(country);
CREATE INDEX idx_charging_stations_status ON ev_charging_stations(availability_status);

-- ====================================
-- CASE STUDIES TABLE
-- ====================================
CREATE TABLE ev_case_studies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    industry VARCHAR(255),
    organization VARCHAR(255),
    problem_statement TEXT NOT NULL,
    solution_implemented TEXT,
    findings TEXT NOT NULL,
    pros TEXT[] NOT NULL,
    cons TEXT[] NOT NULL,
    recommendations TEXT NOT NULL,
    impact_metrics JSONB,
    date_published DATE,
    author VARCHAR(255),
    image_url VARCHAR(500),
    document_url VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_case_studies_country ON ev_case_studies(country);
CREATE INDEX idx_case_studies_industry ON ev_case_studies(industry);
CREATE INDEX idx_case_studies_published ON ev_case_studies(is_published);

-- ====================================
-- USERS TABLE (Admin Portal)
-- ====================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ====================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ====================================
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

-- ====================================
-- AUDIT LOG TABLE (Optional but recommended)
-- ====================================
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ====================================
-- TRIGGERS FOR UPDATED_AT
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ev_manufacturers_updated_at BEFORE UPDATE ON ev_manufacturers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ev_models_updated_at BEFORE UPDATE ON ev_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ev_charging_stations_updated_at BEFORE UPDATE ON ev_charging_stations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ev_case_studies_updated_at BEFORE UPDATE ON ev_case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- SEED DATA (Default Admin User)
-- Password: Admin@123 (Change immediately in production)
-- ====================================
INSERT INTO users (name, email, password_hash, role) VALUES 
('System Admin', 'admin@evplatform.com', '$2a$10$YourHashedPasswordHere', 'admin');

COMMENT ON TABLE users IS 'Admin portal users with role-based access';
COMMENT ON TABLE ev_models IS 'Electric vehicle models database';
COMMENT ON TABLE ev_charging_stations IS 'Charging infrastructure directory';
COMMENT ON TABLE ev_case_studies IS 'EV implementation case studies';
