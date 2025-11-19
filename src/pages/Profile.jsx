// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseclient'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({ full_name: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return navigate('/login')
    setUser(user)

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, phone, address')
      .eq('id', user.id)
      .single()

    // Nếu chưa có profile → tạo mới
    if (error && error.code === 'PGRST116') {
      const defaultProfile = {
        id: user.id,
        full_name: user.user_metadata.full_name || '',
        phone: '',
        address: '',
        updated_at: new Date()
      }
      await supabase.from('profiles').insert(defaultProfile)
      setProfile({
        full_name: defaultProfile.full_name,
        phone: '',
        address: ''
      })
    } else if (data) {
      setProfile(data)
    }

    setLoading(false)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim() || null,
        updated_at: new Date()
      })
      .eq('id', user.id)

    setSaving(false)

    if (error) {
      alert('Lỗi khi lưu: ' + error.message)
      return
    }

    alert('Cập nhật thông tin thành công!')
    navigate(-1) // Quay lại trang trước đó
  }

  if (loading) {
    return (
      <div style={{ paddingTop: '200px', textAlign: 'center', fontSize: '22px', color: '#A51C30' }}>
        Đang tải thông tin...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', paddingTop: '160px' }}>
      <div style={{
        maxWidth: '620px',
        margin: 'auto',
        background: 'white',
        padding: '80px 60px',
        borderRadius: '24px',
        boxShadow: '0 30px 90px rgba(165,28,48,0.15)'
      }}>
        {/* ĐÃ SỬA LỖI Ở ĐÂY – dùng nháy kép thay vì nháy đơn */}
        <h1 style={{
          fontSize: '48px',
          textAlign: 'center',
          color: '#A51C30',
          marginBottom: '50px',
          fontFamily: '"Playfair Display", serif',  // SỬA RỒI – KHÔNG CÒN LỖI
          fontWeight: '400'
        }}>
          HỒ SƠ CÁ NHÂN
        </h1>

        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '17px' }}>
          <strong>Email:</strong> {user?.email}
        </p>

        <input
          placeholder="Họ & tên"
          value={profile.full_name}
          onChange={e => setProfile({ ...profile, full_name: e.target.value })}
          style={styles.input}
        />

        <input
          placeholder="Số điện thoại"
          value={profile.phone}
          onChange={e => setProfile({ ...profile, phone: e.target.value })}
          style={styles.input}
        />

        <textarea
          placeholder="Địa chỉ giao hàng mặc định"
          value={profile.address}
          onChange={e => setProfile({ ...profile, address: e.target.value })}
          rows="4"
          style={{ ...styles.input, marginBottom: '40px', resize: 'vertical', fontFamily: 'inherit' }}
        />

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={handleSave}
            onClickCapture={() => navigate(-1)}
            disabled={saving}
            style={styles.btn}
          >
            {saving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              ...styles.btn,
              background: 'transparent',
              color: '#A51C30',
              border: '2px solid #A51C30',
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(165,28,48,0.05)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            HỦY
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  input: {
    width: '100%',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    fontSize: '17px',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  btn: {
    flex: 1,
    padding: '20px',
    background: '#A51C30',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }
}