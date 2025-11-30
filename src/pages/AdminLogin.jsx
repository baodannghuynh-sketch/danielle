import { useState } from "react";
import { supabase } from "../supabaseclient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data: admin, error: err } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (err || !admin) {
      setError("Sai tài khoản hoặc mật khẩu!");
      return;
    }

    localStorage.setItem("admin_role", "admin");
    navigate("/admin/dashboard");
  };

  return (
    <div style={{ padding: 50, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <h1>Đăng nhập Admin</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 12, marginBottom: 20 }}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 12, marginBottom: 20 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ width: "100%", padding: 12 }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
//src/pages/AdminLogin.jsx