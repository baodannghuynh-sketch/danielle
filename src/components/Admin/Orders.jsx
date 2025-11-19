// src/pages/admin/Orders.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseclient'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(full_name, phone, address)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
  }

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchOrders()
  }

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '30px', fontFamily: '"Playfair Display", serif' }}>
        Quản lý đơn hàng ({orders.length})
      </h1>

      {orders.map(order => (
        <div key={order.id} style={{ background: '#222', padding: '24px', borderRadius: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <strong>Đơn hàng #{order.id.slice(0,8)}</strong> • {new Date(order.created_at).toLocaleString('vi-VN')}
              <p style={{ margin: '8px 0' }}>
                <strong>Khách:</strong> {order.profiles?.full_name || 'Chưa có tên'} • {order.profiles?.phone}
              </p>
              <p><strong>Địa chỉ:</strong> {order.profiles?.address || 'Chưa có'}</p>
              <p style={{ color: '#A51C30', fontSize: '20px', fontWeight: 'bold', margin: '10px 0' }}>
                Tổng: {order.total_price.toLocaleString()} ₫
              </p>
            </div>
            <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} style={selectStyle}>
              <option value="pending">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="completed">Hoàn tất</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}

const selectStyle = { padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#A51C30', color: 'white', fontSize: '16px' }