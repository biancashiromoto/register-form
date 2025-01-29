import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nzaonwigydhkqnpyqfsj.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YW9ud2lneWRoa3FucHlxZnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMDg2MjcsImV4cCI6MjA1MzY4NDYyN30.UpxExI98k1MOsjeYuFrF80NKJ6QGkGxcYr9uEyuPK_4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
