/*
  # Add Favorite Locations Table

  1. New Tables
    - favorite_locations
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - name (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Read their own favorite locations
      - Insert new favorite locations
      - Delete their own favorite locations
*/

CREATE TABLE IF NOT EXISTS favorite_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE favorite_locations ENABLE ROW LEVEL SECURITY;

-- Policies for favorite_locations
CREATE POLICY "Users can view own favorite locations"
  ON favorite_locations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorite locations"
  ON favorite_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite locations"
  ON favorite_locations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);