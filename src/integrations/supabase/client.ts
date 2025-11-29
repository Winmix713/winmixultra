import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Safely access environment variables
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL || '';
const NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (env.MODE !== 'test') {
    console.warn('Missing Supabase environment variables. Please check your .env file.');
  }
}
export const supabase = createClient<Database>(NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key', {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true
  }
});