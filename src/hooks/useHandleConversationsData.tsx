import { ChatMessage, Conversation, ConversationRole, MessageContentType, MessageDirection, MessageStatus, Participant, Presence, TypingUsersList, useChat, User, UserStatus } from '@chatscope/use-chat'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { notification } from 'antd'
import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { UserProfile } from '../utils/types'
import useMessages from './useMessages'
import useRooms from './useRooms'

export default function (
  user?: UserProfile,
  payload?: SupabaseRealtimePayload<any>,
  unreadCount?: {[id: string]: number},
  setUnreadCount?: (unreadCount: any) => void) {

  const {
    getUser,
    addConversation,
    addUser,
    setCurrentUser,
    addMessage,
    activeConversation,
    currentMessages,
    setActiveConversation
  } = useChat()

  const { rooms, users } = useRooms()

  useEffect(() => {
    if (!activeConversation) {
      const conv = window.localStorage.getItem('activeConversation')
      if (conv) {
        setActiveConversation(conv)
      }
    }
  }, [activeConversation])

  // initiate current user
  useEffect(() => {
    if (user) {
      const u = new User({
        id: user.id,
        presence: new Presence({ status: UserStatus.Available, description: '' }),
        firstName: user.profile.name,
        lastName: user.profile.username,
        username: user.profile.username,
        avatar: user.profile.img_url
      })
      addUser(u)
      setCurrentUser(u)
    }
  }, [user, getUser])

  // initiate rooms and users
  useEffect(() => {
    if (users?.length) {
      users.filter(u => u.id !== user?.id).map(user => {
        addUser(new User({
          id: user.id,
          presence: new Presence({ status: UserStatus.Available, description: '' }),
          firstName: user.name,
          lastName: user.username,
          username: user.username,
          avatar: user.img_url
        }))
      })
    }
    if (rooms?.length) {
      rooms.map(room => {
        addConversation(new Conversation({
          id: room.id,
          participants: room.participants?.map((participant: string) => new Participant({
            id: participant,
            role: new ConversationRole([])
          })),
          unreadCounter: 0,
          typingUsers: new TypingUsersList({ items: [] }),
          draft: '',
          description: room.last_message,
          data: room
        }))
      })
    }
  }, [rooms, users, getUser])


  // preparing hook for loading messages
  const { messages, fetchMessages, loading } = useMessages()

  // fetch messages for active conversation
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id)
    }
  }, [activeConversation])

  // add to chat room after fetchMessages
  useEffect(() => {
    if (activeConversation && messages !== undefined) {
      messages.map(message => {
        if (currentMessages.find(g => g.messages.find(m => m.id === message.id))) return
        if (message.type === 'text') {
          addMessage(new ChatMessage<MessageContentType.TextPlain>({
            id: message.id,
            contentType: MessageContentType.TextPlain,
            status: MessageStatus.DeliveredToDevice,
            senderId: message.profile_id,
            direction: message.profile_id === user?.id ? MessageDirection.Outgoing : MessageDirection.Incoming,
            content: {
              content: message.message
            },
            createdTime: message.created_at
          }), activeConversation.id, false)
        } else if (message.type === 'file') {
          addMessage(new ChatMessage<MessageContentType.Attachment>({
            id: message.id,
            contentType: MessageContentType.Attachment,
            status: MessageStatus.DeliveredToDevice,
            senderId: message.profile_id,
            direction: message.profile_id === user?.id ? MessageDirection.Outgoing : MessageDirection.Incoming,
            content: {
              content: message.message
            },
            createdTime: message.created_at
          }), activeConversation.id, false)
        }
      })
    }
  }, [messages])

  // handle new message from event
  useEffect(() => {
    if (payload?.table === 'chat_messages') {
      if (payload.eventType === 'INSERT') {
        (async () => {
          const message = payload.new
          if (message.profile_id === user?.id) {
            return setUnreadCount?.({ ...unreadCount || {}, [message.room_id]: 0 })
          }

          if (activeConversation && payload.new.room_id === activeConversation?.id) {
            addMessage(new ChatMessage<MessageContentType.TextPlain>({
              id: message.id,
              contentType: MessageContentType.TextPlain,
              status: MessageStatus.DeliveredToDevice,
              senderId: message.profile_id,
              direction: message.profile_id === user?.id ? MessageDirection.Outgoing : MessageDirection.Incoming,
              content: {
                content: message.message
              },
              createdTime: message.created_at
            }), activeConversation.id, false)
          }

          let sender = getUser(message.profile_id)

          // handle if new room created
          if (!sender) {
            const { data } = await supabase
              .from('chat_profiles')
              .select('*')
              .eq('id', message.profile_id)

            if (data?.length) {
              const user = data[0]
              sender = new User({
                id: user.id,
                presence: new Presence({ status: UserStatus.Available, description: '' }),
                firstName: user.name,
                lastName: user.username,
                username: user.username,
                avatar: user.img_url
              })
              addUser(sender)

              const { data: rooms } = await supabase
                .from('chat_rooms')
                .select('*')
                .eq('id', message.room_id)

              if (rooms?.length) {
                const room = rooms[0]
                addConversation(new Conversation({
                  id: room.id,
                  participants: room.participants?.map((participant: string) => new Participant({
                    id: participant,
                    role: new ConversationRole([])
                  })),
                  unreadCounter: 0,
                  typingUsers: new TypingUsersList({ items: [] }),
                  draft: '',
                  description: room.last_message,
                  data: room
                }))
              }
            }
          }

          if (sender) {
            notification.info({
              key: `new:${message.room_id}`,
              message: sender.firstName,
              description: message.message,
              onClick: () => {
                setActiveConversation(message.room_id)
                window.localStorage.setItem('activeConversation', message.room_id)
                notification.close(`new:${message.room_id}`)
              }
            })
          }
        })()
      }
    }
  }, [payload])

  return { loadingMessage: loading }
}