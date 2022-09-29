import { MainContainer } from '@chatscope/chat-ui-kit-react'
import { Layout, Spin, Typography } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import useChatStyles from '../../hooks/useChatStyles'
import useHandleConversationsData from '../../hooks/useHandleConversationsData'
import useSubscription from '../../hooks/useSubscription'
import { supabase } from '../../services/supabase'
import { UserProfile } from '../../utils/types'
import ChatRoom from './ChatRoom'
import Sidebar from './Sidebar'

interface Props {
  toggle: React.FC,
  user?: UserProfile
}

export default function ({ toggle, user }: Props) {
  const { init, payload } = useSubscription()
  const [unreadCount, setUnreadCount] = useState<{[id: string]: number}>()

  const { loadingMessage } = useHandleConversationsData(
    user, payload, unreadCount, setUnreadCount)

  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth < 576)
  const { style } = useChatStyles(sidebarVisible)

  // useEffect(() => {
  //   // document.body.style.overflowY = 'hidden'

  //   const setMaxHeight = () => {
  //     const vh = window.innerHeight
  //     document.documentElement.style.setProperty('--vh', `${vh}px`)
  //     // document.querySelector(':root')?.style.setProperty('--vh', `${vh}px`)
  //   }
  //   setMaxHeight()

  //   window.addEventListener('resize', () => {
  //     setSidebarVisible(window.innerWidth < 576)

  //     setMaxHeight()
  //   })
  //   return () => {
  //     // document.body.style.overflowY = 'auto'
  //   }
  // }, [])

  // useEffect(() => {
  //   function appHeight() {
  //     const doc = document.documentElement
  //     doc.style.setProperty('--vh', window.innerHeight * .01 + 'px')
  //   }

  //   window.addEventListener('resize', appHeight)
  //   appHeight()
  // }, [])

  useEffect(() => {
    init()
    return () => {
      supabase.removeAllSubscriptions()
    }
  }, [])

  return <div className="chat-container-wrapper" style={{ position: 'relative' }}>
    <MainContainer className="main-chat" responsive>
      <Sidebar
        user={user}
        toggle={toggle}
        payload={payload}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
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
  </div>
}
