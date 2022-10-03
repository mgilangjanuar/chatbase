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
import { Button, Input, Space, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import useSendMessage from '../../hooks/useSendMessage'
import { DELETED_MESSAGE_TEXT } from '../../utils/constant'
import { ChatStyles, UserProfile } from '../../utils/types'
import MessageActions from './MessageActions'
import RoomActions from './RoomActions'

interface Props {
  user?: UserProfile,
  style?: ChatStyles,
  sidebarVisible: boolean,
  setSidebarVisible: (visible: boolean) => void
}

export default function ({ user, style, sidebarVisible, setSidebarVisible }: Props) {
  const [messageInput, setMessageInput] = useState<string>()
  const [updateMessageData, setUpdateMessageData] = useState<ChatMessage<MessageContentType.TextPlain>>()

  const { sendMessage, updateMessage, uploadFile, downloadFile } = useSendMessage(user, () => {
    setMessageInput('')
    setUpdateMessageData(undefined)
  })
  const { getUser, activeConversation, currentMessages } = useChat()
  const ref = useRef<any>()

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [ref.current])

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
          <RoomActions onFinish={() => setSidebarVisible(window.innerWidth < 576)} />
        </ConversationHeader.Actions>
      </ConversationHeader>}

      <MessageList typingIndicator={null}>
        {activeConversation && currentMessages.map((g) => <MessageGroup key={g.id} direction={g.direction}>
          {window.innerWidth > 576 && <Avatar src={getUser(g.senderId)?.avatar} />}
          <MessageGroup.Messages>
            {g.messages.map((m: ChatMessage<MessageContentType>) => {
              if (m.content.content === DELETED_MESSAGE_TEXT) {
                return <Message key={m.id} model={{
                  type: 'custom',
                  direction: m.direction,
                  position: 'normal'
                }}>
                  <Message.CustomContent>
                    <Typography.Text italic type="secondary">
                      This message has been removed
                    </Typography.Text>
                  </Message.CustomContent>
                </Message>
              }
              if (m.contentType === MessageContentType.TextPlain) {
                return <Message key={m.id} model={{
                  type: 'custom',
                  direction: m.direction,
                  position: 'normal'
                }}>
                  <Message.CustomContent>
                    <MessageActions
                      content={m.content.content as string}
                      createdTime={m.createdTime}
                      direction={m.direction}
                      onEditClick={() => {
                        setMessageInput((m.content as TextContent).content.replace(/^edited\:\ /, ''))
                        setUpdateMessageData(m)
                      }}
                      onRemoveClick={() => {
                        updateMessage(m, DELETED_MESSAGE_TEXT)
                      }}>
                      {(m.content as TextContent).content.startsWith('edited: ') ? <Typography.Text>
                        <Typography.Text type="secondary" italic>edited: </Typography.Text>
                        <span dangerouslySetInnerHTML={{ __html: (m.content as TextContent).content.replace('edited: ', '') }} />
                      </Typography.Text> : <span dangerouslySetInnerHTML={{ __html: m.content.content as string }} />}
                    </MessageActions>
                  </Message.CustomContent>
                </Message>
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
                  direction: m.direction,
                  position: 'normal'
                }}>
                  <Message.CustomContent>
                    <Space>
                      <Button type="primary" onClick={async () => await downloadFile((m.content as any).content)} shape="circle" icon={<CloudDownloadOutlined />} />
                      <MessageActions onlyDelete
                        createdTime={m.createdTime}
                        direction={m.direction}
                        onEditClick={() => {
                          setMessageInput((m.content as TextContent).content.replace(/^edited\:\ /, ''))
                          setUpdateMessageData(m)
                        }}
                        onRemoveClick={() => {
                          updateMessage(m, DELETED_MESSAGE_TEXT)
                        }}>
                        {caption}
                      </MessageActions>
                    </Space>
                  </Message.CustomContent>
                </Message>
              }
            })}
          </MessageGroup.Messages>
        </MessageGroup>)}
      </MessageList>

      {activeConversation && <MessageInput placeholder="Type message here" value={messageInput} onChange={setMessageInput}
        onSend={updateMessageData ? (value: string) => updateMessage(updateMessageData, `edited: ${value}`) : sendMessage} onAttachClick={() => ref.current?.input.click()} />}
    </ChatContainer>
    {activeConversation && <Input ref={ref} type="file" style={{ display: 'none' }} onChange={e => uploadFile(e.target.files)} />}
  </>
}