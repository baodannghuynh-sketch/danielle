// src/pages/Handcrafted.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

// Dữ liệu mẫu (sau này lấy từ Supabase)
const masterpieces = [
  { id: 9, name: "Eternal Love Ring", price: 298000000, img: "https://images.unsplash.com/photo-1583212292447-97e9d46d96e9?w=1200&q=90" },
  { id: 10, name: "Heritage Diamond Necklace", price: 388000000, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90" },
  { id: 11, name: "Royal Drop Earrings", price: 188000000, img: "https://images.unsplash.com/photo-1591637347783-0e31d46b9996?w=1200&q=90" },
  { id: 12, name: "Masterpiece Bracelet", price: 268000000, img: "https://images.unsplash.com/photo-1611591437281-46027f0e2e0e?w=1200&q=90" },
  { id: 13, name: "Empress Crown Tiara", price: 980000000, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&q=90" },
  { id: 14, name: "Phoenix Rising Pendant", price: 588000000, img: "https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1200&q=90" },
];

export default function Handcrafted() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Video background nhẹ (tùy chọn bật) */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1,
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1920&q=80") center/cover no-repeat',
        backgroundAttachment: 'fixed',
        filter: 'brightness(0.6)'
      }} />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '180px 5vw 120px',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(165,28,48,0.15) 0%, transparent 70%)'
      }}>
        <h1 style={{
          fontSize: '96px',
          fontWeight: '300',
          letterSpacing: '24px',
          margin: '0 0 40px',
          fontFamily: '"Playfair Display", serif',
          background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 10px 30px rgba(0,0,0,0.6)',
          animation: 'glow 4s ease-in-out infinite alternate'
        }}>
          HANDCRAFTED
        </h1>
        <p style={{
          fontSize: '28px',
          maxWidth: '1000px',
          margin: '0 auto 60px',
          lineHeight: '1.8',
          opacity: 0.95,
          fontWeight: '300',
          letterSpacing: '2px'
        }}>
          Mỗi tuyệt tác là một câu chuyện – được chế tác hoàn toàn bằng tay bởi những bậc thầy kim hoàn thế giới, 
          chỉ dành riêng cho những người trân trọng vẻ đẹp vĩnh cửu.
        </p>
        <div style={{
          height: '4px',
          width: '240px',
          background: 'linear-gradient(90deg, transparent, #A51C30, transparent)',
          margin: '0 auto 80px',
          boxShadow: '0 0 30px #A51C30'
        }} />
      </section>

      {/* Gallery Masterpieces */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1800px',
        margin: '0 auto',
        padding: '0 5vw 180px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '80px',
        alignItems: 'start'
      }}>
        {masterpieces.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: hoveredId === item.id ? '0 40px 100px rgba(165,28,48,0.4)' : '0 20px 60px rgba(0,0,0,0.5)',
                transform: hoveredId === item.id ? 'translateY(-30px) scale(1.03)' : 'translateY(0) scale(1)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Ảnh + hiệu ứng zoom */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '680px',
                    objectFit: 'cover',
                    transition: 'transform 1.4s ease',
                    transform: hoveredId === item.id ? 'scale(1.15)' : 'scale(1)',
                    filter: hoveredId === item.id ? 'brightness(1.1)' : 'brightness(0.85)'
                  }}
                />

                {/* Overlay đỏ rượu vang + logo nhỏ */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: hoveredId === item.id 
                    ? 'linear-gradient(135deg, rgba(165,28,48,0.4) 0%, rgba(165,28,48,0.1) 100%)' 
                    : 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  transition: 'all 0.8s ease'
                }} />

                {/* Badge "Masterpiece" */}
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  left: '30px',
                  background: '#A51C30',
                  color: 'white',
                  padding: '12px 28px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  letterSpacing: '3px',
                  boxShadow: '0 10px 30px rgba(165,28,48,0.5)',
                  opacity: hoveredId === item.id ? 1 : 0,
                  transform: hoveredId === item.id ? 'translateY(0)' : 'translateY(-20px)',
                  transition: 'all 0.6s ease'
                }}>
                  MASTERPIECE
                </div>
              </div>

              {/* Thông tin */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '80px 40px 50px',
                background: 'linear-gradient(transparent, black)',
                textAlign: 'center',
                transform: hoveredId === item.id ? 'translateY(-20px)' : 'translateY(0)',
                transition: 'all 0.8s ease'
              }}>
                <h3 style={{
                  fontSize: '32px',
                  margin: '0 0 16px',
                  letterSpacing: '6px',
                  fontWeight: '400',
                  fontFamily: '"Playfair Display", serif',
                  textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                }}>
                  {item.name.toUpperCase()}
                </h3>
                <p style={{
                  fontSize: '28px',
                  color: '#A51C30',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  margin: '0',
                  textShadow: '0 4px 15px rgba(0,0,0,0.7)'
                }}>
                  {item.price.toLocaleString()} ₫
                </p>

                {/* Nút xem chi tiết */}
                <div style={{
                  marginTop: '30px',
                  opacity: hoveredId === item.id ? 1 : 0,
                  transform: hoveredId === item.id ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease 0.2s'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '16px 50px',
                    background: '#A51C30',
                    color: 'white',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    letterSpacing: '3px',
                    boxShadow: '0 15px 40px rgba(165,28,48,0.5)',
                    transition: 'all 0.4s ease'
                  }}
                  onMouseEnter={e => e.target.style.background = '#c51c35'}
                  onMouseLeave={e => e.target.style.background = '#A51C30'}
                  >
                    XEM CHI TIẾT
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Footer quote */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '120px 5vw',
        background: 'rgba(0,0,0,0.8)',
        borderTop: '1px solid #333'
      }}>
        <p style={{
          fontSize: '36px',
          fontStyle: 'italic',
          maxWidth: '1000px',
          margin: '0 auto',
          lineHeight: '1.8',
          color: '#ccc',
          fontWeight: '300'
        }}>
          “Không chỉ là trang sức – đó là di sản được truyền lại qua nhiều thế hệ.”
        </p>
        <p style={{
          marginTop: '30px',
          color: '#A51C30',
          fontSize: '20px',
          letterSpacing: '4px'
        }}>
          — DANIELLE Heritage Collection
        </p>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes glow {
          from { filter: brightness(1) drop-shadow(0 0 20px #A51C30); }
          to { filter: brightness(1.3) drop-shadow(0 0 40px #A51C30); }
        }
      `}</style>
    </div>
  );
}