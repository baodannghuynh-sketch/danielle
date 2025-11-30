import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseclient";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* MENU TRÁI */}
      <aside style={{
        width: "280px",
        background: "#111",
        color: "white",
        padding: "30px 20px"
      }}>
        <h2 style={{ marginBottom: 40 }}>ADMIN PANEL</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/admin/products" style={linkStyle}>Sản phẩm</Link>
          <Link to="/admin/orders" style={linkStyle}>Đơn hàng</Link>
          <Link to="/admin/users" style={linkStyle}>Người dùng</Link>

          <button onClick={logout} style={{
            marginTop: 40,
            padding: 12,
            border: "none",
            background: "#A51C30",
            color: "white",
            cursor: "pointer"
          }}>
            Đăng xuất
          </button>
        </nav>
      </aside>

      {/* NỘI DUNG */}
      <main style={{ flex: 1, padding: "40px", background: "#f5f5f5" }}>
        <Outlet />
      </main>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px 0",
  borderBottom: "1px solid #333"
};
//src/pages/AdminLayout.jsx