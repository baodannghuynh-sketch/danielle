// src/pages/Men.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';


// Dữ liệu mẫu – sau này lấy từ Supabase
const menCollection = [
  { id: 101, name: "Titan Black Edition", price: 28900000, img: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200&q=90", material: "Titan phủ PVD đen" },
  { id: 102, name: "Signet 18K Gold", price: 42500000, img: "https://images.unsplash.com/photo-1600002223724-58e9b3f3e5b3?w=1200&q=90", material: "Vàng 18K nguyên khối" },
  { id: 103, name: "Cuban Link Heavy", price: 68000000, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=90", material: "Vàng trắng 18K" },
  { id: 104, name: "Sterling Silver 925", price: 18800000, img: "https://images.unsplash.com/photo-1591370862777-2d4e5e5e8c2c?w=1200&q=90", material: "Bạc Ý 925 cao cấp" },
  { id: 105, name: "Onyx Royal Ring", price: 52800000, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90", material: "Vàng hồng + Đá Onyx" },
  { id: 106, name: "Carbon Fiber Bracelet", price: 35800000, img: "https://images.unsplash.com/photo-1611926653458-09294b3142b6?w=1200&q=90", material: "Carbon Fiber + Titan" },
];

export default function Men() {
  const [hoveredId, setHoveredId] = useState(null);
  useCartStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', overflow: 'hidden' }}>
      {/* HERO NAM TÍNH – ĐEN BÓNG + ĐỎ RƯỢU VANG */}
      <section style={{
        height: '100vh',
        minHeight: '800px',
        background: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=3270&q=90") center/cover no-repeat`,
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(165,28,48,0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{
            fontSize: '140px',
            fontWeight: '700',
            letterSpacing: '20px',
            margin: '0 0 30px',
            fontFamily: '"Oswald", sans-serif',
            background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 20px 40px rgba(0,0,0,0.8)',
            animation: 'pulse 4s ease-in-out infinite'
          }}>
            GENTLEMAN
          </h1>
          <p style={{
            fontSize: '32px',
            letterSpacing: '12px',
            margin: '0 0 60px',
            opacity: 0.9,
            fontWeight: '300'
          }}>
            POWER • ELEGANCE • LEGACY
          </p>
          <Link to="/shop?gender=men" style={{
            padding: '22px 80px',
            background: '#A51C30',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            letterSpacing: '6px',
            textDecoration: 'none',
            borderRadius: '50px',
            boxShadow: '0 20px 50px rgba(165,28,48,0.5)',
            transition: 'all 0.5s ease',
            display: 'inline-block'
          }}
          onMouseEnter={e => e.target.style.background = '#c51c35'}
          onMouseLeave={e => e.target.style.background = '#A51C30'}
          >
            XEM BỘ SƯU TẬP
          </Link>
        </div>
      </section>

      {/* Collection Grid – Đen bóng + hiệu ứng hover siêu nam tính */}
      <section style={{ padding: '180px 8%', background: '#000' }}>
        <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '120px' }}>
            <h2 style={{
              fontSize: '88px',
              fontFamily: '"Oswald", sans-serif',
              letterSpacing: '10px',
              margin: '0 0 30px',
              background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MEN'S COLLECTION
            </h2>
            <p style={{ fontSize: '24px', color: '#aaa', letterSpacing: '4px' }}>
              ĐƯỢC THIẾT KẾ CHO NHỮNG NGƯỜI ĐÀN ÔNG BIẾT GIÁ TRỊ CỦA CHÍNH MÌNH
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '80px'
          }}>
            {menCollection.map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: hoveredId === item.id ? '0 40px 100px rgba(165,28,48,0.4)' : '0 20px 60px rgba(0,0,0,0.5)',
                  transform: hoveredId === item.id ? 'translateY(-30px) scale(1.03)' : 'translateY(0)',
                  transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '620px',
                        objectFit: 'cover',
                        transition: 'transform 1.2s ease',
                        transform: hoveredId === item.id ? 'scale(1.15)' : 'scale(1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: hoveredId === item.id 
                        ? 'linear-gradient(135deg, rgba(165,28,48,0.4), rgba(0,0,0,0.7))' 
                        : 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      transition: 'all 0.8s ease'
                    }} />
                  </div>

                  <div style={{
                    padding: '50px 40px',
                    textAlign: 'center',
                    background: 'linear-gradient(transparent, #000)',
                    position: 'relative'
                  }}>
                    <h3 style={{
                      fontSize: '32px',
                      margin: '0 0 16px',
                      letterSpacing: '6px',
                      fontWeight: '600',
                      fontFamily: '"Oswald", sans-serif'
                    }}>
                      {item.name.toUpperCase()}
                    </h3>
                    <p style={{ color: '#888', fontSize: '16px', margin: '0 0 20px', letterSpacing: '2px' }}>
                      {item.material}
                    </p>
                    <p style={{
                      fontSize: '30px',
                      color: '#A51C30',
                      fontWeight: 'bold',
                      margin: '0 0 30px'
                    }}>
                      {item.price.toLocaleString()} ₫
                    </p>

                    <div style={{
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
                        letterSpacing: '3px'
                      }}>
                        XEM CHI TIẾT
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA – Nam tính cực mạnh */}
      <section style={{
        padding: '200px 8%',
        background: 'linear-gradient(135deg, #111 0%, #000 100%)',
        textAlign: 'center',
        borderTop: '1px solid #333'
      }}>
        <h2 style={{
          fontSize: '100px',
          fontFamily: '"Oswald", sans-serif',
          letterSpacing: '15px',
          margin: '0 0 40px',
          background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          LEGACY IS ETERNAL
        </h2>
        <p style={{
          fontSize: '28px',
          maxWidth: '900px',
          margin: '0 auto 60px',
          color: '#aaa',
          lineHeight: '1.8'
        }}>
          Một người đàn ông không chỉ được định nghĩa bởi những gì anh ấy mặc –  
          mà bởi những tuyệt tác anh ấy đeo.
        </p>
        <Link to="/shop?gender=men" style={{
          padding: '26px 100px',
          background: '#A51C30',
          color: 'white',
          fontSize: '22px',
          fontWeight: 'bold',
          letterSpacing: '8px',
          textDecoration: 'none',
          borderRadius: '50px',
          boxShadow: '0 25px 60px rgba(165,28,48,0.5)',
          transition: 'all 0.5s ease'
        }}>
          KHÁM PHÁ NGAY
        </Link>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}