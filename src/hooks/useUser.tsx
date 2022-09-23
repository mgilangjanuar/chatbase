import { notification } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { UserProfile } from '../utils/types'
import useWebAuthn from './useWebAuthn'

export default function () {
  const [user, setUser] = useState<UserProfile>()
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const { auth: authentication } = useWebAuthn((user, err) => {
    if (err) {
      setUser(undefined)
      return notification.error({
        message: 'Error',
        description: err.message || err
      })
    }
    setUser(user)
    return notification.success({
      message: 'Welcome back!'
    })
  })

  const checkMFA = async (user?: UserProfile) => {
    const credentialId = window.sessionStorage.getItem('credentialId')
    if (credentialId) {
      const { data: auths } = await supabase
        .from('chat_authenticators')
        .select('*')
        .eq('credential_id', credentialId)
      if (auths?.[0]) {
        if (new Date(auths[0].valid_until).getTime() <= new Date().getTime()) {
          return await authentication(user)
        }
        return setUser(user)
      }
    }

    const { data: auths } = await supabase
      .from('chat_authenticators')
      .select('*')
    if (auths?.length) {
      return authentication(user)
    }

    notification.info({
      key: 'mfa-info',
      message: 'Please register a device',
      description: 'For security reasons, please add your device as multi-factor authentication.',
      onClick: () => {
        navigate('/security'),
        notification.close('mfa-info')
      }
    })
    return setUser(user)
  }

  const setupUser = async () => {
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
              // img_url: auth.user_metadata.avatar_url
            })
          if (!data || error) {   // handle server error
            notification.error({
              message: error.message,
              description: error.details
            })
          } else {
            // update state with new user
            await checkMFA({ ...auth, profile: data[0] })
          }
        } else {
          // update state with existing user
          await checkMFA({ ...auth, profile: data[0] })
        }
      }
    } else {
      setUser(undefined)
    }
    setLoading(false)
  }

  return { setupUser, user, loading }
}