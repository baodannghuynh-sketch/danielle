// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';

export default function Navbar({ user, isAdmin, cartCount = 0 }) { // thêm cartCount nếu có
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header style={{
      background: '#A51C30',
      color: 'white',
      padding: '1.4rem 0',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      fontFamily: "'Helvetica Neue', Arial, sans-serif"
    }}>
      <nav style={{
        maxWidth: '1400px',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '36px',
          fontWeight: '300',
          letterSpacing: '10px',
          color: 'white',
          textDecoration: 'none',
          fontFamily: "'Playfair Display', serif"
        }}>
          DANIELLE
        </Link>

        {/* 3 Icon thay thế chữ */}
        <div style={{ display: 'flex', gap: '38px', alignItems: 'center' }}>
          {/* Home Icon */}
          <Link to="/" title="Home" style={iconLinkStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>

          {/* Shop Icon */}
          <Link to="/shop" title="Shop" style={iconLinkStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </Link>

          {/* Cart Icon + Badge */}
          <Link to="/cart" title="Cart" style={{ ...iconLinkStyle, position: 'relative' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {/* Badge số lượng */}
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: 'white',
                color: '#A51C30',
                fontSize: '12px',
                fontWeight: 'bold',
                minWidth: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 5px'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* User Section */}
        <div style={{ position: 'relative' }}>
          {user ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div style={{
                width: '46px',
                height: '46px',
                background: 'rgba(255,255,255,0.25)',
                border: '2px solid white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                {firstLetter}
              </div>
              <span style={{ fontSize: '17px', fontWeight: '500' }}>
                {displayName}
              </span>
              <span style={{ fontSize: '12px', transition: '0.3s' }}>
                {dropdownOpen ? '▲' : '▼'}
              </span>
            </div>
          ) : (
            <Link to="/login" style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '500',
              padding: '12px 28px',
              border: '2px solid white',
              borderRadius: '30px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              Login
            </Link>
          )}

          {/* Dropdown */}
          {user && dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '74px',
              right: 0,
              background: 'white',
              minWidth: '240px',
              borderRadius: '16px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '22px', background: '#fdf2f4', textAlign: 'center' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 'bold', color: '#A51C30' }}>{displayName}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{user.email}</p>
              </div>
              <Link to="/profile" style={dropdownItem}>Hồ sơ cá nhân</Link>
              <Link to="/orders" style={dropdownItem}>Đơn hàng</Link>
              <Link to="/cart" style={dropdownItem}>Giỏ hàng</Link>
              {isAdmin && (
                <Link to="/admin" style={{...dropdownItem, background: '#fdf2f4', color: '#A51C30', fontWeight: 'bold'}}>
                  Quản trị
                </Link>
              )}
              <button onClick={handleLogout} style={{
                width: '100%',
                padding: '18px 24px',
                background: '#A51C30',
                color: 'white',
                border: 'none',
                textAlign: 'left',
                fontSize: '16px',
                cursor: 'pointer',
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

// Style chung
const iconLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  opacity: 0.9,
  transition: 'all 0.3s ease',
};

iconLinkStyle[':hover'] = {
  opacity: 1,
  transform: 'translateY(-2px)'
};

const dropdownItem = {
  display: 'block',
  padding: '16px 24px',
  color: '#333',
  textDecoration: 'none',
  fontSize: '15px',
  borderBottom: '1px solid #eee',
  transition: '0.3s'
};