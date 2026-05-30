-- Lesson progress tracking for authenticated users.
-- Run this in the Supabase SQL editor once per project.

CREATE TABLE lesson_progress (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id   TEXT        NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own"   ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own" ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_own" ON lesson_progress FOR DELETE USING (auth.uid() = user_id);
