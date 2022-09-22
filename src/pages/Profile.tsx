import { Avatar, Button, Col, Divider, Form, Input, Layout, notification, Popconfirm, Row, Space, Typography } from 'antd'
import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { UserProfile } from '../utils/types'

interface Props {
  user?: UserProfile
}

export default function Profile({ user }: Props) {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(user?.profile)
  })

  const update = async () => {
    const values = form.getFieldsValue()
    try {
      await supabase.from('chat_profiles').update(values).eq('id', user?.id)
      notification.success({ message: 'Updated' })
    } catch (error: any) {
      notification.error({
        message: error.message,
        description: error.details
      })
    }
  }

  const remove = async () => {
    try {
      // await supabase.from('chat_messages').update({ profile_id: null }).eq('profile_id', user?.id)
      // await supabase.from('chat_rooms').delete().eq('admin_id', user?.id)
      const { error } = await supabase.from('chat_profiles').update({
        deleted_at: new Date().toISOString(),
        name: '[DELETED USER]'
      }).eq('id', user?.id)
      if (error) throw error

      notification.success({ message: 'User removed!' })

      const { error: errLogout } = await supabase.auth.signOut()
      if (errLogout) throw errLogout

      window.location.replace('/')
    } catch (error: any) {
      notification.error({
        message: error.message,
        description: error.details
      })
    }
  }

  return <Layout className="main-wrapper">
    <Typography.Title level={3}>
      Howdy, {user?.profile.name}!
    </Typography.Title>
    <Typography.Paragraph type="secondary">
      You can update your profile data here.
    </Typography.Paragraph>
    <Divider />
    <Form form={form} onFinish={update} layout="vertical">
      <Row gutter={32} align="middle">
        <Col span={24} sm={8} md={6} lg={6}>
          <Popconfirm placement="bottom" showCancel={false} onConfirm={update} okButtonProps={{
            shape: 'round', size: 'middle' }} okText="Update" title={<>
            <Typography.Paragraph strong>
              Change Avatar URL
            </Typography.Paragraph>
            <Form.Item name="img_url" required rules={[
              { required: true, message: 'Please input your image URL' }]}>
              <Input />
            </Form.Item>
          </>} >
            <Typography.Paragraph style={{ marginBottom: '32px', textAlign: 'center' }}>
              {user?.profile.img_url && <Avatar src={user?.profile.img_url} style={{ width: '128px', height: 'auto', border: 'solid #000 .1px' }} />}
            </Typography.Paragraph>
          </Popconfirm>
        </Col>
        <Col span={24} sm={16} md={12} lg={9}>
          {/* <Form.Item label="UID" name="id">
            <Input disabled />
          </Form.Item> */}
          <Form.Item label="Name" name="name" required rules={[
            { required: true, message: 'Please input your name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="username" required rules={[
            { required: true, message: 'Please input your username' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Popconfirm title="Are you sure to delete your profile?" onConfirm={remove}>
                <Button danger shape="round">Delete User</Button>
              </Popconfirm>
              <Button shape="round" type="primary" htmlType="submit">Update</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Layout>
}