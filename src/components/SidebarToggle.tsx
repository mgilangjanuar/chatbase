import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

interface Props {
  collapsed: boolean,
  setCollapsed: (collapsed: boolean) => void
}

export default function ({ collapsed, setCollapsed }: Props) {
  // return React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
  //   className: 'trigger',
  //   onClick: () => setCollapsed(!collapsed),
  // })
  return <Button style={{ margin: '8px' }} type="link" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
}