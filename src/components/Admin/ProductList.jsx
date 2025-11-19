import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseclient'

export default function ProductList() {
  const [products, setProducts] = useState([])

  const load = () => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setProducts(data || []))
  }

  useEffect(() => { load() }, [])

  const deleteProduct = async (id) => {
    if (confirm('Xóa sản phẩm này?')) {
      await supabase.from('products').delete().eq('id', id)
      load()
    }
  }

  return (
    <div>
      <h2 style={{ color: '#A51C30' }}>Danh sách sản phẩm</h2>
      {products.map(p => (
        <div key={p.id} style={{ border: '1px solid #ddd', padding: '20px', margin: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{p.name}</strong> - {p.price?.toLocaleString()}₫
            <img src={p.images?.[0]} alt="" style={{ width: '80px', marginLeft: '20px', verticalAlign: 'middle' }} />
          </div>
          <button onClick={() => deleteProduct(p.id)} style={{ background: '#c0392b', color: 'white', padding: '10px 20px', border: 'none' }}>
            Xóa
          </button>
        </div>
      ))}
    </div>
  )
}