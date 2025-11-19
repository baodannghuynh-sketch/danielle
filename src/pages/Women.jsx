// src/pages/Women.jsx
import { Link } from 'react-router-dom'

const products = [
  { id: 5, name: "Nhẫn Kim Cương 1.5 Carat", price: "198.000.000đ", img: "https://images.unsplash.com/photo-1608043152269-6042f9f5f6f4?w=800" },
  { id: 6, name: "Vòng cổ Perle & Or", price: "89.900.000đ", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800" },
  { id: 7, name: "Bông tai Vàng Trắng 18K", price: "56.800.000đ", img: "https://images.unsplash.com/photo-1605100804764-5081959e1416?w=800" },
  { id: 8, name: "Lắc tay Tennis Diamond", price: "148.000.000đ", img: "https://images.unsplash.com/photo-1611591437281-46027f0e2e0e?w=800" },
]

export default function Women() {
  return (
    <div style={{ paddingTop: "120px", minHeight: "100vh", background: "#faf9f7" }}>
      <div style={{ textAlign: "center", padding: "100px 20px", background: "linear-gradient(135deg, #A51C30, #800000)" }}>
        <h1 style={{ fontSize: "72px", color: "white", letterSpacing: "14px", margin: "0 0 20px" }}>TRANG SỨC NỮ</h1>
        <p style={{ fontSize: "23px", color: "#fff", maxWidth: "800px", margin: "0 auto" }}>
          Tinh tế, thanh lịch và đầy nữ tính. Tôn vinh vẻ đẹp tự nhiên của người phụ nữ.
        </p>
      </div>

      <div style={{
        maxWidth: "1400px",
        margin: "80px auto",
        padding: "0 5%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "60px"
      }}>
        {products.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 15px 40px rgba(165,28,48,0.1)",
              transition: "all 0.5s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "420px", objectFit: "cover" }} />
              <div style={{ padding: "30px", textAlign: "center" }}>
                <h3 style={{ fontSize: "21px", margin: "0 0 12px", letterSpacing: "3px" }}>{p.name}</h3>
                <p style={{ color: "#A51C30", fontSize: "22px", fontWeight: "bold" }}>{p.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}