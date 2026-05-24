-- Cloudflare D1 SQLite Database Schema for purchases
CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    plan TEXT NOT NULL,
    amount INTEGER NOT NULL, -- Transaction amount in cents (USD standard)
    stripe_payment_intent_id TEXT,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
