import { notification } from 'antd'
import { useState } from 'react'
import { supabase } from '../services/supabase'

export default function () {
  const [messages, setMessages] = useState<Record<string, any>[] | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchMessages = async (roomId: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
    if (!data || error) {
      notification.error({
        message: error.message,
        description: error.details
      })
    } else {
      setMessages(data)
    }
    setLoading(false)
  }

  return { fetchMessages, messages, loading }
}