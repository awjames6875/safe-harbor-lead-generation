import { createClient } from '@supabase/supabase-js';
import config from '../config';

if (!config.supabaseUrl || !config.supabaseKey) {
    console.warn('Supabase URL or Key is missing. Database operations will fail.');
}

const supabase = createClient(config.supabaseUrl || '', config.supabaseKey || '');

export default supabase;
