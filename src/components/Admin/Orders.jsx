// src/pages/admin/Orders.jsx
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseclient';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles(full_name, phone, address),
          order_items(
            quantity,
            price_at_purchase,
            products(name, image)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert('Cập nhật trạng thái thất bại!');
      console.error(error);
    } else {
      // Optimistic update
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status } : order
        )
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'shipping': return '#007BFF';
      case 'completed': return '#28A745';
      case 'cancelled': return '#DC3545';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Đang xử lý';
      case 'shipping': return 'Đang giao';
      case 'completed': return 'Hoàn tất';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Đang tải đơn hàng...</div>;
  }

  if (error) {
    return <div style={{ color: '#ff6b6b', textAlign: 'center', padding: '50px' }}>{error}</div>;
  }

  return (
    <div style={{ color: 'white', minHeight: '100vh' }}>
      <h1 style={{
        fontSize: '36px',
        marginBottom: '30px',
        fontFamily: '"Playfair Display", serif',
        textAlign: 'center'
      }}>
        Quản lý đơn hàng ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', fontSize: '18px', color: '#aaa' }}>
          Chưa có đơn hàng nào
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {orders.map(order => (
            <div
              key={order.id}
              style={{
                background: '#222',
                padding: '28px',
                borderRadius: '16px',
                border: '1px solid #333',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {/* Header: ID + Thời gian + Trạng thái */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <strong style={{ fontSize: '18px' }}>
                    Đơn hàng #{order.id.slice(-8).toUpperCase()}
                  </strong>
                  <span style={{ color: '#aaa', marginLeft: '12px' }}>
                    • {new Date(order.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: getStatusColor(order.status),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="pending">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Hoàn tất</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Thông tin khách hàng */}
              <div style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                <p><strong>Khách hàng:</strong> {order.profiles?.full_name || 'Khách lẻ'} • {order.profiles?.phone || 'Không có SĐT'}</p>
                <p><strong>Địa chỉ:</strong> {order.profiles?.address || 'Chưa cung cấp địa chỉ'}</p>
              </div>

              {/* Danh sách sản phẩm */}
              <div style={{ marginBottom: '16px' }}>
                <strong>Sản phẩm:</strong>
                <div style={{ marginTop: '8px', display: 'grid', gap: '8px' }}>
                  {order.order_items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.products?.image && (
                        <img
                          src={item.products.image}
                          alt={item.products.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div>{item.products?.name || 'Sản phẩm đã xóa'}</div>
                        <small style={{ color: '#aaa' }}>
                          {item.quantity} x {item.price_at_purchase.toLocaleString()}₫
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng tiền */}
              <div style={{
                textAlign: 'right',
                paddingTop: '16px',
                borderTop: '1px dashed #444',
                marginTop: '16px'
              }}>
                <span style={{
                  color: '#A51C30',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  Tổng: {order.total_price.toLocaleString()} ₫
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}