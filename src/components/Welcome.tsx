import { GoogleOutlined } from '@ant-design/icons'
import { Button, Layout, Typography } from 'antd'
import { supabase } from '../services/supabase'

export default function () {
  return (
    <Layout className="main-wrapper">
      <Typography.Title level={2}>
        Welcome
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        This is a minimal chat app built with Supabase and React.
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Button icon={<GoogleOutlined />} onClick={async () => {
          await supabase.auth.signIn({
            provider: 'google'
          }, {
            redirectTo: process.env.REACT_APP_SUPABASE_REDIRECT_URL
          })
        }}>Sign in with Google</Button>
      </Typography.Paragraph>
    </Layout>
  )
}