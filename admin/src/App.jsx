import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { api } from './api.js'
import AdminLayout from './layout/AdminLayout.jsx'
import { PageLoading } from './components/AdminUI.jsx'
import Login from './pages/Login.jsx'
import CollectionList from './pages/CollectionList.jsx'
import CollectionEdit from './pages/CollectionEdit.jsx'
import SingletonEdit from './pages/SingletonEdit.jsx'
import Nav from './pages/Nav.jsx'
import Visibility from './pages/Visibility.jsx'
import Leads from './pages/Leads.jsx'
import Settings from './pages/Settings.jsx'

function RequireAuth({ children }) {
  const [state, setState] = useState('loading')
  useEffect(() => {
    api.get('/me').then(() => setState('ok')).catch(() => setState('guest'))
  }, [])
  if (state === 'loading') return <div className="auth-loading"><PageLoading rows={6} /></div>
  if (state === 'guest') return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route index element={<Navigate to="/collections/business" replace />} />
          <Route path="collections/:coll" element={<CollectionList />} />
          <Route path="collections/:coll/new" element={<CollectionEdit />} />
          <Route path="collections/:coll/:id" element={<CollectionEdit />} />
          <Route path="singletons/:key" element={<SingletonEdit />} />
          <Route path="nav" element={<Nav />} />
          <Route path="visibility" element={<Visibility />} />
          <Route path="leads" element={<Leads />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
