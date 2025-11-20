// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseclient';
import { useCartStore } from '../store/useCartStore'; // Import store giỏ hàng (adjust path if needed)

export default function Navbar({ user, isAdmin }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy số lượng từ Zustand store
  const cartCount = useCartStore((state) => state.getCount());

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    navigate('/');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Khách';
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header style={{
      background: 'linear-gradient(135deg, #A51C30 0%, #c51c35 100%)',
      color: 'white',
      padding: '1.6rem 0',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 8px 32px rgba(165, 28, 48, 0.3)',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      backdropFilter: 'blur(10px)',
    }}>
      <nav style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 5vw',
        height: '60px'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            fontSize: '42px',
            fontWeight: '300',
            letterSpacing: '14px',
            color: 'white',
            textDecoration: 'none',
            fontFamily: '"Playfair Display", serif',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.4s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.letterSpacing = '18px'}
          onMouseLeave={e => e.currentTarget.style.letterSpacing = '14px'}
        >
          DANIELLE
        </Link>

        {/* Icons trung tâm */}
        <div style={{ display: 'flex', gap: '44px', alignItems: 'center' }}>
          {/* Home */}
          <NavIcon to="/" title="Trang chủ">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </NavIcon>

          {/* Shop */}
          <NavIcon to="/shop" title="Bộ sưu tập">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </NavIcon>

          {/* Cart + Badge */}
          <div style={{ position: 'relative' }}>
            <NavIcon to="/cart" title="Giỏ hàng">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </NavIcon>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '-12px',
                background: '#fff',
                color: '#A51C30',
                fontSize: '13px',
                fontWeight: 'bold',
                minWidth: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                animation: 'pulse 2s infinite'
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* User Area */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          {user ? (
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '30px',
                transition: 'all 0.3s ease',
                background: dropdownOpen ? 'rgba(255,255,255,0.15)' : 'transparent'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 'bold',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.4s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {firstLetter}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: '500', opacity: 0.9 }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.7, letterSpacing: '1px' }}>
                  {dropdownOpen ? '▲' : '▼'} TÀI KHOẢN
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                padding: '14px 32px',
                border: '2px solid white',
                borderRadius: '50px',
                transition: 'all 0.4s ease',
                letterSpacing: '1px'
              }}
              onMouseEnter={e => {
                e.target.style.background = 'white';
                e.target.style.color = '#A51C30';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              ĐĂNG NHẬP
            </Link>
          )}

          {/* Dropdown Menu */}
          {user && dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '78px',
              right: 0,
              width: '280px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(165, 28, 48, 0.25)',
              overflow: 'hidden',
              animation: 'slideDown 0.3s ease'
            }}>
              {/* Header */}
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #fdf2f4, #ffebee)',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 'bold', color: '#A51C30' }}>
                  {displayName}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                  {user.email}
                </p>
              </div>

              {/* Menu Items */}
              <div style={{ background: 'white' }}>
                <DropdownLink to="/profile">Hồ sơ cá nhân</DropdownLink>
                <DropdownLink to="/orders">Đơn hàng của tôi</DropdownLink>
                <DropdownLink to="/wishlist">Yêu thích</DropdownLink>
                {isAdmin && (
                  <DropdownLink to="/admin" style={{ color: '#A51C30', fontWeight: 'bold', background: '#fdf2f4' }}>
                    Quản trị hệ thống
                  </DropdownLink>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  background: '#A51C30',
                  color: 'white',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.target.style.background = '#900020'}
                onMouseLeave={e => e.target.style.background = '#A51C30'}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

// Component con tái sử dụng
const NavIcon = ({ to, title, children }) => (
  <Link
    to={to}
    title={title}
    style={{
      color: 'white',
      textDecoration: 'none',
      opacity: 0.85,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'translateY(-4px) scale(1.15)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.opacity = '0.85';
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
    }}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </Link>
);

const DropdownLink = ({ to, children, style = {} }) => (
  <Link
    to={to}
    style={{
      display: 'block',
      padding: '16px 24px',
      color: '#333',
      textDecoration: 'none',
      fontSize: '15px',
      borderBottom: '1px solid #f0f0f0',
      transition: 'all 0.3s',
      ...style
    }}
    onMouseEnter={e => e.target.style.background = '#fdf2f4'}
    onMouseLeave={e => e.target.style.background = 'white'}
  >
    {children}
  </Link>
);

// Thêm animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(style);