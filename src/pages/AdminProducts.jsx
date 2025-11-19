// src/pages/AdminProducts.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseclient'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', price: '', category: '', image_url: '', description: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.image_url) {
      alert('Vui lòng điền đầy đủ Tên, Giá và Link ảnh!')
      return
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category || 'Uncategorized',
      image_url: form.image_url.split(',').map(u => u.trim()),
      description: form.description || null
    }

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId)
    } else {
      await supabase.from('products').insert(payload)
    }

    setForm({ name: '', price: '', category: '', image_url: '', description: '' })
    setEditingId(null)
    fetchProducts()
  }

  const startEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      category: p.category || '',
      image_url: Array.isArray(p.image_url) ? p.image_url.join(', ') : p.image_url,
      description: p.description || ''
    })
    setEditingId(p.id)
  }

  const handleDelete = async (id) => {
    if (confirm('Xóa sản phẩm này thật chứ?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '42px', marginBottom: '40px', fontFamily: '"Playfair Display", serif', color: '#A51C30' }}>
        Quản lý sản phẩm ({products.length})
      </h1>

      {/* Form thêm/sửa */}
      <div style={{ background: '#222', padding: '40px', borderRadius: '20px', marginBottom: '50px' }}>
        <h2 style={{ color: '#A51C30', marginBottom: '25px' }}>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <input placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={input} />
          <input placeholder="Giá (VNĐ)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={input} />
          <input placeholder="Danh mục (ví dụ: Dress, Bag)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={input} />
          <input placeholder="Link ảnh (cách nhau bằng dấu phẩy)" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} style={input} />
        </div>
        <textarea placeholder="Mô tả sản phẩm (tùy chọn)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...input, height: '120px', gridColumn: '1 / -1'}} />
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={handleSave} style={btnSave}>{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
          {editingId && <button onClick={() => { setEditingId(null); setForm({ name: '', price: '', category: '', image_url: '', description: '' }) }} style={btnCancel}>Hủy</button>}
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {products.map(p => (
          <div key={p.id} style={{ background: '#222', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(165,28,48,0.2)' }}>
            <img src={Array.isArray(p.image_url) ? p.image_url[0] : p.image_url} alt={p.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            <div style={{ padding: '25px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '20px' }}>{p.name}</h3>
              <p style={{ color: '#A51C30', fontSize: '22px', fontWeight: 'bold' }}>{p.price.toLocaleString()} ₫</p>
              <p style={{ color: '#aaa', fontSize: '14px' }}>{p.category}</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button onClick={() => startEdit(p)} style={btnEdit}>Sửa</button>
                <button onClick={() => handleDelete(p.id)} style={btnDelete}>Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const input = { padding: '18px', background: '#333', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px' }
const btnSave = { padding: '18px 40px', background: '#A51C30', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }
const btnCancel = { ...btnSave, background: '#666' }
const btnEdit = { flex: 1, padding: '14px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
const btnDelete = { flex: 1, padding: '14px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }