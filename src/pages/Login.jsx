// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseclient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");
    if (!email || !password) {
      return setMessage("Vui lòng nhập đầy đủ email và mật khẩu");
    }

    setLoading(true);

    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      if (error.message.includes("Invalid login credentials")) {
        setMessage("Email hoặc mật khẩu không chính xác");
      } else {
        setMessage("Lỗi kết nối, vui lòng thử lại sau");
      }
      return;
    }

    const user = loginData.user;

    // Tự động tạo profile nếu chưa có
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      await supabase.from("profiles").insert({
        id: user.id,
        full_name: user.user_metadata.full_name || user.email.split("@")[0],
        email: user.email,
        updated_at: new Date(),
      });
    }

    setLoading(false);
    setMessage("Đăng nhập thành công! Đang chuyển hướng...");
    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0a0a 0%, #1a0f0f 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 30% 70%, rgba(165,28,48,0.15) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 70% 30%, rgba(165,28,48,0.1) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />

      {/* Login Card */}
      <div style={{
        width: "100%",
        maxWidth: "520px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "32px",
        padding: "80px 60px",
        boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 100px rgba(165,28,48,0.15)",
        position: "relative",
        zIndex: 10,
        transition: "all 0.6s ease"
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1 style={{
            fontSize: "84px",
            fontWeight: "300",
            letterSpacing: "24px",
            margin: "0 0 20px",
            fontFamily: '"Playfair Display", serif',
            background: "linear-gradient(90deg, #A51C30, #fff, #A51C30)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 10px 30px rgba(0,0,0,0.4)"
          }}>
            DANIELLE
          </h1>
          <p style={{
            fontSize: "18px",
            letterSpacing: "8px",
            color: "#aaa",
            margin: 0,
            fontWeight: "300"
          }}>
            LUXURY JEWELRY
          </p>
        </div>

        <h2 style={{
          textAlign: "center",
          fontSize: "36px",
          margin: "0 0 16px",
          color: "#fff",
          letterSpacing: "3px",
          fontWeight: "400"
        }}>
          CHÀO MỪNG TRỞ LẠI
        </h2>
        <p style={{
          textAlign: "center",
          color: "#ccc",
          margin: "0 0 60px",
          fontSize: "17px",
          letterSpacing: "1px"
        }}>
          Đăng nhập để tiếp tục hành trình sang trọng
        </p>

        {/* Email */}
        <div style={{ position: "relative", marginBottom: "30px" }}>
          <input
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.parentElement.style.transform = "translateY(-4px)"}
            onBlur={(e) => e.target.parentElement.style.transform = "translateY(0)"}
          />
          <label style={floatingLabel}>Email của bạn</label>
        </div>

        {/* Password */}
        <div style={{ position: "relative", marginBottom: "40px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.parentElement.style.transform = "translateY(-4px)"}
            onBlur={(e) => e.target.parentElement.style.transform = "translateY(0)"}
          />
          <label style={floatingLabel}>Mật khẩu</label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#A51C30",
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "22px",
            background: loading ? "#777" : "#A51C30",
            color: "white",
            border: "none",
            borderRadius: "50px",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 15px 40px rgba(165,28,48,0.4)",
            transition: "all 0.5s ease",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={e => !loading && (e.target.style.background = "#c51c35")}
          onMouseLeave={e => !loading && (e.target.style.background = "#A51C30")}
        >
          {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
        </button>

        {/* Message */}
        {message && (
          <div style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "16px",
            background: message.includes("thành công") 
              ? "rgba(76,175,80,0.15)" 
              : "rgba(211,47,47,0.15)",
            color: message.includes("thành công") ? "#66BB6A" : "#EF5350",
            border: `1px solid ${message.includes("thành công") ? "#66BB6A" : "#EF5350"}`,
            fontSize: "16px",
            textAlign: "center",
            fontWeight: "500"
          }}>
            {message}
          </div>
        )}

        {/* Register link */}
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p style={{ color: "#999", fontSize: "16px" }}>
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#A51C30",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "17px",
                letterSpacing: "1px"
              }}
            >
              Đăng ký ngay
            </span>
          </p>
        </div>

        {/* Decorative line */}
        <div style={{
          marginTop: "60px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #A51C30, transparent)",
          boxShadow: "0 0 20px #A51C30"
        }} />
      </div>
    </div>
  );
}

// Styles đỉnh cao
const inputStyle = {
  width: "100%",
  padding: "22px 20px",
  background: "rgba(255,255,255,0.08)",
  border: "2px solid rgba(255,255,255,0.15)",
  borderRadius: "20px",
  color: "white",
  fontSize: "17px",
  outline: "none",
  transition: "all 0.4s ease"
};

const floatingLabel = {
  position: "absolute",
  left: "24px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#aaa",
  fontSize: "17px",
  pointerEvents: "none",
  transition: "all 0.3s ease",
  padding: "0 8px",
  background: "linear-gradient(transparent, #0f0a0a)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};