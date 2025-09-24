# 🗄️ Database Schema - Permit Office Finder

## **Core Tables**

### **permit_offices**
```sql
CREATE TABLE permit_offices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'county', 'city', 'state'
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    office_hours TEXT,
    processing_time VARCHAR(100),
    online_portal BOOLEAN DEFAULT false,
    coordinates POINT, -- PostGIS for lat/lng
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **jurisdictions**
```sql
CREATE TABLE jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_office_id UUID REFERENCES permit_offices(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'county', 'city', 'township'
    state VARCHAR(2) NOT NULL,
    boundary GEOMETRY, -- PostGIS polygon
    zip_codes TEXT[], -- Array of zip codes
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **services**
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_office_id UUID REFERENCES permit_offices(id),
    service_type VARCHAR(100) NOT NULL, -- 'building', 'electrical', 'solar', etc.
    description TEXT,
    requirements TEXT[],
    fees JSONB, -- Flexible fee structure
    forms_required TEXT[],
    processing_days INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **permits**
```sql
CREATE TABLE permits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    permit_office_id UUID REFERENCES permit_offices(id),
    permit_number VARCHAR(100),
    type VARCHAR(50) NOT NULL, -- 'building', 'electrical', 'solar'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'approved', 'rejected'
    project_address TEXT NOT NULL,
    project_description TEXT,
    estimated_value DECIMAL(12,2),
    application_data JSONB, -- Flexible form data storage
    documents TEXT[], -- Array of document URLs
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **users**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user', -- 'user', 'contractor', 'admin'
    license_number VARCHAR(100), -- For contractors
    preferences JSONB, -- User settings and preferences
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **documents**
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_id UUID REFERENCES permits(id),
    user_id UUID REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_url TEXT NOT NULL,
    document_type VARCHAR(100), -- 'application', 'plans', 'permit', 'certificate'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'deleted'
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **notifications**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    permit_id UUID REFERENCES permits(id),
    type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push'
    channel VARCHAR(50) NOT NULL, -- 'status_update', 'reminder', 'approval'
    subject VARCHAR(255),
    message TEXT NOT NULL,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **permit_status_history**
```sql
CREATE TABLE permit_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_id UUID REFERENCES permits(id),
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by VARCHAR(100), -- 'system', 'user', 'office_staff'
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **reviews**
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_office_id UUID REFERENCES permit_offices(id),
    user_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    service_type VARCHAR(100), -- Which service they used
    processing_time_actual INTEGER, -- Actual days it took
    would_recommend BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## **📍 Geographic Data (PostGIS)**

### **address_cache**
```sql
CREATE TABLE address_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address_input TEXT NOT NULL,
    normalized_address TEXT NOT NULL,
    coordinates POINT NOT NULL,
    jurisdiction_id UUID REFERENCES jurisdictions(id),
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_address_input (address_input),
    INDEX idx_coordinates USING GIST (coordinates)
);
```

---

## **🔍 Search & Analytics**

### **search_logs**
```sql
CREATE TABLE search_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NULL, -- NULL for anonymous users
    search_type VARCHAR(50) NOT NULL, -- 'location', 'address'
    search_query TEXT NOT NULL,
    results_found INTEGER NOT NULL,
    selected_office_id UUID REFERENCES permit_offices(id) NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **analytics_events**
```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NULL,
    event_type VARCHAR(100) NOT NULL, -- 'page_view', 'permit_submitted', 'document_generated'
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## **⚙️ Configuration & System**

### **system_config**
```sql
CREATE TABLE system_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(100)
);
```

### **api_keys**
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    permissions TEXT[], -- Array of allowed endpoints
    rate_limit INTEGER DEFAULT 1000, -- Requests per hour
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## **📊 Indexes for Performance**

```sql
-- Geographic indexes (PostGIS)
CREATE INDEX idx_permit_offices_coordinates ON permit_offices USING GIST (coordinates);
CREATE INDEX idx_jurisdictions_boundary ON jurisdictions USING GIST (boundary);

-- Search indexes
CREATE INDEX idx_permit_offices_name ON permit_offices USING GIN (to_tsvector('english', name));
CREATE INDEX idx_permit_offices_city_state ON permit_offices (city, state);
CREATE INDEX idx_jurisdictions_name ON jurisdictions (name, state);

-- User and permit indexes
CREATE INDEX idx_permits_user_id ON permits (user_id);
CREATE INDEX idx_permits_office_id ON permits (permit_office_id);
CREATE INDEX idx_permits_status ON permits (status);
CREATE INDEX idx_permits_created_at ON permits (created_at DESC);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_status ON notifications (status);

-- Analytics indexes
CREATE INDEX idx_search_logs_created_at ON search_logs (created_at DESC);
CREATE INDEX idx_analytics_events_type_created ON analytics_events (event_type, created_at DESC);
```

---

## **🔄 Database Functions & Triggers**

### **Update timestamp trigger**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_permit_offices_updated_at 
    BEFORE UPDATE ON permit_offices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permits_updated_at 
    BEFORE UPDATE ON permits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Permit status change trigger**
```sql
CREATE OR REPLACE FUNCTION log_permit_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO permit_status_history (permit_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, 'system');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER permit_status_change_trigger
    AFTER UPDATE ON permits
    FOR EACH ROW EXECUTE FUNCTION log_permit_status_change();
```

---

## **📦 Initial Data Seeds**

### **Sample permit offices**
```sql
INSERT INTO permit_offices (name, type, address, city, state, zip_code, phone, email, website, coordinates) VALUES
('Walton County Planning & Development', 'county', '126 Court Street, Walton County Annex I', 'Monroe', 'GA', '30655', '(770) 267-1485', 'openrecords@co.walton.ga.us', 'www.waltoncountyga.gov', POINT(-83.7129, 33.7956)),
('Columbus Consolidated Government', 'city', '100 10th Street', 'Columbus', 'GA', '31901', '(706) 225-4126', 'inspections@columbusga.org', 'www.columbusga.gov', POINT(-84.9877, 32.4609));
```

### **Sample services**
```sql
INSERT INTO services (permit_office_id, service_type, description, requirements, processing_days) VALUES
((SELECT id FROM permit_offices WHERE name = 'Walton County Planning & Development'), 'solar', 'Solar PV electrical permits', ARRAY['UL listed equipment', 'Licensed electrician', 'Structural calculations'], 7),
((SELECT id FROM permit_offices WHERE name = 'Columbus Consolidated Government'), 'electrical', 'Electrical permits including solar', ARRAY['Georgia electrical license', 'NEC compliance', 'Equipment specifications'], 10);
```

This schema supports all the core functionality including geographic search, permit tracking, document management, and analytics while maintaining flexibility for future enhancements.