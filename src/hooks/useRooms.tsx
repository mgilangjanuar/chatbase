import { notification } from 'antd'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function () {
  const [rooms, setRooms] = useState<Record<string, any>[] | undefined>(undefined)
  const [users, setUsers] = useState<Record<string, any>[] | undefined>(undefined)

  useEffect(() => {
    if (rooms === undefined) {
      (async () => {
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('*')
        if (!data || error) {
          notification.error({
            message: error.message,
            description: error.details
          })
        } else {
          setRooms(data)

          const { data: dataUsers, error: errorUsers } = await supabase
            .from('chat_profiles')
            .select('*')
            .in('id', data.reduce((res: any[], room: any) => [...res, ...room.participants], []))
          if (!dataUsers || errorUsers) {
            notification.error({
              message: errorUsers.message,
              description: errorUsers.details
            })
          } else {
            setUsers(dataUsers)
          }
        }
      })()
    }
  }, [rooms])

  return { rooms, users }
}