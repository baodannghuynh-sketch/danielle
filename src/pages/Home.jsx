// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const isDesktop = window.innerWidth > 1024;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredProducts = [
    { id: 1, name: "Solitaire Eternal", price: 168000000, image_url: "https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1600&q=70", category: "Nhẫn cưới" },
    { id: 2, name: "La Rose Éternelle", price: 298000000, image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=70", category: "Vòng cổ" },
    { id: 3, name: "Imperial Crown", price: 588000000, image_url: "https://images.unsplash.com/photo-1583212292447-97e9d46d96e9?w=1600&q=70", category: "Thủ công tinh xảo" },
    { id: 4, name: "Midnight Sapphire", price: 238000000, image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=70", category: "Nhẫn nam" },
  ];

  return (
    <div style={{ overflowX: 'hidden', background: '#000', color: '#fff' }}>
      
      {/* ======== HERO ======== */}
      <section style={{
        height: '100vh',
        minHeight: '800px',
        position: 'relative',
        background: `
          linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)),
          url("https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1600&q=70")
          center/cover no-repeat
        `,
        backgroundAttachment: isDesktop ? "fixed" : "scroll",
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
          transition: 'transform 0.28s ease-out'
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
            transition: 'all 0.5s ease'
          }}>
            KHÁM PHÁ NGAY
          </Link>
        </div>
      </section>


      {/* ======== FEATURED PRODUCTS ======== */}
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
          {featuredProducts.map((product, i) => (
            <div 
              key={product.id}
              style={{
                opacity: 0,
                transform: 'translateY(40px)',
                animation: `fadeUp 1s forwards`,
                animationDelay: `${i * 0.15}s`
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>


      {/* ======== GLOBAL EFFECTS ======== */}
      <style jsx>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 20px #A51C30); }
          to { filter: drop-shadow(0 0 60px #A51C30); }
        }
        @keyframes fadeUp {
          to { transform: translateY(0); opacity:1; }
        }
      `}</style>
    </div>
  );
}
