import { MainContainer } from '@chatscope/chat-ui-kit-react'
import { Layout, Spin, Typography } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import useChatStyles from '../../hooks/useChatStyles'
import useHandleConversationsData from '../../hooks/useHandleConversationsData'
import useSubscription from '../../hooks/useSubscription'
import { UserProfile } from '../../utils/types'
import ChatRoom from './ChatRoom'
import Sidebar from './Sidebar'

interface Props {
  toggle: React.FC,
  user?: UserProfile
}

export default function ({ toggle, user }: Props) {
  const { init, payload } = useSubscription()
  const { loadingMessage } = useHandleConversationsData(user, payload)

  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth < 576)
  const { style } = useChatStyles(sidebarVisible)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setSidebarVisible(window.innerWidth < 576)
    })
  }, [])

  useEffect(init, [])

  return <MainContainer style={{ height: '100vh' }} responsive>
    <Sidebar
      user={user}
      toggle={toggle}
      payload={payload}
      handleConversationClick={useCallback(() => {
        if (sidebarVisible) {
          setSidebarVisible(false)
        }
      }, [sidebarVisible])}
      style={style} />

    {loadingMessage ? <Layout className="main-wrapper" style={{ textAlign: 'center', paddingTop: '200px' }}>
      <Typography.Paragraph>
        <Spin spinning />
      </Typography.Paragraph>
    </Layout> : <ChatRoom user={user} style={style} sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} />}
  </MainContainer>
}