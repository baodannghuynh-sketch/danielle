// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseclient';
import ProductForm from '../components/Admin/ProductForm';
import ProductList from '../components/Admin/ProductList';
import AdminOrders from '../../components/admin/Orders';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  // Kiểm tra đăng nhập + lấy thống kê
  useEffect(() => {
    const checkAuthAndFetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Kiểm tra quyền admin (tùy chọn)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert('Bạn không có quyền truy cập trang quản trị!');
        navigate('/');
        return;
      }

      // Lấy thống kê
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('total_price, status')
      ]);

      const totalRevenue = ordersRes.data
        ?.filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_price, 0) || 0;

      setStats({
        products: productsRes.count || 0,
        orders: ordersRes.data?.length || 0,
        revenue: totalRevenue
      });
      setLoading(false);
    };

    checkAuthAndFetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#111',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
      }}>
        Đang tải Admin Panel...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
      color: 'white',
      padding: '100px 5vw 80px',
      fontFamily: '"Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '300',
          letterSpacing: '12px',
          background: 'linear-gradient(90deg, #A51C30, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 16px',
          fontFamily: '"Playfair Display", serif'
        }}>
          DANIELLE
        </h1>
        <p style={{ fontSize: '24px', color: '#aaa', letterSpacing: '4px', margin: 0 }}>
          LUXURY ADMIN PANEL
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '60px'
      }}>
        {[
          { label: 'Tổng sản phẩm', value: stats.products, color: '#A51C30' },
          { label: 'Tổng đơn hàng', value: stats.orders, color: '#0066cc' },
          { label: 'Doanh thu', value: `${(stats.revenue / 1000000).toFixed(1)}M ₫`, color: '#28A745' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '32px',
            borderRadius: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.4s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color, margin: '0 0 8px' }}>
              {stat.value}
            </p>
            <p style={{ color: '#aaa', margin: 0, letterSpacing: '2px' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { id: 'products', label: 'Sản phẩm', icon: 'Diamond' },
            { id: 'orders', label: 'Đơn hàng', icon: 'Package' },
            { id: 'analytics', label: 'Thống kê', icon: 'BarChart' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '20px',
                background: activeTab === tab.id ? '#A51C30' : 'transparent',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: activeTab === tab.id ? 'bold' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'white'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '40px' }}>
          {activeTab === 'products' && (
            <div>
              <h2 style={{ fontSize: '32px', margin: '0 0 40px', color: '#A51C30' }}>
                Quản lý sản phẩm
              </h2>
              <ProductForm onSuccess={() => window.location.reload()} />
              <div style={{ margin: '60px 0' }}>
                <ProductList />
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '32px', margin: '0 0 40px', color: '#A51C30' }}>
                Quản lý đơn hàng
              </h2>
              <AdminOrders />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 style={{ fontSize: '32px', margin: '0 0 40px', color: '#A51C30' }}>
                Thống kê doanh thu
              </h2>
              <div style={{ height: '400px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: 'Th1', revenue: 285000000 },
                    { month: 'Th2', revenue: 320000000 },
                    { month: 'Th3', revenue: 480000000 },
                    { month: 'Th4', revenue: 620000000 },
                    { month: 'Th5', revenue: 590000000 },
                    { month: 'Th6', revenue: 750000000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip 
                      contentStyle={{ background: '#222', border: 'none', borderRadius: '12px' }}
                      formatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
                    />
                    <Bar dataKey="revenue" fill="#A51C30" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <button
          onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
          style={{
            padding: '16px 40px',
            background: 'transparent',
            color: '#ff6b6b',
            border: '2px solid #ff6b6b',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.4s ease'
          }}
          onMouseEnter={e => {
            e.target.style.background = '#ff6b6b';
            e.target.style.color = 'white';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#ff6b6b';
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}