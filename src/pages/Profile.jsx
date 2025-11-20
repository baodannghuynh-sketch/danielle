// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ full_name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Tạo profile mặc định nếu chưa có
        const defaultProfile = {
          id: user.id,
          full_name: user.user_metadata.full_name || user.email.split('@')[0],
          phone: '',
          address: '',
          updated_at: new Date()
        };
        await supabase.from('profiles').insert(defaultProfile);
        setProfile({ full_name: defaultProfile.full_name, phone: '', address: '' });
      } else if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name.trim() || user.email.split('@')[0],
        phone: profile.phone.trim(),
        address: profile.address.trim() || null,
        updated_at: new Date()
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      alert('Lỗi khi lưu: ' + error.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0a0a 0%, #1a0f0f 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        letterSpacing: '3px'
      }}>
        Đang tải hồ sơ VIP...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0a0a 0%, #1a0f0f 100%)',
      padding: '140px 20px 200px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(165,28,48,0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(165,28,48,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        {/* VIP Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '40px',
          padding: '80px 70px',
          boxShadow: '0 50px 120px rgba(0,0,0,0.6), 0 0 100px rgba(165,28,48,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Logo + Title */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{
              fontSize: '88px',
              fontWeight: '300',
              letterSpacing: '20px',
              margin: '0 0 20px',
              fontFamily: '"Playfair Display", serif',
              background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              DANIELLE
            </h1>
            <p style={{
              fontSize: '24px',
              letterSpacing: '8px',
              color: '#A51C30',
              margin: 0,
              fontWeight: '500'
            }}>
              THÀNH VIÊN VIP
            </p>
          </div>

          {/* Member Info */}
          <div style={{
            background: 'rgba(165,28,48,0.1)',
            borderRadius: '24px',
            padding: '30px',
            marginBottom: '50px',
            textAlign: 'center',
            border: '1px solid rgba(165,28,48,0.3)'
          }}>
            <p style={{ color: '#aaa', fontSize: '16px', letterSpacing: '3px', margin: '0 0 8px' }}>
              THÀNH VIÊN KÍNH CHÀO
            </p>
            <p style={{
              fontSize: '28px',
              color: '#fff',
              fontWeight: '500',
              margin: 0,
              letterSpacing: '2px'
            }}>
              {profile.full_name || user?.email.split('@')[0]}
            </p>
            <p style={{ color: '#A51C30', fontSize: '18px', margin: '8px 0 0' }}>
              {user?.email}
            </p>
          </div>

          {/* Form chỉnh sửa */}
          <div style={{ space: '30px 0' }}>
            <input
              placeholder="Họ & tên"
              value={profile.full_name}
              onChange={e => setProfile({ ...profile, full_name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Số điện thoại"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              style={inputStyle}
            />
            <textarea
              placeholder="Địa chỉ giao hàng mặc định (sẽ dùng cho mọi đơn hàng)"
              value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
              rows="4"
              style={{ ...inputStyle, height: '140px', resize: 'none' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 1,
                padding: '24px',
                background: saving ? '#777' : '#A51C30',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: 'bold',
                letterSpacing: '4px',
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 20px 50px rgba(165,28,48,0.4)',
                transition: 'all 0.5s ease'
              }}
              onMouseEnter={e => !saving && (e.target.style.background = '#c51c35')}
              onMouseLeave={e => !saving && (e.target.style.background = '#A51C30')}
            >
              {saving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
            </button>

            <button
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                padding: '24px',
                background: 'transparent',
                color: '#A51C30',
                border: '2px solid #A51C30',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: 'bold',
                letterSpacing: '4px',
                cursor: 'pointer',
                transition: 'all 0.4s ease'
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(165,28,48,0.1)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              QUAY LẠI
            </button>
          </div>

          {/* Success message */}
          {saved && (
            <div style={{
              marginTop: '40px',
              padding: '24px',
              background: 'rgba(76,175,80,0.15)',
              border: '2px solid #66BB6A',
              borderRadius: '20px',
              color: '#66BB6A',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Cập nhật thông tin thành công! Bạn thật sự là thành viên VIP của DANIELLE
            </div>
          )}

          {/* Decorative line */}
          <div style={{
            marginTop: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #A51C30, transparent)',
            boxShadow: '0 0 30px #A51C30'
          }} />
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '22px 24px',
  marginBottom: '24px',
  background: 'rgba(255,255,255,0.08)',
  border: '2px solid rgba(255,255,255,0.15)',
  borderRadius: '20px',
  color: 'white',
  fontSize: '18px',
  outline: 'none',
  transition: 'all 0.4s ease',
  '::placeholder': { color: '#888' }
};