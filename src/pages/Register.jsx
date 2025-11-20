// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseclient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      return setMessage('Vui lòng nhập đầy đủ các trường bắt buộc');
    }
    if (password !== confirmPassword) return setMessage('Mật khẩu nhập lại không khớp!');
    if (password.length < 6) return setMessage('Mật khẩu phải có ít nhất 6 ký tự');

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            address: address.trim() || null
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (error) throw error;

      setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
      setTimeout(() => navigate('/login'), 5000);

    } catch (err) {
      const msg = err.message || 'Đã có lỗi xảy ra!';
      setMessage(msg.includes('rate limit') ? 'Bạn đăng ký quá nhanh. Vui lòng thử lại sau 1 phút.' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0a0a 0%, #1a0f0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Luxury background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 25% 75%, rgba(165,28,48,0.2) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 75% 25%, rgba(165,28,48,0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* VIP Registration Card */}
      <div style={{
        width: '100%',
        maxWidth: '580px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '40px',
        padding: '90px 70px',
        boxShadow: '0 60px 140px rgba(0,0,0,0.7), 0 0 120px rgba(165,28,48,0.25)',
        position: 'relative',
        zIndex: 10,
        transition: 'all 0.6s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-12px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {/* Logo + VIP Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '96px',
            fontWeight: '300',
            letterSpacing: '28px',
            margin: '0 0 24px',
            fontFamily: '"Playfair Display", serif',
            background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 15px 40px rgba(0,0,0,0.6)',
            animation: 'glow 5s ease-in-out infinite alternate'
          }}>
            DANIELLE
          </h1>
          <p style={{
            fontSize: '26px',
            letterSpacing: '10px',
            color: '#A51C30',
            margin: 0,
            fontWeight: '600'
          }}>
            THÀNH VIÊN ĐỘC QUYỀN
          </p>
        </div>

        <p style={{
          textAlign: 'center',
          color: '#ccc',
          margin: '0 0 60px',
          fontSize: '18px',
          letterSpacing: '1.5px',
          lineHeight: '1.8'
        }}>
          Trở thành thành viên VIP để nhận ưu đãi đặc biệt • Giao hàng miễn phí • Quà tặng sinh nhật
        </p>

        {/* Form */}
        <div>
          <input
            placeholder="Họ & tên *"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="tel"
            placeholder="Số điện thoại *"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Địa chỉ giao hàng (không bắt buộc)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            style={inputStyle}
          />

          {/* Password với nút hiện/ẩn */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu *"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#A51C30',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu *"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            style={{ ...inputStyle, marginBottom: '50px' }}
          />

          {/* Submit Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: '100%',
              padding: '28px',
              background: loading ? '#555' : '#A51C30',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '22px',
              fontWeight: 'bold',
              letterSpacing: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 25px 60px rgba(165,28,48,0.5)',
              transition: 'all 0.6s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => !loading && (e.target.style.background = '#c51c35')}
            onMouseLeave={e => !loading && (e.target.style.background = '#A51C30')}
          >
            {loading ? 'ĐANG TẠO TÀI KHOẢN VIP...' : 'TRỞ THÀNH THÀNH VIÊN'}
          </button>

          {/* Message */}
          {message && (
            <div style={{
              marginTop: '40px',
              padding: '24px',
              borderRadius: '20px',
              background: message.includes('thành công') 
                ? 'rgba(76,175,80,0.2)' 
                : 'rgba(211,47,47,0.2)',
              color: message.includes('thành công') ? '#66BB6A' : '#EF5350',
              border: `2px solid ${message.includes('thành công') ? '#66BB6A' : '#EF5350'}`,
              fontSize: '17px',
              textAlign: 'center',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              {message}
            </div>
          )}

          {/* Login link */}
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p style={{ color: '#999', fontSize: '17px' }}>
              Đã có tài khoản?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{
                  color: '#A51C30',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '18px',
                  letterSpacing: '1px'
                }}
              >
                Đăng nhập ngay
              </span>
            </p>
          </div>

          {/* Decorative line */}
          <div style={{
            marginTop: '70px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #A51C30, transparent)',
            boxShadow: '0 0 40px #A51C30'
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 20px #A51C30); }
          to { filter: drop-shadow(0 0 60px #A51C30); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '24px 26px',
  marginBottom: '24px',
  background: 'rgba(255,255,255,0.08)',
  border: '2px solid rgba(255,255,255,0.15)',
  borderRadius: '20px',
  color: 'white',
  fontSize: '18px',
  outline: 'none',
  transition: 'all 0.4s ease',
  '::placeholder': { color: '#888', opacity: 0.9 }
};