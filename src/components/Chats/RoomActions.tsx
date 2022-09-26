import { DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import { useChat } from '@chatscope/use-chat'
import { Button, Menu, Popover } from 'antd'
import useRemoveRoom from '../../hooks/useRemoveRoom'

interface Props {
  onFinish?: () => void
}

export default function ({ onFinish }: Props) {
  const { removeConversation, activeConversation } = useChat()
  const { remove: removeRoom } = useRemoveRoom(removeConversation, onFinish)

  return <Popover trigger={['click']} content={
    <Menu items={[
      {
        key: 'remove',
        danger: true,
        icon: <DeleteOutlined />,
        onClick: () => removeRoom(activeConversation?.data),
        label: 'Delete'
      }
    ]} />
  } placement="bottomRight">
    <Button icon={<MoreOutlined />} type="link" shape="circle" />
  </Popover>
}