import { createClient } from '@supabase/supabase-js';

// These variables pull directly from your Vercel Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
