import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL as string
const supabaseKey: string = process.env.REACT_APP_SUPABASE_PUBLIC_KEY as string
export const supabase = createClient(supabaseUrl, supabaseKey)