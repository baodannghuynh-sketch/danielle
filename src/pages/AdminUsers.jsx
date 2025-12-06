// src/pages/AdminUsers.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setUsers(data || []);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    await supabase.from("profiles").delete().eq("id", id);
    loadUsers();
  };

  const toggleLock = async (id, status) => {
    await supabase.from("profiles").update({ is_locked: !status }).eq("id", id);
    loadUsers();
  };

  const toggleRole = async (email, role) => {
    if (role === "admin") {
      await supabase.from("admin_users").delete().eq("email", email);
    } else {
      await supabase.from("admin_users").insert([{ email }]);
    }
    loadUsers();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Quản lý người dùng</h1>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Tên</th>
              <th>Trạng thái</th>
              <th>Role</th>
              <th style={{ textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.full_name}</td>

                <td style={{ color: u.is_locked ? "#ff6b6b" : "#51ff9c" }}>
                  {u.is_locked ? "Đã khóa" : "Hoạt động"}
                </td>

                <td style={{ color: u.role === "admin" ? "#67b7ff" : "#ccc" }}>
                  {u.role === "admin" ? "Admin" : "User"}
                </td>

                <td>
                  <div style={styles.actionRow}>
                    <button
                      style={styles.btnDanger}
                      onClick={() => handleDelete(u.id)}
                    >
                      Xóa
                    </button>

                    <button
                      style={styles.btnWarning}
                      onClick={() => toggleLock(u.id, u.is_locked)}
                    >
                      {u.is_locked ? "Mở khóa" : "Khóa"}
                    </button>

                    <button
                      style={styles.btnPrimary}
                      onClick={() => toggleRole(u.email, u.role)}
                    >
                      {u.role === "admin" ? "Hạ User" : "Nâng Admin"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

/* ========================
   STYLE TỐI GIẢN – SANG
======================== */
const styles = {
  page: {
    padding: "40px",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif",
  },

  title: {
    fontSize: "38px",
    fontWeight: "300",
    letterSpacing: "4px",
    textAlign: "center",
    marginBottom: "35px",
  },

  tableWrapper: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "14px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "16px",
  },

  actionRow: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },

  btnDanger: {
    background: "#c0392b",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  btnWarning: {
    background: "#e67e22",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  btnPrimary: {
    background: "#2980b9",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};
