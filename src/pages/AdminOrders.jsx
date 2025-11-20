// src/pages/admin/Orders.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';

const statusConfig = {
  pending: { label: 'Đang xử lý', color: '#FFA726', bg: 'rgba(255,167,38,0.15)' },
  shipping: { label: 'Đang giao', color: '#42A5F5', bg: 'rgba(66,165,245,0.15)' },
  completed: { label: 'Hoàn tất', color: '#66BB6A', bg: 'rgba(102,187,106,0.15)' },
  cancelled: { label: 'Đã hủy', color: '#EF5350', bg: 'rgba(239,83,80,0.15)' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles(full_name, phone, address),
        order_items(
          quantity,
          price_at_purchase,
          products(name, image_url)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      alert('Lỗi tải đơn hàng: ' + error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrders();
    };
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert('Cập nhật thất bại!');
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', fontSize: '24px', color: '#aaa' }}>
        Đang tải đơn hàng...
      </div>
    );
  }

  return (
    <div>
      <h1 style={{
        fontSize: '48px',
        marginBottom: '50px',
        fontFamily: '"Playfair Display", serif',
        color: '#A51C30',
        textAlign: 'center',
        background: 'linear-gradient(90deg, #A51C30, #ff6b6b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        Quản lý đơn hàng ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '120px 40px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '24px',
          border: '2px dashed #333'
        }}>
          <p style={{ fontSize: '28px', color: '#666', margin: '0 0 16px' }}>Chưa có đơn hàng nào</p>
          <p style={{ color: '#aaa' }}>Khi có khách đặt hàng, thông tin sẽ hiện ở đây</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '32px' }}>
          {orders.map(order => {
            const config = statusConfig[order.status || 'pending'];
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  border: '1px solid #333',
                  transition: 'all 0.4s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Header đơn hàng */}
                <div style={{
                  padding: '32px',
                  background: isExpanded ? 'rgba(165,28,48,0.15)' : 'transparent',
                  borderBottom: isExpanded ? '1px solid #333' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
                        Đơn hàng #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <span style={{
                        background: config.bg,
                        color: config.color,
                        padding: '8px 20px',
                        borderRadius: '30px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                      }}>
                        {config.label}
                      </span>
                    </div>

                    <div style={{ color: '#aaa', fontSize: '15px' }}>
                      <strong>Khách:</strong> {order.profiles?.full_name || 'Khách lẻ'} • {order.profiles?.phone || 'Không có SĐT'}
                      <br />
                      <strong>Ngày đặt:</strong> {formatDate(order.created_at)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#A51C30',
                      margin: '0 0 8px'
                    }}>
                      {order.total_price.toLocaleString()} ₫
                    </p>
                    <span style={{ fontSize: '28px', color: '#aaa' }}>
                      {isExpanded ? 'Up' : 'Down'}
                    </span>
                  </div>
                </div>

                {/* Chi tiết đơn hàng (khi mở rộng) */}
                {isExpanded && (
                  <div style={{ padding: '32px', background: '#111', borderTop: '1px solid #333' }}>
                    <div style={{ marginBottom: '30px' }}>
                      <h4 style={{ margin: '0 0 16px', color: '#A51C30', fontSize: '20px' }}>Thông tin giao hàng</h4>
                      <p style={{ margin: '8px 0', color: '#ddd' }}>
                        <strong>Họ tên:</strong> {order.profiles?.full_name || 'Chưa cung cấp'}
                      </p>
                      <p style={{ margin: '8px 0', color: '#ddd' }}>
                        <strong>SĐT:</strong> {order.profiles?.phone || 'Chưa cung cấp'}
                      </p>
                      <p style={{ margin: '8px 0', color: '#ddd' }}>
                        <strong>Địa chỉ:</strong> {order.profiles?.address || 'Chưa cung cấp'}
                      </p>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                      <h4 style={{ margin: '0 0 20px', color: '#A51C30', fontSize: '20px' }}>
                        Sản phẩm ({order.order_items?.length || 0})
                      </h4>
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {order.order_items?.map((item, i) => (
                          <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            padding: '16px',
                            background: '#222',
                            borderRadius: '16px'
                          }}>
                            <img
                              src={Array.isArray(item.products?.image_url) 
                                ? item.products.image_url[0] 
                                : item.products?.image_url || 'https://via.placeholder.com/80'}
                              alt={item.products?.name}
                              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                            />
                            <div style={{ flex: 1 }}>
                              <h5 style={{ margin: '0 0 8px', fontSize: '16px' }}>{item.products?.name || 'Sản phẩm đã xóa'}</h5>
                              <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                                {item.quantity} × {item.price_at_purchase.toLocaleString()} ₫
                              </p>
                            </div>
                            <strong style={{ color: '#A51C30' }}>
                              {(item.quantity * item.price_at_purchase).toLocaleString()} ₫
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0 0 8px', fontSize: '18px' }}>
                          <strong>Tổng cộng:</strong> <span style={{ color: '#A51C30', fontSize: '28px' }}>{order.total_price.toLocaleString()} ₫</span>
                        </p>
                      </div>

                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(order.id, e.target.value);
                        }}
                        style={{
                          padding: '16px 28px',
                          background: '#A51C30',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: '0 10px 30px rgba(165,28,48,0.4)'
                        }}
                      >
                        <option value="pending">Đang xử lý</option>
                        <option value="shipping">Đang giao hàng</option>
                        <option value="completed">Hoàn tất</option>
                        <option value="cancelled">Hủy đơn</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}