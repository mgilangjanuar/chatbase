import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Layout, Result } from 'antd'

export default function () {
  return <Layout className="main-wrapper" style={{ textAlign: 'center', paddingTop: '40px' }}>
    <Result status={404} title="Drunk?" subTitle="Your destination was not found." extra={
      <Button icon={<ArrowLeftOutlined />} type="primary" shape="round" href="/">Home</Button>} />
  </Layout>
}