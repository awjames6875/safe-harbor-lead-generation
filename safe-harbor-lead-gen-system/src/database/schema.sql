-- Organizations Table
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255 ) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    zip_code VARCHAR(10),
    county VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(255),
    hours_weekly INT,
    category VARCHAR(100),
    reviews_count INT,
    priority_score INT CHECK (priority_score >= 0 AND priority_score <= 10),
    valid_email BOOLEAN DEFAULT FALSE,
    valid_phone BOOLEAN DEFAULT FALSE,
    decision_maker_name VARCHAR(255),
    decision_maker_email VARCHAR(255),
    organization_type VARCHAR(100),
    medicaid_accepted BOOLEAN DEFAULT FALSE,
    seeking_funding BOOLEAN DEFAULT FALSE,
    kids_served INT,
    facility_fee_potential DECIMAL(10, 2),
    monthly_revenue_potential DECIMAL(12, 2),
    ghl_contact_id VARCHAR(255),
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns Table
CREATE TABLE campaigns (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_type VARCHAR(50),
    status VARCHAR(50),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    replied_at TIMESTAMP,
    response_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partnerships Table
CREATE TABLE partnerships (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    status VARCHAR(50),
    facility_fee DECIMAL(10, 2),
    estimated_kids INT,
    start_date DATE,
    revenue_generated DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Table
CREATE TABLE analytics (
    id BIGSERIAL PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    leads_discovered INT DEFAULT 0,
    emails_sent INT DEFAULT 0,
    emails_opened INT DEFAULT 0,
    emails_replied INT DEFAULT 0,
    sms_sent INT DEFAULT 0,
    calls_made INT DEFAULT 0,
    qualified_leads INT DEFAULT 0,
    partnerships_signed INT DEFAULT 0,
    revenue_generated DECIMAL(12, 2) DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_organizations_county ON organizations(county);
CREATE INDEX idx_organizations_category ON organizations(category);
CREATE INDEX idx_organizations_priority ON organizations(priority_score);
CREATE INDEX idx_campaigns_organization ON campaigns(organization_id);
CREATE INDEX idx_partnerships_organization ON partnerships(organization_id);
