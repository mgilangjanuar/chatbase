import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import SidebarToggle from '../components/SidebarToggle'
import Sider from '../components/Sider'
import useUser from '../hooks/useUser'
import { supabase } from '../services/supabase'
import About from './About'
import Home from './Home'
import Login from './Login'
import NotFound from './NotFound'
import Profile from './Profile'
import Redirect from './Redirect'
import Security from './Security'

export default function () {
  const { user, loading } = useUser()
  const [collapsed, setCollapsed] = useState<boolean>()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') {
      supabase.removeAllSubscriptions()
    }
  }, [location.pathname])

  const Toggle = () => <SidebarToggle collapsed={!!collapsed} setCollapsed={setCollapsed} />

  const HeaderToggle = () => !user || [
    '/about', '/profile', '/security'
  ].includes(location.pathname.toLowerCase()) ? <Layout.Header className="App-header">
      <Toggle />
    </Layout.Header> : <></>

  return <>
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
          {user && <Route path="/security" element={<Security user={user} />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout.Content>
    </Layout>
  </>
}