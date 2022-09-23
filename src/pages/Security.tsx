import { DeleteOutlined, LaptopOutlined } from '@ant-design/icons'
import { browserSupportsWebAuthn } from '@simplewebauthn/browser'
import { Button, Col, Divider, Form, Input, Layout, Modal, notification, Popconfirm, Row, Space, Table, Typography } from 'antd'
import DeviceDetector from 'device-detector-js'
import { useEffect, useState } from 'react'
import useWebAuthn from '../hooks/useWebAuthn'
import { supabase } from '../services/supabase'
import { UserProfile } from '../utils/types'

interface Props {
  user?: UserProfile
}

export default function ({ user }: Props) {
  const [authenticators, setAuthenticators] = useState<any[]>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [deviceName, setDeviceName] = useState<string>()

  const { register, loading } = useWebAuthn((_, err) => {
    if (err) {
      return notification.error({
        message: 'Error',
        description: err.message || err
      })
    }
    setModalVisible(false)
    setAuthenticators(undefined)
    return notification.success({
      message: 'Device added successfully!'
    })
  }, user)

  useEffect(() => {
    if (authenticators === undefined) {
      (async () => {
        const { data, error } = await supabase
          .from('chat_authenticators')
          .select('*')
        if (!data || error) {
          return notification.error({
            message: error.message,
            description: error.details
          })
        }
        setAuthenticators(data)
      })()
    }
  }, [authenticators])

  useEffect(() => {
    const { client, os, device } = new DeviceDetector().parse(navigator.userAgent)
    const name = `${device?.type[0].toUpperCase()}${device?.type.slice(1)}: ${os?.name} - ${client?.name}`
    setDeviceName(name)
  }, [])

  return <Layout className="main-wrapper">
    <Typography.Title level={3}>
      Activate MFA
    </Typography.Title>
    <Typography.Paragraph type="secondary">
      Save your trusted devices for your next login.
    </Typography.Paragraph>
    <Divider />

    <Row>
      <Col span={24} md={20}>
        <Typography.Paragraph>
          <Space>
            <Button loading={loading} disabled={!browserSupportsWebAuthn} icon={<LaptopOutlined />} type="primary" onClick={
              () => setModalVisible(true)} shape="round">
                Add Device
            </Button>
            {!browserSupportsWebAuthn && <Typography.Text type="secondary">Your device doesn't support <a href="https://webauthn.me/browser-support" target="_blank">WebAuthn</a>.</Typography.Text>}
          </Space>
        </Typography.Paragraph>

        <Table pagination={false} dataSource={authenticators?.map(a => ({
          ...a,
          key: a.id,
          credentialPublicKey: window.btoa(
            new Uint8Array(
              a.data.credentialPublicKey.data
            ).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        }))} columns={[
          {
            title: 'Device Name',
            dataIndex: 'name',
            key: 'name',
            render: (val: string, record: any) => <Space direction="vertical">
              <span>{val}</span>
              <Popconfirm title="Are you sure?" onConfirm={async () => {
                const { error } = await supabase
                  .from('chat_authenticators')
                  .delete()
                  .eq('id', record.id)
                if (error) {
                  return notification.error({
                    message: error.message,
                    description: error.details
                  })
                }
                setAuthenticators(authenticators?.filter(a => a.id !== record.id))
              }}>
                <Button danger icon={<DeleteOutlined />} shape="circle" />
              </Popconfirm>
            </Space>
          },
          {
            title: 'ID',
            dataIndex: 'credential_id',
            key: 'credential_id',
            render: val => <span style={{ overflowWrap: 'anywhere' }}>{val}</span>
          },
          {
            title: 'Public Key',
            dataIndex: 'credentialPublicKey',
            key: 'credentialPublicKey',
            render: val => <>
              <span>-----BEGIN PUBLIC KEY-----</span><br />
              <span style={{ overflowWrap: 'anywhere' }}>{val}</span><br />
              <span>-----END PUBLIC KEY-----</span>
            </>
          }
        ]} />
      </Col>
    </Row>

    <Modal
      title="Add A New Authenticator"
      open={modalVisible}
      okButtonProps={{ shape: 'round', loading }}
      cancelButtonProps={{ shape: 'round' }}
      onCancel={() => setModalVisible(false)} onOk={() => register(deviceName)}>
      <Form layout="vertical" onFinish={() => register(deviceName)}>
        <Form.Item label="Device Name" required rules={[{ required: true, message: 'Please input device name' }]}>
          <Input value={deviceName} onChange={e => setDeviceName(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  </Layout>
}