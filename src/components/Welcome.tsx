import { GoogleOutlined } from '@ant-design/icons'
import { Button, Layout, Typography } from 'antd'

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
        <Button icon={<GoogleOutlined />} href="/login">Sign in with Google</Button>
      </Typography.Paragraph>
    </Layout>
  )
}