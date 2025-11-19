// src/pages/Cart.jsx
import CartDrawer from '../components/CartDrawer'

export default function Cart() {
  return (
    <div style={{ padding: '120px 40px 100px', maxWidth: '1200px', margin: 'auto' }}>
      <h1 style={{ 
        fontSize: '48px', 
        textAlign: 'center', 
        color: '#A51C30', 
        marginBottom: '60px',
        fontWeight: 'bold'
      }}>
        GIỎ HÀNG CỦA BẠN
      </h1>
      <CartDrawer />
    </div>
  )
}