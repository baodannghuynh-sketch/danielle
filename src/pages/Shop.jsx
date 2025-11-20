// src/pages/Shop.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseclient';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

// Mock data siêu đẹp – luôn hiển thị ngay cả khi chưa có data thật
const mockProducts = [
  { id: 1, name: "Eternal Solitaire Ring", price: 298000000, image_url: "https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1200&q=90", category: "women", material: "Vàng trắng 18K • Kim cương 2.5ct" },
  { id: 2, name: "Cuban Link Heavy Chain", price: 89000000, image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=90", category: "men", material: "Vàng 18K • 85g" },
  { id: 3, name: "Tennis Diamond Earrings", price: 168000000, image_url: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200&q=90", category: "women", material: "Kim cương tổng 8ct" },
  { id: 4, name: "Titan Black Edition", price: 45800000, image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90", category: "men", material: "Titan phủ PVD đen" },
  { id: 5, name: "Heritage Platinum Wedding", price: 488000000, image_url: "https://images.unsplash.com/photo-1600002223724-58e9b3f3e5b3?w=1200&q=90", category: "handcrafted", material: "Platinum 950 • Kim cương GIA" },
  { id: 6, name: "Masterpiece Diamond Bracelet", price: 388000000, image_url: "https://images.unsplash.com/photo-1611926653458-09294b3142b6?w=1200&q=90", category: "handcrafted", material: "Vàng hồng • 312 viên kim cương" },
  { id: 7, name: "Royal Signet Ring", price: 128000000, image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90", category: "men", material: "Vàng trắng 18K • Onyx tự nhiên" },
  { id: 8, name: "Pearl & Diamond Necklace", price: 218000000, image_url: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200&q=90", category: "women", material: "Ngọc trai Nam Hải • Kim cương" },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Removed unused fetchProducts function to resolve lint error.

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Lỗi:', error);
        setProducts(mockProducts);
      } else {
        setProducts(data && data.length > 0 ? data : mockProducts);
      }
      setLoading(false);
    };

    const fetchAndScroll = async () => {
      await fetchProducts();
      window.scrollTo(0, 0);
    };
    fetchAndScroll();
  }, []);

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const categories = [
    { key: 'all', icon: 'Sparkles' },
    { key: 'women', icon: 'Female' },
    { key: 'men', icon: 'Male' },
    { key: 'handcrafted', icon: 'Diamond', highlight: true }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', overflow: 'hidden' }}>
      {/* HERO SIÊU PHẨM */}
      <section style={{
        height: '100vh',
        minHeight: '800px',
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=3270&q=90") center/cover no-repeat fixed`,
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
            fontSize: '160px',
            fontWeight: '300',
            letterSpacing: '36px',
            margin: '0 0 40px',
            fontFamily: '"Playfair Display", serif',
            background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 30px 60px rgba(0,0,0,0.8)',
            animation: 'glow 6s ease-in-out infinite alternate'
          }}>
            SHOP
          </h1>
          <p style={{
            fontSize: '34px',
            letterSpacing: '14px',
            margin: '0 0 60px',
            opacity: 0.95,
            fontWeight: '300'
          }}>
            THE ART OF ETERNAL LUXURY
          </p>
          <div style={{ height: '3px', width: '200px', background: '#A51C30', margin: '0 auto', boxShadow: '0 0 40px #A51C30' }}></div>
        </div>
      </section>

      {/* FILTER BAR SIÊU SANG */}
      <div style={{ padding: '140px 8% 100px', background: '#000', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            gap: '20px',
            padding: '20px 50px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '80px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 0 40px rgba(165,28,48,0.1)'
          }}>
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                // Remove onMouseEnter if setHoveredFilter is not defined, or define it above if needed
                style={{
                  position: 'relative',
                  padding: '20px 50px',
                  background: filter === cat.key ? (cat.highlight ? '#A51C30' : '#fff') : 'transparent',
                  color: filter === cat.key ? (cat.highlight ? '#fff' : '#000') : '#fff',
                  border: 'none',
                  borderRadius: '60px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  letterSpacing: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.6s ease',
                  overflow: 'hidden',
                  boxShadow: filter === cat.key ? '0 15px 40px rgba(165,28,48,0.5)' : 'none'
                }}
              >
                <span style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{cat.icon}</span>
                  {cat.label}
                </span>
                {cat.highlight && filter === cat.key && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(45deg, #A51C30, #c51c35)',
                    borderRadius: '60px'
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID SẢN PHẨM */}
      <section style={{ padding: '0 8% 200px', background: '#000' }}>
        <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '200px 20px' }}>
              <p style={{ fontSize: '36px', color: '#A51C30', letterSpacing: '4px' }}>
                Đang tải những tuyệt tác...
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
              gap: '90px'
            }}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    opacity: 0,
                    transform: 'translateY(60px)',
                    animation: 'fadeUp 0.8s ease forwards',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '200px 20px', color: '#666' }}>
              <p style={{ fontSize: '40px', marginBottom: '40px', letterSpacing: '3px' }}>
                Bộ sưu tập đang được chế tác
              </p>
              <Link to="/" style={{
                color: '#A51C30',
                fontSize: '22px',
                fontWeight: 'bold',
                textDecoration: 'none',
                borderBottom: '3px solid #A51C30',
                paddingBottom: '10px'
              }}>
                ← Quay về trang chủ
              </Link>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 30px #A51C30); }
          to { filter: drop-shadow(0 0 80px #A51C30); }
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}