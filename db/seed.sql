-- Dino Camp Roster - Seed data (4 campers)
-- Run with: psql -U postgres -d dinocamp -f db/seed.sql
-- Run schema.sql first if you haven't already.

INSERT INTO users (name, username, emoji) VALUES
  ('Maya Johnson', 'VelociMaya', '🦕'),
  ('Liam Chen', 'TriceraLiam', '🦖'),
  ('Sofia Ramirez', 'StegoSofia', '🦴'),
  ('Noah Williams', 'RexNoah', '🌋')
ON CONFLICT (username) DO NOTHING;
