// src/components/NavbarAdmin.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseclient";

export default function NavbarAdmin({ profile: initialProfile }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(initialProfile || null);

  // Load profile nếu App chưa truyền xuống
  useEffect(() => {
    if (initialProfile) return;

    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    loadProfile();
  }, [initialProfile]);

  // Click ngoài -> đóng dropdown
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const firstLetter =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    profile?.email?.charAt(0)?.toUpperCase() ||
    "A";

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #7A0A1F 0%, #A51C30 50%, #7A0A1F 100%)",
        padding: "1.3rem 0",
        color: "white",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 9999,
        boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
      }}
    >
      <nav
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          padding: "0 5vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO ADMIN */}
        <Link
          to="/admin"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "44px",
            letterSpacing: "10px",
            textDecoration: "none",
            color: "white",
            fontWeight: 300,
          }}
        >
          DANIELLE <span style={{ fontSize: "18px", opacity: 0.8 }}>ADMIN</span>
        </Link>

        {/* MENU ADMIN */}
        <div style={{ display: "flex", gap: "34px", alignItems: "center" }}>
          <AdminMenuLink to="/admin" label="Dashboard" />
          <AdminMenuLink to="/admin/products" label="Sản phẩm" />
          <AdminMenuLink to="/admin/orders" label="Đơn hàng" />
          <AdminMenuLink to="/admin/users" label="Người dùng" />
          <AdminMenuLink to="/shop" label="Xem shop" />
        </div>

        {/* USER ADMIN */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              padding: "6px 12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "20px",
                overflow: "hidden",
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

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 600 }}>ADMIN</div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                {open ? "▲" : "▼"} Tài khoản
              </div>
            </div>
          </div>

          {/* DROPDOWN */}
          {open && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "65px",
                width: "240px",
                background: "#fff",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
              }}
            >
              <DropItem to="/profile">Hồ sơ admin</DropItem>
              <DropItem to="/admin/products">Quản lý sản phẩm</DropItem>
              <DropItem to="/admin/orders">Quản lý đơn hàng</DropItem>
              <DropItem to="/admin/users">Quản lý người dùng</DropItem>

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: "#A51C30",
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
      </nav>
    </header>
  );
}

function AdminMenuLink({ to, label }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: "16px",
        letterSpacing: "1px",
        textDecoration: "none",
        color: "white",
        fontWeight: "500",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.target.style.color = "#FFD4D8")}
      onMouseLeave={(e) => (e.target.style.color = "white")}
    >
      {label}
    </Link>
  );
}

function DropItem({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "14px 20px",
        color: "#333",
        textDecoration: "none",
        borderBottom: "1px solid #eee",
        fontSize: "14px",
      }}
    >
      {children}
    </Link>
  );
}
