import { User } from '@supabase/supabase-js'
import { Request } from 'express'
import { supabase } from '../services/supabase'

export async function authorize(req: Request) {
  const { authorization } = req.headers
  const { data, error } = await supabase.auth.api.getUser((authorization as string).replace(/^bearer\ /gi, ''))
  if (error) {
    throw error
  }
  if (!data) {
    throw { error: 'Unauthorized' }
  }
  return data as User
}