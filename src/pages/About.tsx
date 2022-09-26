import { GithubOutlined } from '@ant-design/icons'
import { Col, Divider, Layout, Row, Typography } from 'antd'

export default function () {
  return <Layout className="main-wrapper">
    <Typography.Title level={2}>
      ChatBase <Typography.Text type="secondary">Exp Variant</Typography.Text>
    </Typography.Title>
    <Divider />
    <Row gutter={32} align="top">
      <Col span={24} lg={10}>
        <Typography.Paragraph>
          <div className="video-container">
            <iframe src="https://www.youtube.com/embed/Hglg9viFiOY" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </Typography.Paragraph>
      </Col>
      <Col span={24} lg={14}>
        <Typography.Paragraph>
          <strong>ChatBase</strong> is full of experimental web-based chat application under the Appledore
          Development by <a target="_blank" href="https://twitter.com/mgilangjanuar">@mgilangjanuar</a>.
          We can't ensure your messages and other data are safe and secure. We are also not responsible
          for any data loss or any other bugs that may occur on this application.
        </Typography.Paragraph>
        <Typography.Paragraph>
          This project is open-source and licensed under the MIT License. You can find the source code
          here: <a target="_blank" href="https://github.com/mgilangjanuar/chatbase">
            <GithubOutlined /> github.com/mgilangjanuar/chatbase</a>.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Points of interest in this project are:
        </Typography.Paragraph>
        <Typography.Paragraph>
          <ul>
            <li>
              <strong>Real-Time Chat</strong>
              <p>
                This project uses <a target="_blank" href="https://supabase.com/docs/guides/realtime">
                  Supabase Realtime</a> to listen to all changes in the database as the main feature
                of this project. So, if there are any new incoming messages, each participant in the
                conversation room will be noticed immediately.
              </p>
            </li>
            <li>
              <strong>Row-Level Security</strong>
              <p>
                The project uses <a target="_blank" href="https://supabase.com/docs/guides/auth/row-level-security">
                  row-level security</a> to ensure that each user can only access their own data that
                already productize by <a target="_blank" href="https://supabase.com/docs/guides/database">
                  Supabase Database</a>.
              </p>
            </li>
            <li>
              <strong>WebAuthn</strong>
              <p>
                This also has to experiment <a target="_blank" href="https://webauthn.io/">
                  WebAuthn</a> as the multi-factor authentication method from the trusted
                device. So, users can authenticate themselves with their own devices by
                password, biometric fingerprint, face ID, and other supported devices.
              </p>
            </li>
          </ul>
        </Typography.Paragraph>
      </Col>
    </Row>
  </Layout>
}