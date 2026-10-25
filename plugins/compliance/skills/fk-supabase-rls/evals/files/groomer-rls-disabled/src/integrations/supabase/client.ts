import { createClient } from '@supabase/supabase-js';

// Public values: the URL and anon (publishable) key are meant to be in the browser.
const SUPABASE_URL = 'https://example-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'public-anon-key-placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
