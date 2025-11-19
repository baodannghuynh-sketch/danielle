// src/components/Footer.jsx
export default function Footer() {
  return (
    <>
      {/* Phần full width đen tuyền - dính 2 bên như Navbar */}
      <div style={{
        backgroundColor: '#000',
        marginTop: '150px',
        paddingTop: '100px',
        paddingBottom: '50px',
        fontFamily: 'Georgia, serif',
      }}>
        {/* Container giới hạn nội dung (giống Navbar) */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 5vw',  // giống như Navbar: 0 20px → nhưng responsive hơn
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* 3 cột */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '80px',
            marginBottom: '80px',
            color: '#999'
          }}>
            {/* Cột 1 */}
            <div>
              <h3 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '25px', fontSize: '15px' }}>
                Security & Brand
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.4', fontSize: '14px' }}>
                <li><a href="#" style={linkStyle}>Report Copyright Infringement</a></li>
                <li><a href="#" style={linkStyle}>Report Security Issue</a></li>
                <li><a href="#" style={linkStyle}>Trademark Notice</a></li>
              </ul>
            </div>

            {/* Cột 2 */}
            <div>
              <h3 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '25px', fontSize: '15px' }}>
                Website
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.4', fontSize: '14px' }}>
                <li><a href="#" style={linkStyle}>Accessibility</a></li>
                <li><a href="#" style={linkStyle}>Digital Accessibility</a></li>
                <li><a href="#" style={linkStyle}>Privacy Statement</a></li>
              </ul>
            </div>

            {/* Cột 3 */}
            <div>
              <h3 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '25px', fontSize: '15px' }}>
                Get In Touch
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.4', fontSize: '14px' }}>
                <li><a href="#" style={linkStyle}>Contact Danielle</a></li>
                <li><a href="#" style={linkStyle}>Maps & Directions</a></li>
                <li><a href="#" style={linkStyle}>Jobs</a></li>
              </ul>
            </div>
          </div>

          {/* Logo + Copyright */}
          <div style={{
            borderTop: '1px solid #333',
            paddingTop: '50px',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '52px', color: 'white', margin: '0 0 10px', letterSpacing: '8px' }}>
              DANIELLE
            </h1>
            <p style={{ color: '#A51C30', fontSize: '22px', margin: '0 0 40px', letterSpacing: '3px' }}>
              LUXURY JEWELRY
            </p>

            <div style={{ fontSize: '42px', marginBottom: '40px' }}>
              <a href="#" style={{ color: 'white', margin: '0 20px' }}>Instagram</a>
              <a href="#" style={{ color: 'white', margin: '0 20px' }}>TikTok</a>
              <a href="#" style={{ color: 'white', margin: '0 20px' }}>LinkedIn</a>
              <a href="#" style={{ color: 'white', margin: '0 20px' }}>Facebook</a>
              <a href="#" style={{ color: 'white', margin: '0 20px' }}>YouTube</a>
            </div>

            <p style={{ color: '#555', fontSize: '13px' }}>
              Copyright © 2025 DANIELLE Jewelry. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Style chung cho link (tái sử dụng)
const linkStyle = {
  color: '#999',
  textDecoration: 'none',
  transition: 'color 0.4s ease'
}