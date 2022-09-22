import { Button, notification } from 'antd'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { UserProfile } from '../utils/types'

export default function useUser() {
  const [user, setUser] = useState<UserProfile>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      const auth = supabase.auth.user()
      if (auth) {

        // check if user is in the database
        const { data, error } = await supabase
          .from('chat_profiles')
          .select()
          .eq('id', auth.id)
        if (!data || error) {     // handle server error
          notification.error({
            message: error.message,
            description: error.details
          })
        } else {

          // if not, create a new user
          if (!data.length) {
            const { data, error } = await supabase
              .from('chat_profiles')
              .insert({
                name: auth.user_metadata.full_name,
                img_url: auth.user_metadata.avatar_url
              })
            if (!data || error) {   // handle server error
              notification.error({
                message: error.message,
                description: error.details
              })
            } else {
              // update state with new user
              setUser({ ...auth, profile: data[0] })
            }
          } else {
            if (data[0].deleted_at) {   // handle deleted user
              notification.warn({
                message: 'Your account has been deleted',
                description: 'Click the button below to recover your account',
                duration: 0,
                btn: <Button type="primary" onClick={async () => {
                  await supabase.from('chat_profiles').update({
                    name: auth.user_metadata.full_name,
                    deleted_at: null
                  }).eq('id', auth.id)
                  window.location.replace('/')
                }}>Recover</Button>
              })
            } else {
              // update state with existing user
              setUser({ ...auth, profile: data[0] })
            }
          }
        }
      }

      setLoading(false)
    })()
  }, [])

  return { user, loading }
}