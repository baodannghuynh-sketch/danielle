// src/components/ProductCard.jsx
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        transition: 'all 0.5s ease',
        background: '#fff'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-12px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1605100804764-5081959e1416?w=800'} 
          alt={product.name}
          style={{ width: '100%', height: '380px', objectFit: 'cover' }}
        />
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', margin: '0 0 12px', letterSpacing: '2px', color: '#111' }}>
            {product.name}
          </h3>
          <p style={{ color: '#A51C30', fontSize: '22px', fontWeight: 'bold', margin: '8px 0' }}>
            {product.price?.toLocaleString('vi-VN')}đ
          </p>
          <span style={{
            color: '#666',
            fontSize: '14px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  )
}