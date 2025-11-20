// src/pages/admin/Products.jsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseclient';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    image_url: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Tải danh sách sản phẩm
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      alert('Lỗi tải sản phẩm: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.image_url.trim()) {
      return alert('Vui lòng nhập đầy đủ: Tên, Giá và ít nhất 1 link ảnh!');
    }

    if (isNaN(form.price) || Number(form.price) <= 0) {
      return alert('Giá phải là số dương!');
    }

    const imageUrls = form.image_url
      .split(',')
      .map(url => url.trim())
      .filter(url => url);

    if (imageUrls.length === 0) return alert('Phải có ít nhất 1 ảnh hợp lệ!');

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim() || 'Uncategorized',
      image_url: imageUrls,
      description: form.description.trim() || null
    };

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        alert('Cập nhật thành công!');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        alert('Thêm sản phẩm thành công!');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa vĩnh viễn sản phẩm này? Không thể khôi phục!')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Xóa thất bại: ' + error.message);
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const startEdit = (p) => {
    setForm({
      name: p.name || '',
      price: p.price || '',
      category: p.category || '',
      image_url: Array.isArray(p.image_url) ? p.image_url.join(', ') : p.image_url || '',
      description: p.description || ''
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ name: '', price: '', category: '', image_url: '', description: '' });
    setEditingId(null);
  };

  // Preview ảnh đầu tiên
  const firstImage = form.image_url.split(',')[0]?.trim();

  return (
    <div style={{ color: 'white', minHeight: '100vh' }}>
      <h1 style={{
        fontSize: '42px',
        marginBottom: '40px',
        fontFamily: '"Playfair Display", serif',
        textAlign: 'center',
        background: 'linear-gradient(90deg, #A51C30, #ff6b6b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        Quản lý sản phẩm ({products.length})
      </h1>

      {/* Form thêm/sửa */}
      <div style={{
        background: '#222',
        padding: '32px',
        borderRadius: '20px',
        marginBottom: '50px',
        boxShadow: '0 10px 30px rgba(165, 28, 48, 0.2)',
        border: '1px solid #A51C30'
      }}>
        <h2 style={{ color: '#A51C30', marginBottom: '24px', fontSize: '28px' }}>
          {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <input placeholder="Tên sản phẩm *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input placeholder="Giá bán (VNĐ) *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
            <input placeholder="Danh mục (VD: Hoa hồng, Hoa cưới)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
            <input placeholder="Link ảnh (ngăn cách bằng dấu phẩy)" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={inputStyle} />
            <textarea placeholder="Mô tả sản phẩm (tùy chọn)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, height: '120px', resize: 'vertical' }} />
          </div>

          {/* Preview ảnh */}
          <div>
            <p style={{ margin: '0 0 12px', color: '#aaa' }}>Preview ảnh đầu tiên:</p>
            {firstImage ? (
              <img
                src={firstImage}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '380px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x380/f5f5f5/999?text=Ảnh+lỗi'; }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '380px',
                background: '#333',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '18px',
                border: '2px dashed #555'
              }}>
                Nhập link ảnh để xem trước
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', justifyContent: 'center' }}>
          <button onClick={handleSave} disabled={saving} style={{
            ...btnRed,
            padding: '16px 40px',
            fontSize: '18px',
            opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Đang lưu...' : editingId ? 'CẬP NHẬT' : 'THÊM MỚI'}
          </button>
          {editingId && (
            <button onClick={resetForm} style={btnGray}>
              Hủy chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', fontSize: '20px', color: '#aaa' }}>
          Đang tải sản phẩm...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px', background: '#222', borderRadius: '20px' }}>
          <p style={{ fontSize: '24px', color: '#aaa' }}>Chưa có sản phẩm nào</p>
          <p>Hãy thêm sản phẩm đầu tiên!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {products.map(p => (
            <div
              key={p.id}
              style={{
                background: '#222',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                transition: 'all 0.3s',
                border: '1px solid #333'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img
                src={Array.isArray(p.image_url) ? p.image_url[0] : p.image_url}
                alt={p.name}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover'
                }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300/f5f5f5/999?text=No+Image'; }}
              />
              <div style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 'bold' }}>
                  {p.name}
                </h3>
                <p style={{ color: '#A51C30', fontWeight: 'bold', fontSize: '24px', margin: '8px 0' }}>
                  {p.price.toLocaleString()} ₫
                </p>
                {p.category && (
                  <p style={{ fontSize: '14px', color: '#ff6b6b', background: '#333', display: 'inline-block', padding: '4px 12px', borderRadius: '20px' }}>
                    {p.category}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button onClick={() => startEdit(p)} style={btnBlue}>
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={btnRed}>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Styles (giữ nguyên đẹp như cũ, chỉ nâng cấp chút)
const inputStyle = {
  width: '100%',
  padding: '16px 18px',
  marginBottom: '0',
  background: '#333',
  border: '2px solid transparent',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
  transition: 'all 0.2s',
  ':focus': { borderColor: '#A51C30', outline: 'none' }
};

const btnRed = {
  padding: '14px 32px',
  background: '#A51C30',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  transition: 'all 0.2s',
  ':hover': { background: '#c51c35' }
};

const btnBlue = {
  ...btnRed,
  background: '#0066cc',
  ':hover': { background: '#0052a3' }
};

const btnGray = {
  ...btnRed,
  background: '#666',
  ':hover': { background: '#555' }
};