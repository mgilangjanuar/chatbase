import { ChatMessage, MessageContentType, MessageDirection, MessageStatus, useChat } from '@chatscope/use-chat'
import { notification } from 'antd'
import { supabase } from '../services/supabase'
import { UserProfile } from '../utils/types'

export default function (user?: UserProfile) {

  const { addMessage, activeConversation } = useChat()

  const sendMessage = async (msg: string) => {
    if (!activeConversation) {
      return notification.error({
        message: 'Error',
        description: 'Please select a conversation first'
      })
    }
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        message: msg,
        room_id: activeConversation.id,
      })
    if (error || !data) {
      return notification.error({
        message: error.message,
        description: error.details
      })
    }

    const message = data[0]
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

    await supabase
      .from('chat_rooms')
      .update({ last_message: `${user?.profile.username}: ${msg}` })
      .eq('id', activeConversation.id)
  }

  return { sendMessage }
}