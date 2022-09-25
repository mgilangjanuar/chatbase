import { CommentOutlined, HomeOutlined, InfoCircleOutlined, KeyOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, notification, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { UserProfile } from '../utils/types'

interface Props {
  collapsed?: boolean,
  setCollapsed: (collapsed: boolean) => void,
  user?: UserProfile
}

export default function ({ collapsed, setCollapsed, user }: Props) {
  const navigate = useNavigate()

  return <Layout.Sider
    collapsedWidth={0}
    trigger={null}
    collapsed={collapsed}
    breakpoint="md"
    onBreakpoint={setCollapsed}
    collapsible>
    <a href="/">
      <Space style={{
        height: '32px',
        margin: '15px',
        color: '#fff',
        fontSize: '1.15em',
        fontWeight: 'bold'
      }}>
        <img src="/logo192.png" style={{ width: '30px', height: 'auto' }} />
        <span>ChatBase</span>
      </Space>
    </a>
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[location.pathname]}
      items={[
        {
          key: '/',
          icon: user ? <CommentOutlined /> : <HomeOutlined />,
          label: user ? 'Chats' : 'Home',
          onClick: () => navigate('/')
        },
        ...user ? [
          {
            key: '/profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: () => navigate('/profile')
          },
          {
            key: '/security',
            icon: <KeyOutlined />,
            label: 'Security',
            onClick: () => navigate('/security')
          }
        ] : [],
        {
          key: '/about',
          icon: <InfoCircleOutlined />,
          label: 'About',
          onClick: () => navigate('/about')
        },
        ...user ? [
          {
            key: '99',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: () => notification.info({
              key: 'info-logout',
              message: 'Logout',
              description: 'Are you sure want to logout?',
              btn: <Button icon={<LogoutOutlined />} danger
                onClick={async () => {
                  await supabase.auth.signOut()
                  notification.close('info-logout')
                }}>
                Logout
              </Button>
            }),
          }
        ] : []
      ]}
    />
  </Layout.Sider>
}