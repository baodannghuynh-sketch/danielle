// src/pages/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseclient";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          ADMIN PANEL
        </div>

        <nav className="admin-nav">
          <AdminLink to="/admin">Dashboard</AdminLink>
          <AdminLink to="/admin/products">Sản phẩm</AdminLink>
          <AdminLink to="/admin/orders">Đơn hàng</AdminLink>
          <AdminLink to="/admin/users">Người dùng</AdminLink>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>

      <style jsx>{`
        .admin-root {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          min-height: 100vh;
          background: #000;
        }
        .admin-sidebar {
          background: #050404;
          border-right: 1px solid #111;
          padding: 24px 22px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .admin-brand {
          font-size: 20px;
          color: #fff;
          letter-spacing: 2px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
          flex: 1;
        }
        .admin-logout {
          margin-top: auto;
          background: #a51c30;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 1px;
        }
        .admin-content {
          background: #000;
          min-height: 100vh;
          overflow-x: hidden;
        }

        @media (max-width: 992px) {
          .admin-root {
            grid-template-columns: 220px minmax(0, 1fr);
          }
        }

        @media (max-width: 768px) {
          .admin-root {
            grid-template-columns: 1fr;
          }
          .admin-sidebar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            position: sticky;
            top: 72px;
            z-index: 9;
          }
          .admin-nav {
            flex-direction: row;
            gap: 10px;
            margin: 0;
          }
          .admin-logout {
            padding: 8px 14px;
            font-size: 12px;
          }
        }

        @media (max-width: 576px) {
          .admin-brand {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

function AdminLink({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: "10px 14px",
        borderRadius: 999,
        textDecoration: "none",
        color: isActive ? "#fff" : "#ccc",
        background: isActive ? "#a51c30" : "transparent",
        fontSize: 14,
      })}
    >
      {children}
    </NavLink>
  );
}
