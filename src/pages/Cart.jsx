// src/pages/Cart.jsx
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal, getCount, clear } = useCartStore();

  const total = getTotal();
  const itemCount = getCount();

  if (itemCount === 0) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px',
        background: 'linear-gradient(to bottom, #0f0a0a, #000)',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '56px',
          fontFamily: '"Playfair Display", serif',
          margin: '0 0 30px',
          background: 'linear-gradient(90deg, #A51C30, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Giỏ hàng trống
        </h1>
        <p style={{ fontSize: '22px', color: '#aaa', marginBottom: '50px' }}>
          Hãy khám phá những tuyệt tác trang sức đang chờ bạn...
        </p>
        <Link 
          to="/shop"
          style={{
            padding: '18px 50px',
            background: '#A51C30',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '20px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 15px 40px rgba(165,28,48,0.4)',
            transition: 'all 0.4s ease'
          }}
          onMouseEnter={e => e.target.style.background = '#c51c35'}
          onMouseLeave={e => e.target.style.background = '#A51C30'}
        >
          KHÁM PHÁ BỘ SƯU TẬP
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0a0a',
      color: 'white',
      padding: '120px 5vw 150px',
      fontFamily: '"Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Tiêu đề */}
        <h1 style={{
          fontSize: '62px',
          textAlign: 'center',
          margin: '0 0 80px',
          fontFamily: '"Playfair Display", serif',
          background: 'linear-gradient(90deg, #A51C30, #ff6b6b, #A51C30)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          letterSpacing: '3px'
        }}>
          GIỎ HÀNG CỦA BẠN
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '60px' }}>
          {/* Danh sách sản phẩm */}
          <div>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '28px',
                  padding: '32px',
                  marginBottom: '30px',
                  display: 'flex',
                  gap: '30px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  border: '1px solid #333',
                  transition: 'all 0.4s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={Array.isArray(item.image_url) ? item.image_url[0] : item.image_url}
                  alt={item.name}
                  style={{
                    width: '180px',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    border: '3px solid #333'
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '26px', margin: '0 0 12px', fontWeight: '500' }}>
                    {item.name}
                  </h3>
                  <p style={{ color: '#A51C30', fontSize: '28px', fontWeight: 'bold', margin: '8px 0 20px' }}>
                    {(item.price * item.quantity).toLocaleString()} ₫
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={qtyBtn}
                      >
                        Minus
                      </button>
                      <span style={{
                        minWidth: '50px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        background: '#333',
                        padding: '10px 16px',
                        borderRadius: '12px'
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={qtyBtn}
                      >
                        Plus
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        marginLeft: 'auto',
                        color: '#ff6b6b',
                        background: 'none',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={e => e.target.style.background = 'rgba(255,107,107,0.15)'}
                      onMouseLeave={e => e.target.style.background = 'none'}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng kết + Thanh toán */}
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
              padding: '50px 40px',
              borderRadius: '32px',
              border: '2px solid #A51C30',
              position: 'sticky',
              top: '120px',
              boxShadow: '0 20px 60px rgba(165,28,48,0.3)'
            }}>
              <h2 style={{
                fontSize: '36px',
                margin: '0 0 40px',
                textAlign: 'center',
                fontFamily: '"Playfair Display", serif',
                color: '#A51C30'
              }}>
                TÓM TẮT ĐƠN HÀNG
              </h2>

              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px' }}>
                  <span>Sản phẩm ({itemCount})</span>
                  <span>{total.toLocaleString()} ₫</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px' }}>
                  <span>Phí vận chuyển</span>
                  <span style={{ color: '#4CAF50' }}>Miễn phí</span>
                </div>
                <hr style={{ border: '1px solid #444', margin: '30px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '28px', fontWeight: 'bold' }}>
                  <span>TỔNG CỘNG</span>
                  <span style={{ color: '#A51C30' }}>{total.toLocaleString()} ₫</span>
                </div>
              </div>

              <Link
                to="/checkout"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '24px',
                  background: '#A51C30',
                  color: 'white',
                  textAlign: 'center',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  letterSpacing: '2px',
                  boxShadow: '0 15px 40px rgba(165,28,48,0.5)',
                  transition: 'all 0.4s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.background = '#c51c35';
                  e.target.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = '#A51C30';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                TIẾN HÀNH THANH TOÁN
              </Link>

              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={clear}
                  style={{
                    background: 'transparent',
                    color: '#ff6b6b',
                    border: '2px solid #ff6b6b',
                    padding: '14px 32px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Làm trống giỏ hàng
                </button>
              </div>

              <p style={{
                textAlign: 'center',
                marginTop: '40px',
                color: '#888',
                fontSize: '14px',
                lineHeight: '1.8'
              }}>
                Miễn phí vận chuyển toàn quốc • Đóng gói cao cấp • Bảo hành trọn đời<br />
                Mọi sản phẩm đều được kiểm định chất lượng trước khi giao
              </p>
            </div>
          </div>
        </div>

        {/* Gợi ý sản phẩm */}
        <div style={{ marginTop: '120px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '42px',
            margin: '0 0 60px',
            fontFamily: '"Playfair Display", serif',
            color: '#A51C30'
          }}>
            BẠN CÓ THỂ THÍCH
          </h2>
          {/* Có thể thêm component RelatedProducts ở đây */}
          <p style={{ color: '#aaa', fontSize: '18px' }}>
            (Sắp có gợi ý sản phẩm liên quan...)
          </p>
        </div>
      </div>
    </div>
  );
}

const qtyBtn = {
  width: '48px',
  height: '48px',
  background: '#A51C30',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  fontSize: '20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s'
};