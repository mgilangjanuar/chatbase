import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { CSSProperties } from 'react'

interface Props {
  collapsed: boolean,
  setCollapsed: (collapsed: boolean) => void,
  style?: CSSProperties
}

export default function ({ collapsed, setCollapsed, style }: Props) {
  return <Button style={{ margin: '8px', ...style || {} }} type="link" icon={
    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={
    () => setCollapsed(!collapsed)} />
}