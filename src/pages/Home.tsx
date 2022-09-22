import { Layout, Spin, Typography } from 'antd'
import Provider from '../components/Chats/Provider'
import Welcome from '../components/Welcome'
import { UserProfile } from '../utils/types'

interface Props {
  user?: UserProfile,
  loading: boolean,
  toggle: React.FC
}

export default function ({ user, toggle, loading }: Props) {
  if (user) {
    return <Provider toggle={toggle} user={user} />
  }

  return loading ? <Layout className="main-wrapper" style={{ textAlign: 'center', paddingTop: '200px' }}>
    <Typography.Paragraph>
      <Spin spinning /> &nbsp; Please wait...
    </Typography.Paragraph>
  </Layout> : <Welcome />
}