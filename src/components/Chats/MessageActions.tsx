import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { MessageDirection } from '@chatscope/use-chat'
import { Menu, Popover } from 'antd'

interface Props {
  children: any,
  direction: MessageDirection,
  onlyDelete?: boolean,
  onEditClick?: () => void,
  onRemoveClick?: () => void
}

export default function ({ children, direction, onlyDelete, onEditClick, onRemoveClick }: Props) {
  return direction === MessageDirection.Outgoing ? <Popover children={children} placement="left" trigger={['click']} content={<Menu items={[
    ...!onlyDelete ? [{
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: onEditClick
    }] : [],
    {
      key: 'remove',
      label: 'Remove',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: onRemoveClick
    }
  ]} />} /> : children
}