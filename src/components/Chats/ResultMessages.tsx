import { Avatar, Conversation, ConversationList, MessageSeparator } from '@chatscope/chat-ui-kit-react'
import { ChatStyles } from '../../utils/types'

interface Props {
  messages: Record<string, any>[],
  style?: ChatStyles,
  onClick: (message: Record<string, any>) => void
}

export default function ({ messages, onClick, style }: Props) {
  return <>
    <MessageSeparator>Messages</MessageSeparator>
    <ConversationList>
      {messages.map(message => <Conversation key={message.id}
        name={<Conversation.Content name={message.chat_profiles.name} info={message.message} style={style?.conversationContentStyle || {}} />}
        onClick={() => onClick(message)}>
        <Avatar src={message.chat_profiles.img_url} style={style?.conversationAvatarStyle || {}} />
      </Conversation>)}
    </ConversationList>
  </>
}