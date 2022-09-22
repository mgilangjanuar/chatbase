import { User } from '@supabase/supabase-js'

declare namespace Express {
  export interface Request {
    user?: User | null
  }
}