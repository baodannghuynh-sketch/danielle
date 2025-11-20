// src/pages/admin/Products.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    name: '', price: '', category: '', image_url: '', description: '', in_stock: true, stock_quantity: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) alert('Lỗi tải sản phẩm: ' + error.message);
    else setProducts(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.image_url.trim()) {
      alert('Vui lòng nhập: Tên sản phẩm, Giá và ít nhất 1 ảnh!');
      return;
    }

    if (isNaN(form.price) || Number(form.price) <= 0) {
      alert('Giá phải là số dương!');
      return;
    }

    const imageUrls = form.image_url
      .split(',')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (imageUrls.length === 0) {
      alert('Phải có ít nhất 1 link ảnh hợp lệ!');
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim() || 'Uncategorized',
      image_url: imageUrls,
      description: form.description.trim() || null,
      in_stock: form.in_stock,
      stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : null,
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
        const { error } = await supabase
          .from('products')
          .insert(payload);
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

  const startEdit = (p) => {
    setForm({
      name: p.name || '',
      price: p.price || '',
      category: p.category || '',
      image_url: Array.isArray(p.image_url) ? p.image_url.join(', ') : p.image_url || '',
      description: p.description || '',
      in_stock: p.in_stock !== false,
      stock_quantity: p.stock_quantity || ''
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ name: '', price: '', category: '', image_url: '', description: '', in_stock: true, stock_quantity: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('XÓA VĨNH VIỄN sản phẩm này? Không thể khôi phục!')) return;
    setDeletingId(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Xóa thất bại: ' + error.message);
    else fetchProducts();
    setDeletingId(null);
  };

  // Preview ảnh đầu tiên
  const previewUrls = form.image_url
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  const firstImage = previewUrls[0];

  return (
    <div>
      {/* Tiêu đề */}
      <h1 style={{
        fontSize: '52px',
        margin: '0 0 60px',
        fontFamily: '"Playfair Display", serif',
        textAlign: 'center',
        background: 'linear-gradient(90deg, #A51C30, #ff6b6b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>
        Quản lý sản phẩm ({products.length})
      </h1>

      {/* Form thêm/sửa */}
      <div style={{
        background: 'linear-gradient(135deg, #222 0%, #1a1a1a 100%)',
        padding: '50px',
        borderRadius: '28px',
        marginBottom: '80px',
        boxShadow: '0 20px 60px rgba(165,28,48,0.25)',
        border: '1px solid rgba(165,28,48,0.3)'
      }}>
        <h2 style={{ fontSize: '36px', color: '#A51C30', margin: '0 0 40px', textAlign: 'center' }}>
          {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div>
            <input placeholder="Tên sản phẩm *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input type="number" placeholder="Giá bán (VNĐ) *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
            <input placeholder="Danh mục (VD: Nhẫn cưới, Vòng cổ)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
            <input placeholder="Link ảnh (ngăn cách bằng dấu phẩy)" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={inputStyle} />
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ddd', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
                Còn hàng
              </label>
              <input 
                type="number" 
                placeholder="Số lượng tồn (tùy chọn)" 
                value={form.stock_quantity} 
                onChange={e => setForm({ ...form, stock_quantity: e.target.value })} 
                style={{ ...inputStyle, width: '200px' }}
              />
            </div>
          </div>

          {/* Preview ảnh */}
          <div>
            <p style={{ margin: '0 0 16px', color: '#aaa', fontSize: '16px' }}>Preview ảnh đầu tiên:</p>
            {firstImage ? (
              <img
                src={firstImage}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                  border: '3px solid #A51C30'
                }}
                onError={e => e.target.src = 'https://via.placeholder.com/500x420/f5f5f5/999?text=Ảnh+lỗi'}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '420px',
                background: '#333',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '20px',
                border: '3px dashed #555',
                flexDirection: 'column',
                gap: '16px'
              }}>
                Nhập link ảnh để xem trước
              </div>
            )}
            {previewUrls.length > 1 && (
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {previewUrls.slice(1, 5).map((url, i) => (
                  <img key={i} src={url} alt={`Thumb ${i+2}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                ))}
                {previewUrls.length > 5 && <span style={{ color: '#aaa', alignSelf: 'center' }}>+{previewUrls.length - 5} ảnh</span>}
              </div>
            )}
          </div>
        </div>

        <textarea
          placeholder="Mô tả sản phẩm (tùy chọn)"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={{ ...inputStyle, height: '140px', resize: 'vertical', gridColumn: '1 / -1' }}
        />

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
          <button onClick={handleSave} disabled={saving} style={{
            ...btnPrimary,
            padding: '18px 50px',
            fontSize: '20px',
            opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Đang lưu...' : editingId ? 'CẬP NHẬT' : 'THÊM MỚI'}
          </button>
          {editingId && (
            <button onClick={resetForm} style={btnSecondary}>
              Hủy chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', fontSize: '24px', color: '#aaa' }}>
          Đang tải sản phẩm...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '120px', background: '#222', borderRadius: '28px' }}>
          <p style={{ fontSize: '32px', color: '#aaa' }}>Chưa có sản phẩm nào</p>
          <p style={{ color: '#666' }}>Hãy thêm sản phẩm đầu tiên!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '40px'
        }}>
          {products.map(p => (
            <div
              key={p.id}
              style={{
                background: '#1a1a1a',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                transition: 'all 0.5s ease',
                border: '1px solid #333'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-12px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={Array.isArray(p.image_url) ? p.image_url[0] : p.image_url}
                  alt={p.name}
                  style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                  onError={e => e.target.src = 'https://via.placeholder.com/400x360/f5f5f5/999?text=No+Image'}
                />
                {!p.in_stock && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: '#000',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    HẾT HÀNG
                  </div>
                )}
              </div>

              <div style={{ padding: '32px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                  {p.name}
                </h3>
                {p.category && (
                  <p style={{ color: '#ff6b6b', fontSize: '15px', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    {p.category}
                  </p>
                )}
                <p style={{ color: '#A51C30', fontSize: '28px', fontWeight: 'bold', margin: '16px 0' }}>
                  {p.price.toLocaleString()} ₫
                </p>
                {p.stock_quantity !== null && (
                  <p style={{ color: p.stock_quantity <= 5 ? '#ff6b6b' : '#aaa', fontSize: '14px' }}>
                    Còn lại: {p.stock_quantity} sản phẩm
                  </p>
                )}

                <div style={{ display在他的: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button onClick={() => startEdit(p)} style={btnEdit}>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    style={{
                      ...btnDelete,
                      opacity: deletingId === p.id ? 0.7 : 1
                    }}
                  >
                    {deletingId === p.id ? 'Đang xóa...' : 'Xóa'}
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

// Styles sang trọng
const inputStyle = {
  width: '100%',
  padding: '18px 22px',
  marginBottom: '20px',
  background: '#333',
  border: '2px solid transparent',
  borderRadius: '16px',
  color: 'white',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  ':focus': { borderColor: '#A51C30', outline: 'none' }
};

const btnPrimary = {
  padding: '18px 50px',
  background: '#A51C30',
  color: 'white',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
  boxShadow: '0 10px 30px rgba(165,28,48,0.4)',
  transition: 'all 0.4s ease'
};

const btnSecondary = {
  ...btnPrimary,
  background: '#666',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
};

const btnEdit = {
  flex: 1,
  padding: '16px',
  background: '#0066cc',
  color: 'white',
  border: 'none',
  borderRadius: '16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  transition: 'all 0.3s'
};

const btnDelete = {
  ...btnEdit,
  background: '#cc0000'
};