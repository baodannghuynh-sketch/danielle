import { useState } from 'react'
import { supabase } from '../../supabaseclient'

export default function ProductForm() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')

  const handleAdd = async () => {
    if (!name || !price || !image) return alert('Nhập đủ thông tin!')
    await supabase.from('products').insert({
      name,
      price: Number(price),
      images: [image],
      description,
      in_stock: true
    })
    alert('Thêm sản phẩm thành công!')
    setName(''); setPrice(''); setImage(''); setDescription('')
  }

  return (
    <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
      <h2 style={{ color: '#A51C30' }}>Thêm sản phẩm mới</h2>
      <input placeholder="Tên sản phẩm" value={name} onChange={e => setName(e.target.value)}
             style={{ width: '100%', padding: '12px', margin: '10px 0' }} />
      <input placeholder="Giá (số)" type="number" value={price} onChange={e => setPrice(e.target.value)}
             style={{ width: '100%', padding: '12px', margin: '10px 0' }} />
      <input placeholder="Link ảnh (dùng ảnh bất kỳ)" value={image} onChange={e => setImage(e.target.value)}
             style={{ width: '100%', padding: '12px', margin: '10px 0' }} />
      <textarea placeholder="Mô tả (tùy chọn)" value={description} onChange={e => setDescription(e.target.value)}
                style={{ width: '100%', padding: '12px', margin: '10px 0', height: '100px' }} />
      <button onClick={handleAdd} style={{
        padding: '15px 30px', background: '#A51C30', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px'
      }}>
        THÊM SẢN PHẨM
      </button>
    </div>
  )
}