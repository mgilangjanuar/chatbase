import { useEffect, useState } from 'react'
import { ChatStyles } from '../utils/types'

export default function (sidebarVisible: boolean) {
  const [style, setStyle] = useState<ChatStyles>()

  useEffect(() => {
    if (sidebarVisible) {
      setStyle({
        sidebarStyle: {
          display: 'flex',
          flexBasis: 'auto',
          width: '100%',
          maxWidth: '100%'
        },
        conversationContentStyle: {
          display: 'flex !important',
        },
        conversationAvatarStyle: {
          marginRight: '1em'
        },
        chatContainerStyle: {
          display: 'none'
        },
      })
    } else {
      setStyle({
        sidebarStyle: {},
        conversationContentStyle: {
          display: 'flex !important'
        },
        conversationAvatarStyle: {},
        chatContainerStyle: {}
      })
    }
  }, [sidebarVisible])

  return { style }
}