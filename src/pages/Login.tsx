import { useEffect } from 'react'
import { supabase } from '../services/supabase'

export default function () {

  useEffect(() => {
    (async () => {
      await supabase.auth.signIn({
        provider: 'google'
      }, {
        redirectTo: process.env.REACT_APP_SUPABASE_REDIRECT_URL
      })
    })()
  }, [])

  return <></>
}