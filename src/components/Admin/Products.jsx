// src/pages/admin/Products.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseclient'

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
    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category || 'Uncategorized',
      image_url: form.image_url.split(',').map(url => url.trim()),
      description: form.description
    }

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId)
    } else {
      await supabase.from('products').insert(payload)
    }

    resetForm()
    fetchProducts()
  }

  const handleDelete = async (id) => {
    if (confirm('Xóa sản phẩm này?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  const startEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      image_url: Array.isArray(p.image_url) ? p.image_url.join(', ') : p.image_url,
      description: p.description || ''
    })
    setEditingId(p.id)
  }

  const resetForm = () => {
    setForm({ name: '', price: '', category: '', image_url: '', description: '' })
    setEditingId(null)
  }

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '30px', fontFamily: '"Playfair Display", serif' }}>
        Quản lý sản phẩm ({products.length})
      </h1>

      <div style={{ background: '#222', padding: '30px', borderRadius: '16px', marginBottom: '40px' }}>
        <h2 style={{ color: '#A51C30', marginBottom: '20px' }}>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        <input placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
        <input placeholder="Giá (VNĐ)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle} />
        <input placeholder="Danh mục (ví dụ: Dress, Bag)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle} />
        <input placeholder="Link ảnh (ngăn cách bằng dấu phẩy)" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} style={inputStyle} />
        <textarea placeholder="Mô tả" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...inputStyle, height: '100px'}} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSave} style={btnRed}>{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
          {editingId && <button onClick={resetForm} style={btnGray}>Hủy</button>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {products.map(p => (
          <div key={p.id} style={{ background: '#222', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={Array.isArray(p.image_url) ? p.image_url[0] : p.image_url} alt={p.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '18px' }}>{p.name}</h3>
              <p style={{ color: '#A51C30', fontWeight: 'bold', fontSize: '20px' }}>{p.price.toLocaleString()} ₫</p>
              <p style={{ fontSize: '14px', color: '#aaa', margin: '8px 0' }}>{p.category}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => startEdit(p)} style={btnBlue}>Sửa</button>
                <button onClick={() => handleDelete(p.id)} style={btnRed}>Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '16px', marginBottom: '16px', background: '#333', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px' }
const btnRed = { padding: '14px 28px', background: '#A51C30', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
const btnBlue = { ...btnRed, background: '#0066cc' }
const btnGray = { ...btnRed, background: '#666' }