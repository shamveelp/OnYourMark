/*
# Create bookmarks table with RLS

1. New Tables
  - `bookmarks`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `url` (text, required)
    - `title` (text, required)
    - `created_at` (timestamp)

2. Security
  - Enable RLS on `bookmarks` table
  - Add policy for users to manage only their own bookmarks
  - Ensure complete data isolation between users

3. Indexes
  - Add index on user_id for faster queries
  - Add index on created_at for ordering
*/

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage only their own bookmarks
CREATE POLICY "Users can manage their own bookmarks"
  ON bookmarks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON bookmarks(created_at DESC);