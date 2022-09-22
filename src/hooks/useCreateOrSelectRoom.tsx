import { Conversation, ConversationRole, Participant, Presence, TypingUsersList, useChat, User, UserStatus } from '@chatscope/use-chat'
import { notification } from 'antd'
import { supabase } from '../services/supabase'
import { UserProfile } from '../utils/types'

interface Props {
  user?: UserProfile,
  setConversation: (conversation: Conversation | string) => void
}

export default function ({ user, setConversation }: Props) {

  const { addUser, addConversation } = useChat()

  const createOrSelectRoomByUser = async (selectedUser: Record<string, any>) => {
    const { data: dataRoom, error: errorRoom } = await supabase
      .from('chat_rooms')
      .select('*')
      .contains('participants', [user?.id, selectedUser.id])
    if (!dataRoom || errorRoom) {
      return notification.error({
        message: errorRoom.message,
        description: errorRoom.details
      })
    }

    if (dataRoom.length) {
      return setConversation(dataRoom[0].id)
    }

    const { data, error } = await supabase
      .from('chat_rooms')
      .insert({
        participants: [user?.id, selectedUser.id],
      })
    if (error || !data) {
      return notification.error({
        message: error.message,
        description: error.details
      })
    }

    const room = data[0]
    addUser(new User({
      id: selectedUser.id,
      presence: new Presence({ status: UserStatus.Available, description: '' }),
      firstName: selectedUser.name,
      lastName: selectedUser.username,
      username: selectedUser.username,
      avatar: selectedUser.img_url
    }))

    const conv = new Conversation({
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
    })
    addConversation(conv)
    setConversation(conv)
  }

  const selectRoomByMessage = async (selectedMessage: Record<string, any>) => {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', selectedMessage.room_id)
    if (!data || error) {
      return notification.error({
        message: error.message,
        description: error.details
      })
    }

    const room = data[0]
    if (!room) {
      return notification.error({
        message: 'Something error',
        description: 'Room not found'
      })
    }

    const conv = new Conversation({
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
    })
    addConversation(conv)
    setConversation(conv)
  }

  return { createOrSelectRoomByUser, selectRoomByMessage }
}