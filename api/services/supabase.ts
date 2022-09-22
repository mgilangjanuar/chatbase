import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SECRET as string
export const supabase = createClient(supabaseUrl, supabaseKey)