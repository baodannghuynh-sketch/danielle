// src/components/admin/ProductList.jsx
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabaseclient';
import ProductCard from "./ProductCard";

export default function ProductList({
  products,
  onViewDetail,
  onEdit,
  onDelete,
}) {
  return (
    <div className="ap-grid">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
export default function ProductList({ refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadProducts = useCallback(async () => {
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

  // Load khi mount hoặc khi thêm/sửa/xóa
  useEffect(() => {
    loadProducts();
  }, [loadProducts, refreshTrigger]);

  const deleteProduct = async (id) => {
    if (!confirm('Xóa sản phẩm này vĩnh viễn? Không thể khôi phục!')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Xóa thất bại: ' + error.message);
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      description: product.description || '',
      in_stock: product.in_stock
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editForm.name.trim() || !editForm.price || !editForm.image.trim()) {
      return alert('Vui lòng nhập đầy đủ tên, giá và ảnh!');
    }

    const updates = {
      name: editForm.name.trim(),
      price: Number(editForm.price),
      images: [editForm.image.trim()],
      description: editForm.description.trim() || null,
      in_stock: editForm.in_stock
    };

    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', editingId);

    if (error) {
      alert('Cập nhật thất bại: ' + error.message);
    } else {
      setProducts(prev =>
        prev.map(p => p.id === editingId ? { ...p, ...updates } : p)
      );
      cancelEdit();
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#aaa', fontSize: '18px' }}>Đang tải sản phẩm...</div>;
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{
        color: Closes,
        fontSize: '32px',
        marginBottom: '30px',
        fontFamily: '"Playfair Display", serif',
        textAlign: 'center'
      }}>
        Danh sách sản phẩm ({products.length})
      </h2>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', background: '#222', borderRadius: '16px', color: '#888' }}>
          <p style={{ fontSize: '20px' }}>Chưa có sản phẩm nào</p>
          <p>Thêm sản phẩm đầu tiên ngay bây giờ!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {products.map(product => (
            <div
              key={product.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', minHeight: '180px' }}>
                {/* Ảnh sản phẩm */}
                <div style={{ flex: '0 0 250px', position: 'relative' }}>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/250x200/333/fff?text=No+Image';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: '#eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '14px'
                    }}>
                      Không có ảnh
                    </div>
                  )}
                  {!product.in_stock && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(220,53,69,0.9)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      Hết hàng
                    </div>
                  )}
                </div>

                {/* Nội dung */}
                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {editingId === product.id ? (
                    /* Form chỉnh sửa */
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <input
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Tên sản phẩm"
                        style={editInputStyle}
                      />
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                          placeholder="Giá"
                          style={{ ...editInputStyle, flex: 1 }}
                        />
                        <input
                          type="url"
                          value={editForm.image}
                          onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                          placeholder="Link ảnh"
                          style={{ ...editInputStyle, flex: 2 }}
                        />
                      </div>
                      <textarea
                        value={editForm.description}
                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Mô tả (tùy chọn)"
                        rows={2}
                        style={{ ...editInputStyle, resize: 'vertical' }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={editForm.in_stock}
                          onChange={e => setEditForm({ ...editForm, in_stock: e.target.checked })}
                        />
                        <span>Còn hàng</span>
                      </label>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={saveEdit} style={{ ...btnSuccess, flex: 1 }}>Lưu</button>
                        <button onClick={cancelEdit} style={{ ...btnCancel, flex: 1 }}>Hủy</button>
                      </div>
                    </div>
                  ) : (
                    /* Hiển thị thông tin */
                    <>
                      <div>
                        <h3 style={{ fontSize: '22px', margin: '0 0 12px 0', color: '#222' }}>
                          {product.name}
                        </h3>
                        <p style={{ color: '#A51C30', fontSize: '24px', fontWeight: 'bold', margin: '12px 0' }}>
                          {product.price.toLocaleString()} ₫
                        </p>
                        {product.description && (
                          <p style={{ color: '#666', margin: '12px 0', lineHeight: '1.5' }}>
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-end' }}>
                        <button
                          onClick={() => startEdit(product)}
                          style={btnEdit}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          style={btnDelete}
                        >
                          Xóa
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Styles
const editInputStyle = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '2px solid #ddd',
  fontSize: '15px'
};

const btnEdit = {
  padding: '10px 20px',
  background: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const btnDelete = {
  padding: '10px 20px',
  background: '#DC3545',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const btnSuccess = {
  padding: '12px',
  background: '#28A745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const btnCancel = {
  padding: '12px',
  background: '#6C757D',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
};