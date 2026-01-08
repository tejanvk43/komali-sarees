-- Cloudflare D1 Schema for Komali Sarees

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    dressType TEXT,
    fabric TEXT,
    color TEXT,
    occasion TEXT,
    stock INTEGER DEFAULT 0,
    images TEXT, -- JSON array of URLs
    tags TEXT, -- JSON array of tag names/ids
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT,
    customerName TEXT,
    customerEmail TEXT,
    customerPhone TEXT,
    shippingAddress TEXT,
    customization TEXT,
    items TEXT, -- JSON array of items
    totalAmount REAL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    userId TEXT,
    userName TEXT,
    userEmail TEXT,
    rating INTEGER,
    suggestion TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table (for server-side permission checks)
CREATE TABLE IF NOT EXISTS admins (
    uid TEXT PRIMARY KEY,
    email TEXT
);
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Firebase UID
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
