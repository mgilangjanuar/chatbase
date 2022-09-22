import { Avatar, Conversation, ConversationList, MessageSeparator } from '@chatscope/chat-ui-kit-react'
import { ChatStyles } from '../../utils/types'

interface Props {
  users: Record<string, any>[],
  style?: ChatStyles,
  onClick: (user: Record<string, any>) => void
}

export default function ({ users, style, onClick }: Props) {
  return <>
    <MessageSeparator>Users</MessageSeparator>
    <ConversationList>
      {users.map(user => <Conversation key={user.id}
        name={<Conversation.Content name={user.name} info={user.username} style={style?.conversationContentStyle || {}} />}
        onClick={() => onClick(user)}>
        <Avatar src={user.img_url} style={style?.conversationAvatarStyle || {}} />
      </Conversation>)}
    </ConversationList>
  </>
}