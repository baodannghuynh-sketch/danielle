import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseclient'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setMessage('')

    // Validation
    if (!fullName || !email || !phone || !password) {
      return setMessage('Vui lòng nhập đầy đủ các trường có dấu *')
    }
    if (password !== confirmPassword) return setMessage('Mật khẩu nhập lại không khớp!')
    if (password.length < 6) return setMessage('Mật khẩu phải có ít nhất 6 ký tự')

    setLoading(true)

    try {
      // Chỉ đăng ký — KHÔNG chèn profile tại đây!
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            address: address
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      })

      if (authError) throw authError

      setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.')
      setTimeout(() => navigate('/login'), 4000)

    } catch (err) {
      setMessage(err.message || 'Đã có lỗi xảy ra!')
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', paddingTop: '140px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '540px', width: '100%', background: 'white', padding: '70px 50px', borderRadius: '24px', boxShadow: '0 30px 90px rgba(165,28,48,0.18)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '56px', letterSpacing: '12px', color: '#A51C30', marginBottom: '50px', fontFamily: "'Playfair Display', serif", fontWeight: '300' }}>
          DANIELLE
        </h1>

        <input placeholder="Họ & tên *" value={fullName} onChange={e => setFullName(e.target.value)} style={styles.input} />
        <input type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
        <input type="tel" placeholder="Số điện thoại *" value={phone} onChange={e => setPhone(e.target.value)} style={styles.input} />
        <input placeholder="Địa chỉ (không bắt buộc)" value={address} onChange={e => setAddress(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Mật khẩu *" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Nhập lại mật khẩu *" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ ...styles.input, marginBottom: '40px' }} />

        <button onClick={handleRegister} disabled={loading} style={styles.btn}>
          {loading ? 'ĐANG ĐĂNG KÝ...' : 'HOÀN TẤT ĐĂNG KÝ'}
        </button>

        {message && (
          <div style={message.includes('thành công') ? styles.success : styles.error}>
            {message}
          </div>
        )}

        <p style={{ marginTop: '40px', color: '#888' }}>
          Đã có tài khoản? <span onClick={() => navigate('/login')} style={{ color: '#A51C30', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Đăng nhập ngay</span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  input: { width: '100%', padding: '20px', marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '17px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '20px', background: '#A51C30', color: 'white', border: 'none', borderRadius: '12px', fontSize: '19px', fontWeight: 'bold', letterSpacing: '3px', cursor: 'pointer' },
  success: { marginTop: '30px', padding: '20px', background: 'rgba(0,200,0,0.1)', color: 'green', borderRadius: '12px', border: '1px solid #4caf50' },
  error: { marginTop: '30px', padding: '20px', background: 'rgba(255,0,0,0.1)', color: '#d32f2f', borderRadius: '12px', border: '1px solid #ef5350' }
}
