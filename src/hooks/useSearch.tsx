import { notification } from 'antd'
import { useState } from 'react'
import { supabase } from '../services/supabase'

export default function useUserSearch() {
  const [loading, setLoading] = useState<boolean>(false)
  const [users, setUsers] = useState<Record<string, any>[] | null>(null)
  const [messages, setMessages] = useState<Record<string, any>[] | null>(null)

  const search = async (search: string) => {
    setLoading(true)
    const searchUsers = async () => {
      const { data, error } = await supabase
        .from('chat_profiles')
        .select()
        .ilike('username', `%${search}%`)
        .not('id', 'eq', supabase.auth.user()?.id)
        .limit(5)
      if (!data || error) {
        notification.error({
          message: error.message,
          description: error.details
        })
      } else {
        setUsers(data)
      }
    }
    const searchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          chat_rooms (*),
          chat_profiles (*)
        `)
        .ilike('message', `%${search}%`)
        .limit(15)
      if (!data || error) {
        notification.error({
          message: error.message,
          description: error.details
        })
      } else {
        setMessages(data)
      }
    }

    await Promise.all([searchUsers(), searchMessages()])
    setLoading(false)
  }

  return { users, setUsers, messages, setMessages, loading, search }
}