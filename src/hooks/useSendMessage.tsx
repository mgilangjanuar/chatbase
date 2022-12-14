import { ChatMessage, MessageContentType, MessageDirection, MessageStatus, useChat } from '@chatscope/use-chat'
import { notification } from 'antd'
import { supabase, supabaseDownload, supabaseUpload } from '../services/supabase'
import { UserProfile } from '../utils/types'

export default function (user?: UserProfile, onFinish?: () => void) {
  const { addMessage, activeConversation, updateMessage: updateMessageData } = useChat()

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
        message: msg.trim(),
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
      .update({
        last_message: `${user?.profile.username}: ${msg}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', activeConversation.id)
    onFinish?.()
  }

  const updateMessage = async (msg: ChatMessage<MessageContentType.TextPlain>, message: string) => {
    const { error } = await supabase
      .from('chat_messages')
      .update({ message: message.trim() })
      .eq('id', msg.id)
    if (error) {
      return notification.error({
        message: error.message,
        description: error.details
      })
    }
    msg.content.content = message.trim()
    updateMessageData(msg)
    onFinish?.()
  }

  const uploadFile = async (files: FileList | null) => {
    if (!activeConversation) {
      return notification.error({
        message: 'Error',
        description: 'Please select a conversation first'
      })
    }

    const file = files?.[0]
    if (!file) {
      return notification.error({
        message: 'Error',
        description: 'Please select a file first'
      })
    }

    const key = `chat-attachments/${activeConversation?.id}/${new Date().getTime()}_${file.name}`
    await supabaseUpload(key, file, progress => {
      notification.info({
        key: key,
        message: `Uploading: ${file.name}...`,
        description: `${(progress * 100).toFixed(2)}%`
      })
    })
    notification.close(key)
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        type: 'file',
        message: key.replace('chat-attachments/', ''),
        room_id: activeConversation.id,
      })
    if (error || !data) {
      return notification.error({
        message: error.message,
        description: error.details
      })
    }

    const message = data[0]
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

    await supabase
      .from('chat_rooms')
      .update({
        last_message: `${user?.profile.username}: File`,
        updated_at: new Date().toISOString()
      })
      .eq('id', activeConversation.id)
    onFinish?.()
  }

  const downloadFile = async (key: string) => {
    const { data } = await supabaseDownload(`chat-attachments/${key}`, progress => {
      notification.info({
        key: key,
        message: `Downloading: ${key.replace(/^.*[\\\/]/, '').slice(14)}...`,
        description: `${(progress * 100).toFixed(2)}%`
      })
    })
    notification.close(key)
    onFinish?.()
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', key.replace(/^.*[\\\/]/, '').slice(14))
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return { sendMessage, updateMessage, uploadFile, downloadFile }
}