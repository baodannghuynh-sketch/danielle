// src/pages/Shop.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseclient'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | men | women | handcrafted

  // Dữ liệu mẫu cực đẹp (hiện ngay khi chưa có sản phẩm thật trên Supabase)
  const mockProducts = [
    { id: 1, name: "Nhẫn Kim Cương Eternal Solitaire", price: 298000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
    { id: 2, name: "Dây Chuyền Cuban Link Vàng 18K", price: 89000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 3, name: "Bông Tai Tennis Diamond", price: 168000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
    { id: 4, name: "Vòng Tay Titan Black Edition", price: 45800000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 5, name: "Nhẫn Cưới Heritage Platinum", price: 488000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "handcrafted" },
    { id: 6, name: "Lắc Tay Masterpiece Diamond", price: 388000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "handcrafted" },
    { id: 7, name: "Nhẫn Signet Vàng Trắng", price: 128000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 8, name: "Vòng Cổ Pearl & Diamond", price: 218000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
    { id: 9, name: "Nhẫn Kim Cương Eternal Solitaire", price: 298000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
    { id: 10, name: "Dây Chuyền Cuban Link Vàng 18K", price: 89000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 11, name: "Bông Tai Tennis Diamond", price: 168000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
    { id: 12, name: "Vòng Tay Titan Black Edition", price: 45800000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 13, name: "Nhẫn Cưới Heritage Platinum", price: 488000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "handcrafted" },
    { id: 14, name: "Lắc Tay Masterpiece Diamond", price: 388000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "handcrafted" },
    { id: 15, name: "Nhẫn Signet Vàng Trắng", price: 128000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 16, name: "Vòng Cổ Pearl & Diamond", price: 218000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
    { id: 17, name: "Nhẫn Kim Cương Eternal Solitaire", price: 298000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
    { id: 18, name: "Dây Chuyền Cuban Link Vàng 18K", price: 89000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 19, name: "Bông Tai Tennis Diamond", price: 168000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
    { id: 20, name: "Vòng Tay Titan Black Edition", price: 45800000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 21, name: "Nhẫn Cưới Heritage Platinum", price: 488000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "handcrafted" },
    { id: 22, name: "Lắc Tay Masterpiece Diamond", price: 388000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "handcrafted" },
    { id: 23, name: "Nhẫn Signet Vàng Trắng", price: 128000000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200", category: "men" },
    { id: 24, name: "Vòng Cổ Pearl & Diamond", price: 218000000, image: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200", category: "women" },
  ]

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {
    setLoading(true)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Lỗi lấy sản phẩm:', error)
    }

    // ĐÃ FIX: dùng toán tử điều kiện đúng cách – không bao giờ lỗi cú pháp nữa
    setProducts(data && data.length > 0 ? data : mockProducts)

    setLoading(false)
  }

  // Lọc sản phẩm theo danh mục
  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* HERO SHOP – SIÊU SANG */}
      <section style={{
        height: '70vh',
        minHeight: '600px',
        background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1611590027211-b954fd027b51?q=80&w=3270") center/cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
      }}>
        <div>
          <h1 style={{
            fontSize: '92px',
            letterSpacing: '14px',
            fontWeight: '300',
            margin: '0 0 20px',
            fontFamily: "'Playfair Display', serif"
          }}>
            BỘ SƯU TẬP
          </h1>
          <p style={{ fontSize: '26px', letterSpacing: '6px', opacity: 0.95 }}>
            HANDCRAFTED LUXURY JEWELRY
          </p>
          <div style={{ height: '2px', width: '140px', background: '#A51C30', margin: '40px auto' }}></div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div style={{ maxWidth: '1400px', margin: '90px auto 60px', padding: '0 5%', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          gap: '40px',
          padding: '14px 40px',
          background: '#faf9f7',
          borderRadius: '60px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.06)'
        }}>
          {['all', 'men', 'women', 'handcrafted'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '14px 36px',
                background: filter === cat ? '#A51C30' : 'transparent',
                color: filter === cat ? 'white' : '#333',
                border: 'none',
                borderRadius: '40px',
                fontSize: '17px',
                fontWeight: '600',
                letterSpacing: '2.5px',
                cursor: 'pointer',
                transition: 'all 0.4s ease'
              }}
            >
              {cat === 'all' ? 'TẤT CẢ' : cat === 'men' ? 'NAM' : cat === 'women' ? 'NỮ' : 'THỦ CÔNG'}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div style={{ maxWidth: '1600px', margin: '0 auto 140px', padding: '0 5%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '120px', fontSize: '26px', color: '#999' }}>
            Đang tải bộ sưu tập...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '70px'
          }}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Thông báo khi không có sản phẩm */}
        {!loading && filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '140px 20px', color: '#777' }}>
            <p style={{ fontSize: '30px', marginBottom: '30px' }}>
              Chưa có sản phẩm trong danh mục này
            </p>
            <Link to="/shop" style={{ color: '#A51C30', fontSize: '20px', textDecoration: 'underline' }}>
              ← Quay lại bộ sưu tập
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}