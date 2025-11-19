import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseclient"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setMessage("")
    if (!email || !password) {
      return setMessage("Vui lòng nhập đầy đủ email và mật khẩu")
    }

    setLoading(true)

    // 1. Đăng nhập
    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setLoading(false)
      return setMessage("Email hoặc mật khẩu không đúng!")
    }

    const user = loginData.user

    // 2. Kiểm tra profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // 3. Nếu chưa có profile → tạo mới
    if (profileError || !profile) {
      await supabase.from("profiles").insert({
        id: user.id,
        full_name: user.user_metadata.full_name || "",
        phone: user.user_metadata.phone || "",
        address: user.user_metadata.address || "",
        updated_at: new Date()
      })
    }

    setLoading(false)
    navigate("/")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf9f7",
        paddingTop: "140px",
        paddingBottom: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "white",
          padding: "70px 50px",
          borderRadius: "24px",
          boxShadow: "0 30px 90px rgba(165,28,48,0.18)",
          textAlign: "center",
          margin: "0 20px"
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            letterSpacing: "12px",
            color: "#A51C30",
            margin: "0 0 50px",
            fontFamily: "'Playfair Display', serif",
            fontWeight: "300"
          }}
        >
          DANIELLE
        </h1>

        <h2 style={{ fontSize: "32px", marginBottom: "12px", color: "#111", letterSpacing: "3px" }}>
          CHÀO MỪNG TRỞ LẠI
        </h2>
        <p style={{ color: "#777", marginBottom: "50px", fontSize: "16px" }}>
          Đăng nhập để tiếp tục trải nghiệm sang trọng
        </p>

        <input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...styles.input, marginBottom: "40px" }}
        />

        <button onClick={handleLogin} disabled={loading} style={styles.btn}>
          {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
        </button>

        {message && <div style={styles.error}>{message}</div>}

        <p style={{ marginTop: "40px", color: "#888", fontSize: "16px" }}>
          Chưa có tài khoản?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#A51C30",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  input: {
    width: "100%",
    padding: "20px",
    marginBottom: "20px",
    fontSize: "17px",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    outline: "none"
  },
  btn: {
    width: "100%",
    padding: "20px",
    background: "#A51C30",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "19px",
    fontWeight: "bold",
    letterSpacing: "3px",
    cursor: "pointer"
  },
  error: {
    marginTop: "30px",
    padding: "18px",
    borderRadius: "12px",
    background: "rgba(255,0,0,0.1)",
    color: "#d32f2f",
    border: "1px solid #ef5350",
    fontSize: "16px"
  }
}
