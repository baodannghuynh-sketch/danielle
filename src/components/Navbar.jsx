// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseclient";

export default function Navbar({ user, profile, isAdmin }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);

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

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const firstLetter =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #A51C30 0%, #c51c35 100%)",
        padding: "1.4rem 0",
        color: "white",
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 999,
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
      }}
    >
      <nav
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 5vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontSize: "42px",
            color: "white",
            textDecoration: "none",
            letterSpacing: "14px",
            fontWeight: 300,
            fontFamily: '"Playfair Display", serif',
          }}
        >
          DANIELLE
        </Link>

        {/* ICONS */}
        <div style={{ display: "flex", gap: "44px" }}>
          <Icon to="/" icon="home" />
          <Icon to="/shop" icon="bag" />
          <Icon to="/cart" icon="cart" />
        </div>

        {/* USER AREA */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          {!user ? (
            <Link
              to="/login"
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "12px 32px",
                borderRadius: "50px",
                color: "white",
                textDecoration: "none",
                letterSpacing: "1px",
              }}
            >
              ĐĂNG NHẬP
            </Link>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: "pointer",
              }}
              onClick={() => setOpen(!open)}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
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

              <div>
                <div style={{ fontWeight: 600 }}>
                  {isAdmin ? "ADMIN" : profile?.full_name}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.7 }}>
                  {open ? "▲" : "▼"} TÀI KHOẢN
                </div>
              </div>
            </div>
          )}

          {/* DROPDOWN */}
          {open && user && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "70px",
                width: isAdmin ? "260px" : "230px",
                background: "white",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
              }}
            >
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
                  padding: "14px 18px",
                  background: "#A51C30",
                  color: "white",
                  border: "none",
                  textAlign: "left",
                  fontWeight: "600",
                }}
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
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2">
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
