// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useCartStore } from '../store/useCartStore'; // Import store giỏ hàng

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const addItem = useCartStore(state => state.addItem);

  // Lưu giá trị Date.now() một lần khi component mount
  const [now] = useState(() => Date.now());

  // Xử lý ảnh
  const images = Array.isArray(product.image_url) 
    ? product.image_url.filter(Boolean) 
    : [product.image_url || product.image].filter(Boolean);

  const currentImage = images[imgIndex] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80';

  // Badge

  // Tính toán isNew trong useMemo để tránh gọi hàm impure trong render
  const isNew = useMemo(() => {
    if (product.is_new) return true;
    if (product.created_at) {
      return (now - new Date(product.created_at)) < 7 * 24 * 60 * 60 * 1000;
    }
    return false;
  }, [product.is_new, product.created_at, now]);

  const isSoldOut = !product.in_stock;
  const isLimited = product.stock_quantity && product.stock_quantity <= 3;

  return (
    <div 
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: hovered ? '0 30px 70px rgba(165, 28, 48, 0.18)' : '0 10px 40px rgba(0,0,0,0.08)',
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        transform: hovered ? 'translateY(-20px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setImgIndex(0);
      }}
      onMouseMove={() => {
        if (images.length > 1 && hovered) {
          setImgIndex(prev => (prev + 1) % images.length);
        }
      }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Ảnh + Overlay */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={currentImage}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '440px',
              objectFit: 'cover',
              transition: 'transform 1.2s ease',
              transform: hovered ? 'scale(1.12)' : 'scale(1)',
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80';
            }}
          />

          {/* Overlay đỏ rượu vang */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(165,28,48,0.15) 0%, rgba(165,28,48,0.35) 100%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }} />

          {/* Badge */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10 }}>
            {isNew && (
              <span style={badgeStyle('#A51C30', 'NEW ARRIVAL')}>
                NEW
              </span>
            )}
            {isLimited && !isSoldOut && (
              <span style={badgeStyle('#ff4444', 'LIMITED')}>
                Chỉ còn {product.stock_quantity}
              </span>
            )}
            {isSoldOut && (
              <span style={badgeStyle('#000', 'SOLD OUT')}>
                Hết hàng
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            disabled={isSoldOut}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              padding: '14px 32px',
              background: isSoldOut ? '#999' : '#A51C30',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '14px',
              letterSpacing: '2px',
              cursor: isSoldOut ? 'not-allowed' : 'pointer',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
              transition: 'all 0.5s ease',
              boxShadow: '0 10px 30px rgba(165,28,48,0.4)',
            }}
          >
            {isSoldOut ? 'HẾT HÀNG' : 'THÊM NHANH'}
          </button>
        </div>

        {/* Thông tin */}
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          {product.category && (
            <p style={{
              color: '#A51C30',
              fontSize: '13px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              margin: '0 0 12px',
              fontWeight: 600
            }}>
              {product.category}
            </p>
          )}

          <h3 style={{
            fontSize: '23px',
            margin: '0 0 16px',
            letterSpacing: '1.5px',
            color: '#111',
            fontFamily: '"Playfair Display", serif',
            fontWeight: 500
          }}>
            {product.name}
          </h3>

          <p style={{
            color: '#A51C30',
            fontSize: '26px',
            fontWeight: 'bold',
            margin: '12px 0',
            letterSpacing: '1px'
          }}>
            {product.price.toLocaleString('vi-VN')} ₫
          </p>

          {product.old_price && (
            <p style={{
              color: '#999',
              fontSize: '16px',
              textDecoration: 'line-through',
              margin: '4px 0 0'
            }}>
              {product.old_price.toLocaleString('vi-VN')} ₫
            </p>
          )}

          <div style={{
            marginTop: '20px',
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: hovered ? '#A51C30' : '#666',
            transition: 'color 0.4s ease',
            textTransform: 'uppercase'
          }}>
            Xem chi tiết
          </div>
        </div>
      </Link>
    </div>
  );
}

// Style badge tái sử dụng
const badgeStyle = (bg) => ({
  background: bg,
  color: 'white',
  padding: '8px 18px',
  borderRadius: '30px',
  fontSize: '11px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  display: 'inline-block'
});