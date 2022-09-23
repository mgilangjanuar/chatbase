import axios from 'axios'
import { supabase } from '../services/supabase'

export const req = () => axios.create({
  baseURL: '/api/v1',
  headers: {
    authorization: `Bearer ${supabase.auth.session()?.access_token}`
  }
})