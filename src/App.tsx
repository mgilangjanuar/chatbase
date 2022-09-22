import { Layout } from 'antd'
import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import SidebarToggle from './components/SidebarToggle'
import Sider from './components/Sider'
import useUser from './hooks/useUser'
import About from './pages/About'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Redirect from './pages/Redirect'

function App() {
  const { user, loading } = useUser()
  const [collapsed, setCollapsed] = useState<boolean>()
  const location = useLocation()

  const Toggle = () => <SidebarToggle collapsed={!!collapsed} setCollapsed={setCollapsed} />

  const HeaderToggle = () => !user || [
    '/about', '/profile'
  ].includes(location.pathname.toLowerCase()) ? <Layout.Header className="App-header">
      <Toggle />
    </Layout.Header> : <></>

  return (
    <Layout className="App">
      <Sider collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
      <Layout className="App-layout">
        <HeaderToggle />
        <Layout.Content>
          <Routes>
            <Route path="/" element={<Home toggle={Toggle} user={user} loading={loading} />} />
            <Route path="/about" element={<About />} />
            {!user && <Route path="/login" element={<Login />} />}
            {!user && <Route path="/redirect" element={<Redirect />} />}
            {user && <Route path="/profile" element={<Profile user={user} />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default App
