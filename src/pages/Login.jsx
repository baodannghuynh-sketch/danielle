// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseclient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // ===============================
      // 1) ĐĂNG NHẬP USER THƯỜNG
      // ===============================
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage("Sai email hoặc mật khẩu!");
        return;
      }

      // ===============================
      // 2) CHECK ROLE TRONG PROFILES
      // ===============================
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role")
        .eq("id", data.user.id)
        .single();

      // ===============================
      // 3) NẾU LÀ ADMIN → LƯU ADMIN
      // ===============================
      if (profile?.role === "admin") {
        localStorage.setItem("isAdmin", "true");

        // Lưu toàn bộ data admin
        localStorage.setItem(
          "adminData",
          JSON.stringify({
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            email: email.trim(),
            id: data.user.id,
          })
        );

        navigate("/admin");
        return;
      }

      // ===============================
      // 4) USER THƯỜNG → XOÁ ADMIN
      // ===============================
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminData");
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage("Lỗi đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a0007 0%, #0a0a0a 80%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        color: "white",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "420px",
          padding: "45px",
          borderRadius: "22px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 10px 50px rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "6px",
            fontSize: "52px",
            fontFamily: '"Playfair Display", serif',
            letterSpacing: "16px",
            background: "linear-gradient(90deg, #c41e3a, #ffffff, #c41e3a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DANIELL
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "35px",
            fontSize: "14px",
            letterSpacing: "6px",
            opacity: 0.8,
          }}
        >
          THÀNH VIÊN ĐỘC QUYỀN
        </p>

        {message && (
          <p
            style={{
              color: "#ff6b6b",
              marginBottom: "20px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Mật khẩu</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 15,
              top: 14,
              cursor: "pointer",
              color: "#bbb",
              fontSize: "14px",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "30px",
            border: "none",
            borderRadius: "40px",
            background: "linear-gradient(90deg, #8c1026, #d61f41)",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            letterSpacing: "2px",
            cursor: "pointer",
          }}
        >
          {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
        </button>

        <p style={{ marginTop: "25px", textAlign: "center", fontSize: "14px" }}>
          Chưa có tài khoản?{" "}
          <Link to="/register" style={{ color: "#ff3c6a", textDecoration: "none" }}>
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}

const labelStyle = {
  fontSize: "13px",
  opacity: 0.9,
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  margin: "8px 0 22px",
  borderRadius: "12px",
  border: "1px solid #44222a",
  background: "rgba(0,0,0,0.4)",
  color: "white",
  fontSize: "15px",
};
