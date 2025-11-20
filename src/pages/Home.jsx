// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dữ liệu mẫu – sau này lấy từ Supabase
  const featuredProducts = [
    { id: 1, name: "Solitaire Eternal", price: 168000000, image_url: "https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1200&q=90", category: "Nhẫn cưới" },
    { id: 2, name: "La Rose Éternelle", price: 298000000, image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=90", category: "Vòng cổ" },
    { id: 3, name: "Imperial Crown", price: 588000000, image_url: "https://images.unsplash.com/photo-1583212292447-97e9d46d96e9?w=1200&q=90", category: "Thủ công tinh xảo" },
    { id: 4, name: "Midnight Sapphire", price: 238000000, image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90", category: "Nhẫn nam" },
  ];

  return (
    <div style={{ overflowX: 'hidden', background: '#000', color: '#fff' }}>
      {/* HERO SIÊU PHẨM – ĐẸP ĐẾN NGẠT THỞ */}
      <section style={{
        height: '100vh',
        minHeight: '800px',
        position: 'relative',
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1605100804764-5081959e1416?w=3270&q=90") center/cover no-repeat`,
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(165,28,48,0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.3s ease-out'
        }}>
          <h1 style={{
            fontSize: '140px',
            fontWeight: '300',
            letterSpacing: '32px',
            margin: '0 0 30px',
            fontFamily: '"Playfair Display", serif',
            background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 20px 40px rgba(0,0,0,0.6)',
            animation: 'glow 6s ease-in-out infinite alternate'
          }}>
            DANIELLE
          </h1>
          <p style={{
            fontSize: '32px',
            letterSpacing: '12px',
            margin: '0 0 60px',
            fontWeight: '300',
            opacity: 0.95,
            fontFamily: '"Cormorant Garamond", serif'
          }}>
            THE ART OF ETERNAL BEAUTY
          </p>
          <Link to="/shop" style={{
            padding: '24px 90px',
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
          onMouseEnter={e => {
            e.target.style.background = '#c51c35';
            e.target.style.transform = 'translateY(-6px)';
          }}
          onMouseLeave={e => {
            e.target.style.background = '#A51C30';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            KHÁM PHÁ NGAY
          </Link>
        </div>
      </section>

      {/* 3 Ô ĐIỀU HƯỚNG SIÊU SANG */}
      <section style={{ padding: '180px 8%', background: '#000', position: 'relative' }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '60px'
        }}>
          {[
            { to: "/women", title: "TRANG SỨC NỮ", desc: "Tinh tế • Thanh lịch • Vĩnh cửu", icon: "Female" },
            { to: "/men", title: "TRANG SỨC NAM", desc: "Mạnh mẽ • Tối giản • Quyền lực", icon: "Male" },
            { to: "/handcrafted", title: "THỦ CÔNG TINH XẢO", desc: "Mỗi món là một tuyệt tác nghệ thuật", icon: "Diamond", highlight: true }
          ].map((item, i) => (
            <Link key={i} to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                position: 'relative',
                height: '600px',
                borderRadius: '40px',
                overflow: 'hidden',
                background: item.highlight ? 'linear-gradient(135deg, #A51C30, #8f1729)' : '#111',
                boxShadow: item.highlight ? '0 40px 100px rgba(165,28,48,0.6)' : '0 20px 60px rgba(0,0,0,0.5)',
                transition: 'all 0.8s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-30px) scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
              >
                <div style={{ padding: '80px 50px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '120px', marginBottom: '30px' }}>{item.icon}</div>
                  <h3 style={{
                    fontSize: '48px',
                    letterSpacing: '10px',
                    margin: '0 0 20px',
                    fontWeight: item.highlight ? '600' : '400'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '22px', opacity: 0.9, lineHeight: '1.8', margin: '0 0 40px' }}>
                    {item.desc}
                  </p>
                  <span style={{
                    color: item.highlight ? '#fff' : '#A51C30',
                    fontWeight: 'bold',
                    letterSpacing: '4px',
                    fontSize: '18px',
                    borderBottom: `3px solid ${item.highlight ? '#fff' : '#A51C30'}`,
                    paddingBottom: '10px'
                  }}>
                    KHÁM PHÁ
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SẢN PHẨM NỔI BẬT – DÙNG PRODUCTCARD ĐỈNH CAO */}
      <section style={{ padding: '180px 8%', background: '#000' }}>
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
          <h2 style={{
            fontSize: '80px',
            fontFamily: '"Playfair Display", serif',
            background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '8px',
            margin: '0 0 30px'
          }}>
            TUYỆT TÁC NỔI BẬT
          </h2>
          <p style={{ fontSize: '24px', opacity: 0.8, letterSpacing: '3px' }}>
            Được yêu thích nhất • Đỉnh cao thủ công
          </p>
        </div>

        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '60px'
        }}>
          {featuredProducts.map(product => (
            <div key={product.id} style={{ transform: 'translateY(50px)', opacity: 0, animation: 'fadeUp 1s forwards' }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA – ĐỎ RƯỢU VANG SIÊU ẤN TƯỢNG */}
      <section style={{
        padding: '200px 8%',
        background: 'linear-gradient(135deg, #A51C30 0%, #8f1729 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'url("https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1920&q=80") center/cover',
          opacity: 0.15,
          mixBlendMode: 'overlay'
        }} />
        
        <h2 style={{
          fontSize: '100px',
          fontWeight: '300',
          letterSpacing: '20px',
          margin: '0 0 40px',
          fontFamily: '"Playfair Display", serif'
        }}>
          YOUR LEGACY BEGINS HERE
        </h2>
        <p style={{
          fontSize: '32px',
          maxWidth: '1000px',
          margin: '0 auto 70px',
          opacity: 0.95,
          lineHeight: '1.8',
          fontWeight: '300'
        }}>
          Sở hữu một tuyệt tác Danielle – không chỉ là trang sức, mà là di sản vĩnh cửu.
        </p>
        <Link to="/shop" style={{
          padding: '28px 100px',
          background: '#fff',
          color: '#A51C30',
          fontSize: '24px',
          fontWeight: 'bold',
          letterSpacing: '8px',
          textDecoration: 'none',
          borderRadius: '50px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          transition: 'all 0.5s ease'
        }}
        onMouseEnter={e => e.target.style.transform = 'translateY(-8px)'}
        onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
        >
          BẮT ĐẦU NGAY
        </Link>
      </section>

      <style jsx>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 20px #A51C30); }
          to { filter: drop-shadow(0 0 60px #A51C30); }
        }
        @keyframes fadeUp {
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}