// src/components/CartDrawer.jsx
import { useEffect } from 'react';
// KHÔNG CẦN import { create } from 'zustand'; nữa vì đã ở tệp store
import { useCartStore } from '../store/useCartStore'; // Dòng này giờ là đúng

// Component Drawer chính
export default function CartDrawer() {
  const { isOpen, close, getCount } = useCartStore();

  // Khởi tạo giỏ hàng ngay khi component mount (chỉ chạy 1 lần)
  // Lưu ý: useCartStore.getState().initCart() là cách đúng để gọi hàm initCart
  useEffect(() => {
    useCartStore.getState().initCart();
  }, []);
  
  // ... (Phần còn lại của component CartDrawer giữ nguyên) ...
  
  if (!isOpen) return null;

  const count = getCount();

  return (
    // ... (Phần JSX giữ nguyên) ...
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          // ... style
        }}
      />

      {/* Drawer */}
      <div
        style={{
          // ... style
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #333', position: 'relative' }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontFamily: '"Playfair Display", serif' }}>
            Giỏ hàng ({count})
          </h2>
          {/* ... nút đóng ... */}
        </div>

        {/* Body - Danh sách sản phẩm */}
        {/* ... */}
        
        {/* Footer - Tổng tiền & Thanh toán */}
        {/* ... */}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// Style nút +/- số lượng (đã xoá vì không sử dụng)

// Nút mở giỏ hàng (dùng ở Header)
export function CartButton() {
  const { open, getCount } = useCartStore();
  const count = getCount();

  return (
    // ... (Phần JSX giữ nguyên) ...
    <button
      onClick={open}
      style={{
        // ... style
      }}
      onMouseEnter={(e) => (e.target.style.background = '#c51c35')}
      onMouseLeave={(e) => (e.target.style.background = '#A51C30')}
    >
      <span>Giỏ hàng</span>
      {count > 0 && (
        <span
          style={{
            // ... style
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}