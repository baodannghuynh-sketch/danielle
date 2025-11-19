// src/pages/AdminOrders.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseclient'

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
    <div>
      <h1 style={{ fontSize: '42px', marginBottom: '40px', fontFamily: '"Playfair Display", serif', color: '#A51C30' }}>
        Quản lý đơn hàng ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <p style={{ fontSize: '20px', color: '#aaa', textAlign: 'center', marginTop: '100px' }}>Chưa có đơn hàng nào</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ background: '#222', padding: '30px', borderRadius: '16px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '18px' }}>Đơn hàng #{order.id.slice(0,8).toUpperCase()}</strong>
                <span style={{ marginLeft: '15px', color: '#aaa' }}>
                  {new Date(order.created_at).toLocaleString('vi-VN')}
                </span>
                <p style={{ margin: '12px 0' }}>
                  <strong>Khách:</strong> {order.profiles?.full_name || 'Chưa có tên'} • {order.profiles?.phone || 'Chưa có SĐT'}
                </p>
                <p><strong>Địa chỉ:</strong> {order.profiles?.address || 'Chưa có địa chỉ'}</p>
                <p style={{ fontSize: '22px', color: '#A51C30', fontWeight: 'bold', marginTop: '10px' }}>
                  Tổng tiền: {order.total_price.toLocaleString()} ₫
                </p>
              </div>
              <select
                value={order.status || 'pending'}
                onChange={e => updateStatus(order.id, e.target.value)}
                style={{ padding: '14px 20px', borderRadius: '10px', border: 'none', background: '#A51C30', color: 'white', fontSize: '16px', fontWeight: 'bold' }}
              >
                <option value="pending">Đang xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Hoàn tất</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  )
}