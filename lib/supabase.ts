import { createClient } from '@supabase/supabase-js';

// NOTE: In a real production build, these would be process.env.NEXT_PUBLIC_SUPABASE_URL
// For this contained environment, we assume they are available or the user will fill them.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);