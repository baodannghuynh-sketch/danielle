// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseclient";

export default function Navbar({ user, profile, isAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpen(false);
  }, [location.pathname]);

    // Logout
   const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase signOut error:", error);
      alert("Đăng xuất thất bại!");
      return;
    }

    // Xoá role
    localStorage.removeItem("isAdmin");

    // Điều hướng
    navigate("/");

    // Reset app state
    setTimeout(() => {
      window.location.reload();
    }, 100);

  } catch (err) {
    console.error("Unexpected logout error:", err);
  }
};



  const firstLetter =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <header className="nav-root">
      <nav className="nav-inner">
        {/* LOGO */}
        <div className="nav-left">
          <Link to={isAdmin ? "/admin" : "/"} className="nav-logo">
            DANIELLE
            {isAdmin && <span className="nav-logo-admin">ADMIN</span>}
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <div className="nav-center nav-center-desktop">
          {isAdmin ? (
            <>
              <TopLink to="/admin" active={isAdminRoute && location.pathname === "/admin"}>
                Dashboard
              </TopLink>
              <TopLink
                to="/admin/products"
                active={location.pathname.startsWith("/admin/products")}
              >
                Sản phẩm
              </TopLink>
              <TopLink
                to="/admin/orders"
                active={location.pathname.startsWith("/admin/orders")}
              >
                Đơn hàng
              </TopLink>
              <TopLink to="/admin/users">Người dùng</TopLink>
              <TopLink to="/shop">Xem shop</TopLink>
            </>
          ) : (
            <>
              <TopLink to="/" active={location.pathname === "/"}>
                Trang chủ
              </TopLink>
              <TopLink to="/shop" active={location.pathname === "/shop"}>
                Shop
              </TopLink>
              <TopLink to="/men" active={location.pathname === "/men"}>
                Men
              </TopLink>
              <TopLink to="/women" active={location.pathname === "/women"}>
                Women
              </TopLink>
              <TopLink
                to="/handcrafted"
                active={location.pathname === "/handcrafted"}
              >
                Diamond
              </TopLink>
            </>
          )}
        </div>

        {/* ICONS + USER (DESKTOP) */}
        <div className="nav-right nav-right-desktop" ref={dropdownRef}>
          {!isAdmin && (
            <div className="nav-icons">
              <Icon to="/" icon="home" />
              <Icon to="/shop" icon="bag" />
              <Icon to="/cart" icon="cart" />
            </div>
          )}

          {/* USER AREA */}
          {!user ? (
            <Link to="/login" className="nav-login-btn">
              ĐĂNG NHẬP
            </Link>
          ) : (
            <div
              className="nav-user"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="nav-avatar">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  firstLetter
                )}
              </div>
              <div>
                <div className="nav-user-name">
                  {isAdmin ? "ADMIN" : profile?.full_name || user.email}
                </div>
                <div className="nav-user-sub">
                  {open ? "▲" : "▼"} TÀI KHOẢN
                </div>
              </div>
            </div>
          )}

          {/* DROPDOWN */}
          {open && user && (
            <div className="nav-dropdown">
              {isAdmin ? (
                <>
                  <DropLink to="/admin">Trang quản trị</DropLink>
                  <DropLink to="/admin/products">Quản lý sản phẩm</DropLink>
                  <DropLink to="/admin/orders">Quản lý đơn hàng</DropLink>
                  <DropLink to="/admin/users">Quản lý người dùng</DropLink>
                  <DropLink to="/profile">Sửa hồ sơ admin</DropLink>
                </>
              ) : (
                <>
                  <DropLink to="/profile">Hồ sơ cá nhân</DropLink>
                  <DropLink to="/orders">Đơn hàng của tôi</DropLink>
                  <DropLink to="/wishlist">Yêu thích</DropLink>
                </>
              )}

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: "#a21e32ff",
                  color: "white",
                  border: "none",
                  textAlign: "left",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {/* MOBILE RIGHT: cart + avatar + hamburger */}
        <div className="nav-right nav-right-mobile">
          {!isAdmin && (
            <Icon to="/cart" icon="cart" />
          )}

          {user && (
            <div
              className="nav-avatar nav-avatar-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                firstLetter
              )}
            </div>
          )}

          {!user && (
            <Link to="/login" className="nav-login-btn nav-login-mobile">
              ĐN
            </Link>
          )}

          <button
            className="nav-burger"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="nav-mobile-menu">
          <div className="nav-mobile-inner">
            {isAdmin ? (
              <>
                <DropLink to="/admin">Dashboard</DropLink>
                <DropLink to="/admin/products">Sản phẩm</DropLink>
                <DropLink to="/admin/orders">Đơn hàng</DropLink>
                <DropLink to="/admin/users">Người dùng</DropLink>
                <DropLink to="/shop">Xem shop</DropLink>
              </>
            ) : (
              <>
                <DropLink to="/">Trang chủ</DropLink>
                <DropLink to="/shop">Shop</DropLink>
                <DropLink to="/men">Men</DropLink>
                <DropLink to="/women">Women</DropLink>
                <DropLink to="/handcrafted">Diamond</DropLink>
              </>
            )}

            {user && (
              <button onClick={handleLogout} className="nav-logout-btn mobile">
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        .nav-root {
          background: linear-gradient(135deg, #a51c30 0%, #c51c35 100%);
          padding: 1.1rem 0;
          color: white;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 999;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        .nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          font-size: 34px;
          color: white;
          text-decoration: none;
          letter-spacing: 12px;
          font-weight: 300;
          font-family: "Playfair Display", serif;
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .nav-logo-admin {
          font-size: 12px;
          letter-spacing: 6px;
          text-transform: uppercase;
        }
        .nav-center {
          display: flex;
          gap: 26px;
          align-items: center;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .nav-icons {
          display: flex;
          gap: 18px;
          margin-right: 12px;
        }
        .nav-login-btn {
          background: rgba(255, 255, 255, 0.2);
          padding: 10px 26px;
          border-radius: 50px;
          color: white;
          text-decoration: none;
          letter-spacing: 1px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .nav-user {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .nav-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
        }
        .nav-user-name {
          font-weight: 600;
          font-size: 13px;
        }
        .nav-user-sub {
          font-size: 11px;
          opacity: 0.7;
        }
        .nav-dropdown {
          position: absolute;
          right: 0;
          top: 70px;
          width: 240px;
          background: white;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
          color: #333;
        }
        .nav-logout-btn {
          width: 100%;
          padding: 14px 18px;
          background: #a51c30;
          color: white;
          border: none;
          text-align: left;
          font-weight: 600;
          cursor: pointer;
        }
        .nav-logout-btn.mobile {
          text-align: center;
          border-radius: 0 0 14px 14px;
        }

        /* Mobile */
        .nav-center-desktop {
          display: flex;
        }
        .nav-right-desktop {
          display: flex;
        }
        .nav-right-mobile {
          display: none;
        }

        .nav-burger {
          display: none;
          width: 40px;
          height: 32px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          background: transparent;
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          padding: 0;
        }
        .nav-burger span {
          width: 18px;
          height: 2px;
          background: white;
        }

        .nav-mobile-menu {
          position: fixed;
          inset: 70px 0 0 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(12px);
          z-index: 998;
        }
        .nav-mobile-inner {
          max-width: 360px;
          margin-left: auto;
          background: #111;
          height: 100%;
          padding-top: 16px;
        }

        @media (max-width: 1024px) {
          .nav-logo {
            font-size: 26px;
            letter-spacing: 8px;
          }
          .nav-center-desktop {
            display: none;
          }
          .nav-right-desktop {
            display: none;
          }
          .nav-right-mobile {
            display: flex;
          }
          .nav-burger {
            display: flex;
          }
          .nav-avatar-mobile {
            width: 36px;
            height: 36px;
          }
          .nav-login-mobile {
            padding: 8px 16px;
            font-size: 11px;
          }
        }

        @media (max-width: 600px) {
          .nav-inner {
            padding: 0 16px;
          }
          .nav-logo {
            font-size: 22px;
            letter-spacing: 6px;
          }
        }
      `}</style>
    </header>
  );
}

/* TOP LINK */
function TopLink({ to, children, active }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: 14,
        textDecoration: "none",
        textTransform: "uppercase",
        letterSpacing: "3px",
        color: active ? "#fff" : "rgba(255,255,255,0.8)",
        borderBottom: active ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent",
        paddingBottom: 4,
      }}
    >
      {children}
    </Link>
  );
}

/* ICONS */
function Icon({ to, icon }) {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    bag: (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
    cart: (
      <>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </>
    ),
  };

  return (
    <Link to={to} style={{ color: "white" }}>
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2">
        {icons[icon]}
      </svg>
    </Link>
  );
}

/* DROPLINK */
function DropLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "14px 20px",
        textDecoration: "none",
        color: "#333",
        fontSize: "14px",
        borderBottom: "1px solid #eee",
      }}
    >
      {children}
    </Link>
  );
}
