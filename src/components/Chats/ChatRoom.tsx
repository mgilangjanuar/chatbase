import {
  Avatar,
  ChatContainer,
  ConversationHeader, Message,
  MessageGroup,
  MessageInput,
  MessageList
} from '@chatscope/chat-ui-kit-react'
import { ChatMessage, MessageContentType, TextContent, useChat } from '@chatscope/use-chat'
import moment from 'moment'
import useSendMessage from '../../hooks/useSendMessage'
import { ChatStyles, UserProfile } from '../../utils/types'

interface Props {
  user?: UserProfile,
  style?: ChatStyles,
  sidebarVisible: boolean,
  setSidebarVisible: (visible: boolean) => void
}

export default function ({ user, style, sidebarVisible, setSidebarVisible }: Props) {
  const { sendMessage } = useSendMessage(user)
  const { getUser, activeConversation, currentMessages } = useChat()

  const opponent = getUser(activeConversation?.participants.find(p => p.id !== user?.id)?.id || '')
  const isPersonal = activeConversation?.data.type === 'personal'
  const name = isPersonal ? opponent?.firstName : activeConversation?.data.title || 'Unknown'

  return <ChatContainer style={style?.chatContainerStyle || {}}>

    {activeConversation && <ConversationHeader>
      <ConversationHeader.Back onClick={() => setSidebarVisible(!sidebarVisible)} />
      <Avatar src={isPersonal ? opponent?.avatar : activeConversation?.data.img_url} name={name} />
      <ConversationHeader.Content userName={name} info={opponent?.username} />
      <ConversationHeader.Actions>
      </ConversationHeader.Actions>
    </ConversationHeader>}

    <MessageList typingIndicator={null}>
      {activeConversation && currentMessages.map((g) => <MessageGroup key={g.id} direction={g.direction}>
        <Avatar src={getUser(g.senderId)?.avatar} />
        <MessageGroup.Messages>
          {g.messages.map((m: ChatMessage<MessageContentType>) => <Message key={m.id} model={{
            message: (m.content as TextContent).content,
            direction: m.direction,
            position: 'normal'
          }} />)}
        </MessageGroup.Messages>
        <MessageGroup.Footer>{moment(g.messages[g.messages.length - 1].createdTime).fromNow()}</MessageGroup.Footer>
      </MessageGroup>)}
    </MessageList>

    {activeConversation && <MessageInput placeholder="Type message here"
      onSend={sendMessage} />}

  </ChatContainer>
}