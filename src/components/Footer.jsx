// src/components/Footer.jsx

// 1. Sửa: Thêm tiền tố 'Fi' vào các icon Feather (fi)
import { FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
// 2. Sửa: Thêm tiền tố 'Fa' vào các icon Font Awesome (fa)
import { FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa'; 


// Khai báo Styles và Component phụ TRƯỚC hàm Footer
// Styles
const linkStyle = {
  color: '#999',
  textDecoration: 'none',
  transition: 'color 0.4s ease',
  fontSize: '15px'
};

// Component Social Icon đẹp mượt
const SocialIcon = ({ children, href = '#' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: '#666',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.color = '#A51C30';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.color = '#666';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {children}
  </a>
);


export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#000',
      color: '#999',
      marginTop: '150px',
      fontFamily: '"Playfair Display", Georgia, serif',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '100px 5vw 60px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* 3 cột chính */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '80px',
          marginBottom: '100px',
          paddingBottom: '80px',
          borderBottom: '1px solid #222'
        }}>
          {/* Cột 1 – Thông tin thương hiệu */}
          <div>
            <h3 style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '30px', fontSize: '14px', fontWeight: 600 }}>
              Danielle Luxury Jewelry
            </h3>
            <p style={{ lineHeight: '1.9', fontSize: '15px', color: '#aaa' }}>
              Since 2025 – Handcrafted masterpieces in gold, diamonds & rare gems.
              <br /><br />
              <strong style={{ color: '#A51C30' }}>Hà Nội</strong> • 123 Đường Láng<br />
              <strong style={{ color: '#A51C30' }}>TP.HCM</strong> • 456 Lê Lợi, Q.1
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiPhone size={16} /> +84 912 345 678
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMail size={16} /> hello@danielle.vn
              </span>
            </div>
          </div>

          {/* Cột 2 – Liên kết */}
          <div>
            <h3 style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '30px', fontSize: '14px' }}>
              Khám phá
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.6' }}>
              {['Bộ sưu tập mới', 'Nhẫn cưới', 'Trang sức đá quý', 'Dịch vụ tùy chỉnh', 'Chính sách bảo hành', 'Câu chuyện thương hiệu'].map(item => (
                <li key={item}>
                  <a href="#" style={linkStyle}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3 – Liên hệ & MXH */}
          <div>
            <h3 style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '30px', fontSize: '14px' }}>
              Kết nối với chúng tôi
            </h3>
            <div style={{ display: 'flex', gap: '20px', fontSize: '28px', marginBottom: '30px' }}>
              <SocialIcon href="https://instagram.com"><FiInstagram /></SocialIcon>
              <SocialIcon href="https://facebook.com"><FaFacebookF /></SocialIcon>
              <SocialIcon href="https://youtube.com"><FaYoutube /></SocialIcon>
              <SocialIcon href="https://linkedin.com"><FaLinkedinIn /></SocialIcon>
            </div>
            <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8' }}>
              Đăng ký nhận thông tin về bộ sưu tập độc quyền & ưu đãi riêng.
            </p>
            <form style={{ marginTop: '20px', display: 'flex' }} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  background: '#111',
                  border: '1px solid #333',
                  color: '#fff',
                  borderRadius: '8px 0 0 8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button style={{
                padding: '14px 24px',
                background: '#A51C30',
                color: 'white',
                border: 'none',
                borderRadius: '0 8px 8px 0',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background 0.3s'
              }}
                onMouseEnter={e => e.target.style.background = '#c51c35'}
                onMouseLeave={e => e.target.style.background = '#A51C30'}
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Logo + Copyright */}
        <div style={{ textAlign: 'center', paddingTop: '60px' }}>
          <h1 style={{
            fontSize: '68px',
            background: 'linear-gradient(90deg, #A51C30, #ff6b6b, #A51C30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px',
            letterSpacing: '12px',
            fontWeight: 700
          }}>
            DANIELLE
          </h1>
          <p style={{
            color: '#A51C30',
            fontSize: '24px',
            margin: '0 0 50px',
            letterSpacing: '6px',
            fontWeight: 500
          }}>
            LUXURY JEWELRY • EST. 2025
          </p>

          <p style={{
            color: '#444',
            fontSize: '13px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            © 2025 DANIELLE Jewelry. All rights reserved. Handcrafted in Vietnam with love.
          </p>
        </div>
      </div>
    </footer>
  );
}