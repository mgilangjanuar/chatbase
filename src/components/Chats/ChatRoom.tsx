import { CloudDownloadOutlined } from '@ant-design/icons'
import {
  Avatar,
  ChatContainer,
  ConversationHeader, Message,
  MessageGroup,
  MessageInput,
  MessageList
} from '@chatscope/chat-ui-kit-react'
import { ChatMessage, MessageContentType, TextContent, useChat } from '@chatscope/use-chat'
import { Button, Input } from 'antd'
import moment from 'moment'
import { useRef } from 'react'
import useSendMessage from '../../hooks/useSendMessage'
import { ChatStyles, UserProfile } from '../../utils/types'

interface Props {
  user?: UserProfile,
  style?: ChatStyles,
  sidebarVisible: boolean,
  setSidebarVisible: (visible: boolean) => void
}

export default function ({ user, style, sidebarVisible, setSidebarVisible }: Props) {
  const { sendMessage, uploadFile, downloadFile } = useSendMessage(user)
  const { getUser, activeConversation, currentMessages } = useChat()
  const ref = useRef<any>()

  const opponent = getUser(activeConversation?.participants.find(p => p.id !== user?.id)?.id || '')
  const isPersonal = activeConversation?.data.type === 'personal'
  const name = isPersonal ? opponent?.firstName : activeConversation?.data.title || 'Unknown'

  return <>
    <ChatContainer style={style?.chatContainerStyle || {}}>

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
            {g.messages.map((m: ChatMessage<MessageContentType>) => {
              if (m.contentType === MessageContentType.TextPlain) {
                return <Message key={m.id} model={{
                  message: (m.content as TextContent).content,
                  direction: m.direction,
                  position: 'normal'
                }} />
              } else if (m.contentType === MessageContentType.Attachment) {
                const text: string = (m.content as any).content.replace(/^.*[\\\/]/, '').slice(14)
                const caption = (() => {
                  if (text.length > 18) {
                    return `${text.slice(0, 6)}...${text.slice(-10)}`
                  }
                  return text
                })()
                return <Message key={m.id} model={{
                  type: 'custom',
                  // message: (m.content as TextContent).content,
                  direction: m.direction,
                  position: 'normal'
                }}>
                  <Message.CustomContent>
                    <Button style={{ background: '#40a9ff', border: 'none', boxShadow: 'none' }} type="primary" onClick={async () => {
                      const url = await downloadFile((m.content as any).content)
                      window.open(url as string, '_blank')
                    }} shape="round" icon={<CloudDownloadOutlined />}>
                      {caption}
                    </Button>
                  </Message.CustomContent>
                  {/* <Message.HtmlContent html={`<Button onclick="downloadFile('${m.content}')">Download</Button>`} /> */}
                </Message>
              }
            })}
          </MessageGroup.Messages>
          <MessageGroup.Footer>{moment(g.messages[g.messages.length - 1].createdTime).fromNow()}</MessageGroup.Footer>
        </MessageGroup>)}
      </MessageList>

      {activeConversation && <MessageInput placeholder="Type message here"
        onSend={sendMessage} onAttachClick={() => ref.current?.input.click()} />}
    </ChatContainer>
    {activeConversation && <Input ref={ref} type="file" style={{ display: 'none' }} onChange={e => uploadFile(e.target.files)} />}
  </>
}