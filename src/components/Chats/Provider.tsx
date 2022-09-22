import { AutoDraft, BasicStorage, ChatProvider, IStorage, UpdateState } from '@chatscope/use-chat'
import { nanoid } from 'nanoid'
import { ChatService } from '../../service/ChatService'
import '../../styles.min.css'
import { UserProfile } from '../../utils/types'
import Main from './Main'

interface Props {
  toggle: React.FC,
  user?: UserProfile
}

export default function ({ toggle, user }: Props) {
  const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ChatService(storage, updateState)
  }

  const chatStorage = new BasicStorage({
    groupIdGenerator: () => nanoid(),
    messageIdGenerator: () => nanoid()
  })

  return <ChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={{
    typingThrottleTime: 250,
    typingDebounceTime: 900,
    debounceTyping: true,
    autoDraft: AutoDraft.Save | AutoDraft.Restore
  }}>
    <Main toggle={toggle} user={user} />
  </ChatProvider>
}