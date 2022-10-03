import { DeleteOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons'
import { MessageDirection } from '@chatscope/use-chat'
import { Menu, message, Popover } from 'antd'
import clipboard from 'clipboardy'
import moment from 'moment'
import { useState } from 'react'

interface Props {
  children: any,
  direction: MessageDirection,
  onlyDelete?: boolean,
  content?: string,
  createdTime: Date,
  onEditClick?: () => void,
  onRemoveClick?: () => void
}

export default function ({ children, direction, onlyDelete, content, createdTime, onEditClick, onRemoveClick }: Props) {
  const [visible, setVisible] = useState<boolean>()

  return direction === MessageDirection.Outgoing ? <Popover open={visible}
    onOpenChange={setVisible}
    children={children}
    placement="bottomRight"
    trigger="click"
    content={
      <Menu style={{ margin: '-12px -16px' }} items={[
        {
          key: 'info',
          label: moment(createdTime).format('lll'),
          disabled: true,
          style: { margin: '0' }
        },
        ...!onlyDelete ? [
          {
            key: 'copy',
            label: 'Copy',
            icon: <CopyOutlined />,
            style: { margin: '0' },
            onClick: () => {
              clipboard.write(content as string)
              message.info('Copied to clipboard!')
              setVisible(false)
            }
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            style: { margin: '0' },
            onClick: () => {
              onEditClick?.()
              setVisible(false)
            }
          }
        ] : [],
        {
          key: 'remove',
          label: 'Remove',
          icon: <DeleteOutlined />,
          style: { margin: '0' },
          danger: true,
          onClick: () => {
            onRemoveClick?.()
            setVisible(false)
          }
        }
      ]} />} /> : <Popover open={visible}
    onOpenChange={setVisible}
    children={children}
    placement="bottomLeft"
    trigger="click"
    content={
      <Menu style={{ margin: '-12px -16px' }} items={[
        {
          key: 'info',
          label: moment(createdTime).format('lll'),
          disabled: true,
          style: { margin: '0' }
        }
      ]} />} />
}