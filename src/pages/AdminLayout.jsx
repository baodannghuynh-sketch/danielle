// src/pages/AdminLayout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseclient'
import { useEffect } from 'react'

export default function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return navigate('/login')

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!data || data.role !== 'admin') {
      alert('Bạn không có quyền truy cập khu vực quản trị!')
      navigate('/')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0a0a', color: 'white', fontFamily: 'Georgia, serif' }}>
      {/* Header đỏ rượu */}
      <div style={{ background: '#A51C30', padding: '22px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/admin" style={{ color: 'white', fontSize: '36px', fontWeight: '300', letterSpacing: '10px', textDecoration: 'none', fontFamily: '"Playfair Display", serif' }}>
          DANIELLE ADMIN
        </Link>
        <button onClick={handleLogout} style={{ padding: '12px 32px', background: 'transparent', color: 'white', border: '2px solid white', borderRadius: '30px', cursor: 'pointer', fontSize: '16px' }}>
          Đăng xuất
        </button>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{ width: '280px', background: '#111', minHeight: 'calc(100vh - 88px)', padding: '40px 0' }}>
          <Link to="/admin/products" style={menuItem}>Quản lý sản phẩm</Link>
          <Link to="/admin/orders" style={menuItem}>Quản lý đơn hàng</Link>
        </div>

        {/* Nội dung */}
        <div style={{ flex: 1, padding: '50px', background: '#000' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const menuItem = {
  display: 'block',
  padding: '20px 40px',
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: '500',
  borderLeft: '5px solid transparent',
  transition: 'all 0.3s'
}
menuItem[':hover'] = {
  color: 'white',
  background: 'rgba(165,28,48,0.3)',
  borderLeft: '5px solid #A51C30'
}