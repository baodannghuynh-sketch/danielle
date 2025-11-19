// src/pages/ProductDetail.jsx
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseclient'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      setProduct(data)
    })
  }, [id])

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product.id)
    
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  if (!product) return <div style={{ padding: '200px', textAlign: 'center' }}>Đang tải...</div>

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', background: '#faf9f7' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%', display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1200'} 
          alt={product.name}
          style={{ width: '560px', maxWidth: '100%', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
        />
        
        <div style={{ flex: 1, minWidth: '300px', padding: '40px 0' }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px', letterSpacing: '3px', color: '#111' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '32px', color: '#A51C30', fontWeight: 'bold', margin: '20px 0' }}>
            {product.price?.toLocaleString('vi-VN')}đ
          </p>
          
          <div style={{ margin: '40px 0', lineHeight: '1.9', fontSize: '18px', color: '#444' }}>
            <p><strong>Chất liệu:</strong> Vàng 18K & Kim cương tự nhiên</p>
            <p><strong>Bộ sưu tập:</strong> {product.collection || 'Signature'}</p>
            <p><strong>Mã sản phẩm:</strong> DL-{product.id.toString().padStart(4, '0')}</p>
          </div>

          <button 
            onClick={addToCart}
            style={{
              padding: '18px 80px',
              background: added ? '#000' : '#A51C30',
              color: 'white',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '3px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.4s ease',
              marginRight: '20px'
            }}
          >
            {added ? 'ĐÃ THÊM VÀO GIỎ' : 'THÊM VÀO GIỎ HÀNG'}
          </button>

          <Link to="/cart" style={{
            display: 'inline-block',
            padding: '18px 60px',
            background: '#000',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
            letterSpacing: '3px',
            borderRadius: '4px'
          }}>
            XEM GIỎ HÀNG
          </Link>

          {added && (
            <div style={{
              position: 'fixed',
              top: '120px',
              right: '30px',
              background: '#000',
              color: 'white',
              padding: '20px 30px',
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              zIndex: 1000,
              animation: 'slideIn 0.5s ease'
            }}>
              Đã thêm vào giỏ hàng!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}