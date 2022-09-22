import { User } from '@supabase/supabase-js'
import { Layout, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function () {
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    setTimeout(() => {
      console.log(user)
      if (user) {
        window.location.replace('/')
      } else {
        setUser(supabase.auth.user())
      }
    }, 500)
  }, [user])

  return <Layout className="main-wrapper" style={{ textAlign: 'center', paddingTop: '200px' }}>
    <Typography.Paragraph>
      <Spin spinning /> &nbsp; Authorizing...
    </Typography.Paragraph>
  </Layout>
}