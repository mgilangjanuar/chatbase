import { Avatar, Conversation, ConversationList, Search, Sidebar } from '@chatscope/chat-ui-kit-react'
import { Conversation as CoversationUChat, useChat } from '@chatscope/use-chat'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import useCreateOrSelectRoom from '../../hooks/useCreateOrSelectRoom'
import useSearch from '../../hooks/useSearch'
import { ChatStyles, UserProfile } from '../../utils/types'
import ResultMessages from './ResultMessages'
import ResultUsers from './ResultUsers'

interface Props {
  toggle: React.FC<any>,
  user?: UserProfile,
  payload?: SupabaseRealtimePayload<any>,
  unreadCount?: { [id: string]: number },
  setUnreadCount: (unreadCount: any) => void,
  handleConversationClick: () => void,
  style?: ChatStyles
}

export default function ({
  toggle: Toggle,
  user,
  payload,
  unreadCount,
  setUnreadCount,
  handleConversationClick,
  style
}: Props) {

  const [searchInput, setSearchInput] = useState<string>()
  const [roomUpdated, setRoomUpdated] = useState<Record<string, any>>()
  const [searchValue] = useDebounce(searchInput, 1000)
  const { search, users, setUsers, messages, setMessages } = useSearch()

  const {
    conversations,
    getUser,
    activeConversation,
    setActiveConversation
  } = useChat()

  useEffect(() => {
    if (searchValue) {
      search(searchValue)
    } else {
      setUsers(null)
      setMessages(null)
    }
  }, [searchValue])

  useEffect(() => {
    if (payload?.table === 'chat_rooms' && payload?.eventType === 'UPDATE') {
      setRoomUpdated(payload.new)
    } else if (payload?.table === 'chat_messages' && payload?.eventType === 'INSERT') {
      if (payload.new.profile_id !== user?.id) {
        setUnreadCount(prev => ({
          ...prev,
          [payload.new.room_id]: (prev?.[payload.new.room_id] || 0) + 1
        }))
      }
    }
  }, [payload])

  useEffect(() => {
    if (activeConversation) {
      setUnreadCount(prev => ({
        ...prev,
        [activeConversation.id]: 0
      }))
    }
  }, [activeConversation])

  const setConversation = (conversation: CoversationUChat | string) => {
    setActiveConversation(typeof conversation === 'string' ? conversation : conversation.id)
    handleConversationClick()
  }

  const { createOrSelectRoomByUser, selectRoomByMessage } = useCreateOrSelectRoom({ user, setConversation })

  return <Sidebar position="left" scrollable style={style?.sidebarStyle || {}}>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Toggle style={{ margin: '17px 0 17px 18px' }} />
      <Search style={{ flexGrow: 1, marginRight: '23px' }} placeholder="Search..." onChange={setSearchInput} onClearClick={() => setSearchInput(undefined)} />
    </div>

    {users === null && messages === null ? <ConversationList>
      {conversations.map(c => {
        const [avatar, content] = (() => {
          if (c.data.type === 'personal') {
            const description = (
              roomUpdated?.id === c.id ? roomUpdated.last_message : c.description
            ).replace(new RegExp(`^${user?.profile.username}:`), 'me:')
            const participant = c.participants.length > 0 ? c.participants.find(p => p.id !== user?.id) : undefined
            if (participant) {
              const user = getUser(participant.id)
              if (user) {
                return [
                  <Avatar src={user.avatar} style={style?.conversationAvatarStyle || {}} />,
                  <Conversation.Content name={user.firstName} lastSenderName={null} info={description} style={style?.conversationContentStyle || {}} />
                ]
              }
            }
          } else {
            const description = (
              roomUpdated?.id === c.id ? roomUpdated.last_message.replace(new RegExp(`^${user?.profile.username}:`), 'me:') : c.description
            ).replace(new RegExp(`^${user?.profile.username}:`), 'me:')
            return [
              <Avatar src={c.data.img_url} style={style?.conversationAvatarStyle || {}} />,
              <Conversation.Content name={c.data.title || 'Unknown'} lastSenderName={null} info={description} style={style?.conversationContentStyle || {}} />
            ]
          }
          return [undefined, undefined]
        })()

        return <Conversation key={c.id}
          name={content}
          info={c.draft ? `Draft: ${c.draft.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ')}` : ''}
          active={activeConversation?.id === c.id}
          unreadCnt={unreadCount?.[c.id]}
          onClick={() => setConversation(c)}>
          {avatar}
        </Conversation>
      })}
    </ConversationList> : <>
      {users !== null && <ResultUsers users={users} style={style} onClick={createOrSelectRoomByUser} />}
      {messages !== null && <ResultMessages messages={messages} style={style} onClick={selectRoomByMessage} />}
    </>}


  </Sidebar>
}