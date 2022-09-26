import { useState } from 'react'
import { supabase } from '../services/supabase'

export default function (removeConversation: (id: string, removeMessages: boolean) => void, onFinish?: () => void) {
  const [loading, setLoading] = useState<boolean>(false)

  const remove = async (room: Record<any, any>) => {
    setLoading(true)
    const { error } = await supabase
      .from('chat_rooms')
      .delete()
      .eq('id', room.id)
    if (error) throw error
    window.localStorage.removeItem('activeConversation')
    removeConversation(room.id, true)
    onFinish?.()
    return setLoading(false)
  }

  return { remove, loading }
}