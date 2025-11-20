// src/pages/ProductDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseclient';
import { useCartStore } from '../store/useCartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } else {
        setProduct(data);
        // Đảm bảo image_url luôn là mảng
        if (data?.image_url && !Array.isArray(data.image_url)) {
          data.image_url = [data.image_url];
        }
      }
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url?.[0] || '',
      quantity: 1
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px'
      }}>
        Đang tải tuyệt tác...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#A51C30',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        textAlign: 'center',
        padding: '40px'
      }}>
        Sản phẩm không tồn tại hoặc đã bị xóa
      </div>
    );
  }

  const images = Array.isArray(product.image_url) ? product.image_url : [product.image_url || ''];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      paddingTop: '120px',
      paddingBottom: '180px'
    }}>
      <div style={{
        maxWidth: '1800px',
        margin: '0 auto',
        padding: '0 5%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '100px',
        alignItems: 'start'
      }}>
        {/* Hình ảnh sản phẩm – Gallery cao cấp */}
        <div style={{ position: 'relative' }}>
          {/* Ảnh chính */}
          <div style={{
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            marginBottom: '30px'
          }}>
            <img
              src={images[selectedImage] || 'https://via.placeholder.com/800x800/111/333?text=DANIELLE'}
              alt={product.name}
              style={{
                width: '100%',
                height: '800px',
                objectFit: 'cover',
                transition: 'all 0.8s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              background: 'rgba(165,28,48,0.9)',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '3px',
              boxShadow: '0 10px 30px rgba(165,28,48,0.4)'
            }}>
              BEST SELLER
            </div>
          </div>

          {/* Thumbnail gallery */}
          {images.length > 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px'
            }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === i ? '4px solid #A51C30' : '4px solid transparent',
                    transition: 'all 0.4s ease',
                    boxShadow: selectedImage === i ? '0 20px 40px rgba(165,28,48,0.3)' : '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'cover',
                      filter: selectedImage === i ? 'brightness(1)' : 'brightness(0.7)'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm – Sang trọng cực điểm */}
        <div style={{ padding: '60px 0' }}>
          <p style={{
            fontSize: '18px',
            letterSpacing: '6px',
            color: '#A51C30',
            margin: '0 0 20px',
            fontWeight: '500'
          }}>
            {product.category || 'MASTERPIECE'}
          </p>

          <h1 style={{
            fontSize: '72px',
            fontWeight: '300',
            letterSpacing: '8px',
            margin: '0 0 30px',
            fontFamily: '"Playfair Display", serif',
            lineHeight: '1.1'
          }}>
            {product.name.toUpperCase()}
          </h1>

          <p style={{
            fontSize: '42px',
            color: '#A51C30',
            fontWeight: 'bold',
            margin: '40px 0',
            letterSpacing: '2px'
          }}>
            {product.price.toLocaleString('vi-VN')} ₫
          </p>

          <div style={{
            padding: '40px 0',
            borderTop: '1px solid #333',
            borderBottom: '1px solid #333',
            margin: '60px 0'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <strong style={{ color: '#aaa', letterSpacing: '2px' }}>CHẤT LIỆU</strong>
              <p style={{ fontSize: '20px', margin: '8px 0 0' }}>Vàng {product.material || '18K'} nguyên khối • Kim cương tự nhiên GIA</p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <strong style={{ color: '#aaa', letterSpacing: '2px' }}>MÃ SẢN PHẨM</strong>
              <p style={{ fontSize: '20px', margin: '8px 0' }}>DL-{String(product.id).padStart(5, '0')}</p>
            </div>
            <div>
              <strong style={{ color: '#aaa', letterSpacing: '2px' }}>TÌNH TRẠNG</strong>
              <p style={{ fontSize: '20px', margin: '8px 0', color: product.in_stock !== false ? '#66BB6A' : '#EF5350' }}>
                {product.in_stock !== false ? 'Còn hàng • Giao ngay trong 24h' : 'Hết hàng • Đặt trước'}
              </p>
            </div>
          </div>

          {product.description && (
            <div style={{ margin: '60px 0', fontSize: '19px', lineHeight: '1.9', color: '#ccc' }}>
              <strong style={{ color: '#A51C30', letterSpacing: '3px', display: 'block', marginBottom: '20px' }}>
                CÂU CHUYỆN SẢN PHẨM
              </strong>
              {product.description}
            </div>
          )}

          {/* Nút hành động – Đẹp đến mức muốn nhấn ngay */}
          <div style={{ marginTop: '80px' }}>
            <button
              onClick={handleAddToCart}
              disabled={product.in_stock === false}
              style={{
                width: '100%',
                padding: '28px',
                background: product.in_stock === false ? '#555' : '#A51C30',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '24px',
                fontWeight: 'bold',
                letterSpacing: '6px',
                cursor: product.in_stock === false ? 'not-allowed' : 'pointer',
                boxShadow: '0 25px 60px rgba(165,28,48,0.5)',
                transition: 'all 0.6s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => product.in_stock !== false && (e.target.style.background = '#c51c35')}
              onMouseLeave={e => product.in_stock !== false && (e.target.style.background = '#A51C30')}
            >
              {product.in_stock === false ? 'HẾT HÀNG' : added ? 'ĐÃ THÊM VÀO GIỎ' : 'THÊM VÀO GIỎ HÀNG'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <Link to="/cart" style={{
                color: '#A51C30',
                fontSize: '18px',
                fontWeight: 'bold',
                letterSpacing: '3px',
                textDecoration: 'none',
                borderBottom: '2px solid #A51C30',
                paddingBottom: '8px'
              }}>
                XEM GIỎ HÀNG
              </Link>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{
            marginTop: '100px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            textAlign: 'center',
            padding: '40px 0',
            borderTop: '1px solid #333'
          }}>
            {[
              { icon: "Diamond", text: "Kim cương GIA" },
              { icon: "Lock", text: "Bảo hành trọn đời" },
              { icon: "Package", text: "Hộp quà cao cấp" }
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
                <p style={{ color: '#aaa', fontSize: '16px', letterSpacing: '2px' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {added && (
        <div style={{
          position: 'fixed',
          top: '140px',
          right: '40px',
          background: '#000',
          color: '#66BB6A',
          padding: '24px 40px',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          border: '2px solid #66BB6A',
          zIndex: 10000,
          fontSize: '20px',
          fontWeight: 'bold',
          animation: 'slideInRight 0.6s ease'
        }}>
          Đã thêm vào giỏ hàng!
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}