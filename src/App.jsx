// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Men from './pages/Men'
import Women from './pages/Women'
import Handcrafted from './pages/Handcrafted'

// FILE ADMIN CỦA ANH ĐANG NẰM CHUNG TRONG /pages → IMPORT TRỰC TIẾP
import AdminLayout from './pages/AdminLayout'
import AdminProducts from './pages/AdminProducts'     // anh đặt tên gì thì sửa tên cho khớp
import AdminOrders from './pages/AdminOrders'         // nếu chưa có thì đổi thành AdminDashboard cũng được

import { useEffect, useState } from 'react'
import { supabase } from './supabaseclient'

function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkAdminRole(session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) checkAdminRole(session.user.id)
      else setIsAdmin(false)
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const checkAdminRole = async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', uid)
      .single()

    setIsAdmin(data?.role === 'admin')
  }

  // Bảo vệ route admin
  const ProtectedAdmin = ({ children }) => {
    if (loading) return <div style={{paddingTop: '200px', textAlign: 'center', color: '#A51C30'}}>Đang tải...</div>
    if (!user) return <Navigate to="/login" replace />
    if (!isAdmin) {
      alert('Bạn không có quyền truy cập khu vực quản trị!')
      return <Navigate to="/" replace />
    }
    return children
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: 'Georgia, serif' }}>
        <Navbar user={user} isAdmin={isAdmin} />

        <main style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/handcrafted" element={<Handcrafted />} />

            {/* ADMIN ROUTES – KHÔNG CẦN THƯ MỤC CON */}
            <Route
              path="/admin"
              element={
                <ProtectedAdmin>
                  <AdminLayout />
                </ProtectedAdmin>
              }
            >
              <Route index element={<AdminProducts />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App