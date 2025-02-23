import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-anon-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.warn('Warning: Using default dummy Supabase configuration. Please set SUPABASE_URL and SUPABASE_KEY in your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 