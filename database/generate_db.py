import sqlite3

# Connect to the database (This will create the .db file)
conn = sqlite3.connect('database/healthcare_pricing.db')
cursor = conn.cursor()

# Create the tables based on the schema
cursor.execute("""
CREATE TABLE IF NOT EXISTS Clients (
    client_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    provider_id INTEGER,
    region TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_hash TEXT NOT NULL,
    FOREIGN KEY(provider_id) REFERENCES Providers(provider_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Queries (
    query_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    query_text TEXT NOT NULL,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    results TEXT,
    FOREIGN KEY(client_id) REFERENCES Clients(client_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS ProviderService (
    provider_service_id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    pricing_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    FOREIGN KEY(service_id) REFERENCES Services(service_id),
    FOREIGN KEY(provider_id) REFERENCES Providers(provider_id),
    FOREIGN KEY(pricing_id) REFERENCES Pricing(pricing_id),
    FOREIGN KEY(plan_id) REFERENCES Plans(plan_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Services (
    billing_code INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Providers (
    provider_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    npi TEXT UNIQUE,
    tin TEXT UNIQUE
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS ProviderDetails (
    provider_details_id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER NOT NULL,
    FOREIGN KEY(provider_id) REFERENCES Providers(provider_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Pricing (
    pricing_id INTEGER PRIMARY KEY AUTOINCREMENT,
    negotiated_rate REAL NOT NULL,
    negotiated_type TEXT NOT NULL,
    billing_class TEXT,
    expiration_date DATE
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Plans (
    plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(company_id) REFERENCES Companies(company_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Companies (
    company_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
""")

# Commit changes and close connection
conn.commit()
conn.close()

print("Database created successfully!")
