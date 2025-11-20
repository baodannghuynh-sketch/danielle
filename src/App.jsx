// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseclient'

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
import AdminLayout from './pages/AdminLayout'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'

function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)

        if (session?.user) {
          await checkAdminRole(session.user.id)
        }

      } catch (err) {
        console.error("Lỗi getSession:", err)
      } finally {
        setLoading(false)
      }
    }

    load()

    // --- FIX SUPABASE v2 ---
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) checkAdminRole(session.user.id)
      else setIsAdmin(false)
    })

    // unsubscribe đúng
    return () => {
      data.subscription.unsubscribe()
    }

  }, [])

  const checkAdminRole = async (uid) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .single()
      setIsAdmin(data?.role === 'admin')
    } catch (err) {
      console.error("Lỗi checkAdminRole:", err)
      setIsAdmin(false)
    }
  }

  // Splash screen loading
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Playfair Display", serif'
      }}>
        <h1 style={{
          fontSize: '120px',
          letterSpacing: '20px',
          background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          DANIELLE
        </h1>
        <p style={{letterSpacing: '10px', marginTop: '40px'}}>L U X U R Y   I S   E T E R N A L</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div style={{minHeight: '100vh', background: '#000', color: '#fff'}}>
        <Navbar user={user} isAdmin={isAdmin} />
        <main style={{minHeight: '100vh', paddingTop: '120px'}}>
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

            {/* Admin routes */}
            <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/" />}>
              <Route index element={<AdminProducts />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
