import { createClient } from '@supabase/supabase-js';

// Admin client so the salon owner can see every customer on the admin page.
export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
);
