// src/pages/Women.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const womenCollection = [
  { id: 101, name: "Eternal Solitaire 2.5ct", price: 398000000, img: "https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1400&q=90", material: "Vàng trắng 18K • Kim cương GIA" },
  { id: 102, name: "Perle de Lune Necklace", price: 189000000, img: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1400&q=90", material: "Ngọc trai Nam Hải • Vàng hồng" },
  { id: 103, name: "Tennis Diamond Bracelet", price: 248000000, img: "https://images.unsplash.com/photo-1611926653458-09294b3142b6?w=1400&q=90", material: "288 viên kim cương • Vàng 18K" },
  { id: 104, name: "Rose de Danielle Ring", price: 168000000, img: "https://images.unsplash.com/photo-1600002223724-58e9b3f3e5b3?w=1400&q=90", material: "Vàng hồng • Kim cương hồng tự nhiên" },
  { id: 105, name: "Éclat Diamond Earrings", price: 298000000, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=90", material: "Kim cương tổng 12ct" },
  { id: 106, name: "Infinity Love Set", price: 688000000, img: "https://images.unsplash.com/photo-1611591437281-46027f0e2e0e?w=1400&q=90", material: "Platinum • Bộ sưu tập giới hạn" },
];

export default function Women() {
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', overflow: 'hidden' }}>
      {/* HERO NỮ TÍNH – HỒNG VÀNG + ĐEN SANG TRỌNG */}
      <section style={{
        height: '100vh',
        minHeight: '900px',
        background: `linear-gradient(135deg, rgba(165,28,48,0.6) 0%, rgba(0,0,0,0.95) 70%), url("https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=3270&q=90") center/cover no-repeat fixed`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(255,192,203,0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{
            fontSize: '180px',
            fontWeight: '300',
            letterSpacing: '28px',
            margin: '0 0 40px',
            fontFamily: '"Playfair Display", serif',
            background: 'linear-gradient(90deg, #ffc0cb, #fff, #ffc0cb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 30px 80px rgba(0,0,0,0.7)',
            animation: 'gentleGlow 6s ease-in-out infinite alternate'
          }}>
            GODDESS
          </h1>
          <p style={{
            fontSize: '36px',
            letterSpacing: '16px',
            margin: '0 0 70px',
            opacity: 0.95,
            fontWeight: '300',
            fontStyle: 'italic'
          }}>
            BEAUTY • GRACE • ETERNITY
          </p>
          <Link to="/shop?gender=women" style={{
            padding: '26px 90px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            fontSize: '22px',
            fontWeight: 'bold',
            letterSpacing: '8px',
            textDecoration: 'none',
            borderRadius: '60px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            transition: 'all 0.6s ease',
            display: 'inline-block'
          }}
          onMouseEnter={e => {
            e.target.style.background = '#ffc0cb';
            e.target.style.color = '#000';
            e.target.style.border = '2px solid #ffc0cb';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(255,255,255,0.15)';
            e.target.style.color = 'white';
            e.target.style.border = '2px solid rgba(255,255,255,0.3)';
          }}
          >
            KHÁM PHÁ BỘ SƯU TẬP
          </Link>
        </div>
      </section>

      {/* Women's Collection Grid – Sang trọng + nữ tính cực mạnh */}
      <section style={{ padding: '200px 8%', background: '#000' }}>
        <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '140px' }}>
            <h2 style={{
              fontSize: '100px',
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '12px',
              margin: '0 0 40px',
              background: 'linear-gradient(90deg, #ffc0cb, #fff, #ffc0cb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              WOMEN'S COLLECTION
            </h2>
            <p style={{ fontSize: '26px', color: '#ccc', letterSpacing: '5px', fontStyle: 'italic' }}>
              MỖI MÓN TRANG SỨC LÀ MỘT LỜI TỎ TÌNH VĨNH CỬU
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '100px'
          }}>
            {womenCollection.map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  borderRadius: '40px',
                  overflow: 'hidden',
                  background: '#111',
                  boxShadow: hoveredId === item.id ? '0 50px 120px rgba(255,192,203,0.3)' : '0 25px 80px rgba(0,0,0,0.6)',
                  transform: hoveredId === item.id ? 'translateY(-40px) scale(1.03)' : 'translateY(0)',
                  transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
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
                        height: '680px',
                        objectFit: 'cover',
                        transition: 'transform 1.5s ease',
                        transform: hoveredId === item.id ? 'scale(1.18)' : 'scale(1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: hoveredId === item.id 
                        ? 'linear-gradient(135deg, rgba(255,192,203,0.35), rgba(0,0,0,0.8))' 
                        : 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      transition: 'all 1s ease'
                    }} />
                  </div>

                  <div style={{
                    padding: '60px 50px',
                    textAlign: 'center',
                    background: 'linear-gradient(transparent, #000)'
                  }}>
                    <h3 style={{
                      fontSize: '36px',
                      margin: '0 0 20px',
                      letterSpacing: '8px',
                      fontWeight: '400',
                      fontFamily: '"Playfair Display", serif'
                    }}>
                      {item.name.toUpperCase()}
                    </h3>
                    <p style={{ color: '#aaa', fontSize: '17px', margin: '0 0 24px', letterSpacing: '3px', fontStyle: 'italic' }}>
                      {item.material}
                    </p>
                    <p style={{
                      fontSize: '34px',
                      color: '#ffc0cb',
                      fontWeight: 'bold',
                      margin: '0 0 40px'
                    }}>
                      {item.price.toLocaleString()} ₫
                    </p>

                    <div style={{
                      opacity: hoveredId === item.id ? 1 : 0,
                      transform: hoveredId === item.id ? 'translateY(0)' : 'translateY(30px)',
                      transition: 'all 0.8s ease 0.3s'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '18px 60px',
                        background: 'rgba(255,192,203,0.2)',
                        border: '2px solid #ffc0cb',
                        color: '#ffc0cb',
                        borderRadius: '60px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        letterSpacing: '4px',
                        backdropFilter: 'blur(10px)'
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

    </div>
  );
}