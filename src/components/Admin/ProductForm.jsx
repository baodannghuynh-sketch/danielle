// src/components/admin/ProductForm.jsx
import { useState } from 'react';
import { supabase } from '../../supabaseclient';

export default function ProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    in_stock: true
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Tự động preview ảnh khi nhập link
    if (name === 'image' && value.trim()) {
      setPreview(value.trim());
    } else if (name === 'image' && !value) {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, image } = formData;
    if (!name.trim() || !price || !image.trim()) {
      return alert('Vui lòng nhập đầy đủ Tên, Giá và Link ảnh!');
    }

    if (isNaN(price) || Number(price) <= 0) {
      return alert('Giá phải là số dương!');
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: name.trim(),
          price: Number(price),
          images: [image.trim()],
          description: formData.description.trim() || null,
          in_stock: formData.in_stock
        });

      if (error) throw error;

      alert('Thêm sản phẩm thành công!');
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        image: '',
        description: '',
        in_stock: true
      });
      setPreview(null);

      // Gọi callback nếu có (để refresh danh sách sản phẩm)
      onSuccess?.();
    } catch (err) {
      console.error('Lỗi khi thêm sản phẩm:', err);
      alert('Thêm sản phẩm thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '32px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{
        color: '#A51C30',
        fontSize: '28px',
        marginBottom: '24px',
        textAlign: 'center',
        fontFamily: '"Playfair Display", serif'
      }}>
        Thêm sản phẩm mới
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        {/* Tên sản phẩm */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Tên sản phẩm *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ví dụ: Bông hồng đỏ Ecuador"
            required
            style={inputStyle}
          />
        </div>

        {/* Giá */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Giá bán (VNĐ) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="290000"
            min="1"
            required
            style={inputStyle}
          />
        </div>

        {/* Link ảnh */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Link ảnh sản phẩm *
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
            style={inputStyle}
          />
          <small style={{ color: '#666', fontSize: '13px' }}>
            Dùng link từ imgur.com, postimages.org hoặc CDN
          </small>
        </div>

        {/* Preview ảnh */}
        {preview && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '12px 0 8px', color: '#666' }}>Preview:</p>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onError={() => setPreview(null)}
            />
          </div>
        )}

        {/* Mô tả */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Mô tả sản phẩm (tùy chọn)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Bông hồng đỏ thắm nhập khẩu từ Ecuador, giữ tươi 7-10 ngày..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Còn hàng */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="in_stock"
            checked={formData.in_stock}
            onChange={handleChange}
          />
          <span style={{ fontWeight: '500' }}>Còn hàng (hiển thị trên website)</span>
        </label>

        {/* Nút submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            background: loading ? '#999' : '#A51C30',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {loading ? 'Đang thêm...' : 'THÊM SẢN PHẨM'}
        </button>
      </form>
    </div>
  );
}

// Styles chung
const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '8px',
  border: '2px solid #ddd',
  fontSize: '16px',
  transition: 'all 0.2s',
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: '16px 32px',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
  width: '100%'
};

// Focus effect (có thể thêm nếu dùng CSS module hoặc styled-components sau)