// src/layouts/AdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseclient';

const menuItems = [
  { to: '/admin', label: 'Tổng quan', icon: 'Dashboard' },
  { to: '/admin/products', label: 'Sản phẩm', icon: 'Package' },
  { to: '/admin/orders', label: 'Đơn hàng', icon: 'ShoppingBag' },
  { to: '/admin/customers', label: 'Khách hàng', icon: 'Users' },
  { to: '/admin/analytics', label: 'Thống kê', icon: 'BarChart3' },
  { to: '/admin/settings', label: 'Cài đặt', icon: 'Settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !data || data.role !== 'admin') {
      alert('Bạn không có quyền truy cập khu vực quản trị!');
      await supabase.auth.signOut();
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header đỏ rượu vang */}
      <header style={{
        background: 'linear-gradient(135deg, #A51C30 0%, #c51c35 100%)',
        padding: '20px 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(165, 28, 48, 0.4)',
        position: 'relative',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link 
            to="/admin" 
            style={{
              fontSize: '38px',
              fontWeight: '300',
              letterSpacing: '12px',
              color: 'white',
              textDecoration: 'none',
              fontFamily: '"Playfair Display", serif',
              textShadow: '0 4px 15px rgba(0,0,0,0.4)'
            }}
          >
            DANIELLE
          </Link>
          <span style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: '3px',
            borderLeft: '1px solid rgba(255,255,255,0.3)',
            paddingLeft: '30px'
          }}>
            LUXURY ADMIN PANEL
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '14px 36px',
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            letterSpacing: '1px',
            transition: 'all 0.4s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={e => {
            e.target.style.background = 'white';
            e.target.style.color = '#A51C30';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(255,255,255,0.15)';
            e.target.style.color = 'white';
          }}
        >
          Đăng xuất
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? '300px' : '80px',
          background: '#111',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          borderRight: '1px solid #222'
        }}>
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '-20px',
              width: '40px',
              height: '40px',
              background: '#A51C30',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 8px 25px rgba(165,28,48,0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {sidebarOpen ? '←' : '→'}
          </button>

          <nav style={{ padding: '100px 0 40px' }}>
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '18px 30px',
                  color: isActive(item.to) ? '#fff' : '#aaa',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: isActive(item.to) ? '600' : '500',
                  background: isActive(item.to) ? 'rgba(165,28,48,0.3)' : 'transparent',
                  borderLeft: isActive(item.to) ? '4px solid #A51C30' : '4px solid transparent',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  if (!isActive(item.to)) {
                    e.currentTarget.style.background = 'rgba(165,28,48,0.15)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(item.to)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#aaa';
                  }
                }}
              >
                <span style={{ fontSize: '22px' }}>
                  {item.icon}
                </span>
                {sidebarOpen && <span>{item.label}</span>}
                
                {/* Active indicator */}
                {isActive(item.to) && sidebarOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    background: '#A51C30',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px #A51C30'
                  }} />
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '50px 5vw',
          background: 'linear-gradient(to bottom, #0f0a0a 0%, #000 100%)',
          minHeight: 'calc(100vh - 88px)',
          overflowY: 'auto'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Footer nhỏ */}
      <footer style={{
        background: '#111',
        padding: '30px 5vw',
        textAlign: 'center',
        fontSize: '14px',
        color: '#666',
        borderTop: '1px solid #222'
      }}>
        © 2025 DANIELLE Luxury Jewelry • Admin Panel v2.0 • Handcrafted with passion
      </footer>
    </div>
  );
}