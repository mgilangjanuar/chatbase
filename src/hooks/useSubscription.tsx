import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function () {
  const [payload, setPayload] = useState<SupabaseRealtimePayload<any>>()

  useEffect(() => {
    const s = supabase
      .from('*')
      .on('*', (payload) => {
        console.log(new Date().getTime(), 'main:*:event', payload)
        setPayload(payload)
      })
      .subscribe(console.log)
    s.onError((reason: string) => console.error(new Date().getTime(), 'main:*:error', reason))
    s.onClose(() => console.error(new Date().getTime(), 'main:*:close'))
    console.log(new Date().getTime(), 'main:*:created', s)
  }, [])

  return { payload }
}