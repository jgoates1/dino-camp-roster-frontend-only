-- Dino Camp Roster - Users table schema
-- Run with: psql -U postgres -d dinocamp -f db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL
);
