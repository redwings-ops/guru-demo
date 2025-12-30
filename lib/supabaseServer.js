import { createClient } from '@supabase/supabase-js'

// Use server-only SUPABASE_URL when available. NEXT_PUBLIC_SUPABASE_URL
// is accepted as a fallback to avoid breaking existing setups.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
