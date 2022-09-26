import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Menu, Popover } from 'antd'

interface Props {
  children: any,
  onlyDelete?: boolean,
  onEditClick?: () => void,
  onRemoveClick?: () => void
}

export default function ({ children, onlyDelete, onEditClick, onRemoveClick }: Props) {
  return <Popover children={children} placement="bottom" trigger={['click']} content={<Menu items={[
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
  ]} />} />
}