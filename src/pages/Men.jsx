// src/pages/Men.jsx
import { Link } from 'react-router-dom'

const products = [
  { id: 1, name: "Vòng tay Titan Đen", price: "28.900.000đ", img: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=800" },
  { id: 2, name: "Nhẫn Signet Vàng 18K", price: "42.500.000đ", img: "https://images.unsplash.com/photo-1600002223724-58e9b3f3e5b3?w=800" },
  { id: 3, name: "Dây chuyền Cuban Link", price: "68.000.000đ", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800" },
  { id: 4, name: "Lắc tay Bạc Ý 925", price: "18.800.000đ", img: "https://images.unsplash.com/photo-1591370862777-2d4e5e5e8c2c?w=800" },
]

export default function Men() {
  return (
    <div style={{ paddingTop: "120px", minHeight: "100vh", background: "#fff" }}>
      <div style={{ textAlign: "center", padding: "80px 20px", background: "#111" }}>
        <h1 style={{ fontSize: "68px", color: "white", letterSpacing: "12px", margin: "0 0 20px" }}>TRANG SỨC NAM</h1>
        <p style={{ fontSize: "22px", color: "#ccc", maxWidth: "800px", margin: "0 auto" }}>
          Phong cách mạnh mẽ, tối giản nhưng đầy cuốn hút. Dành cho quý ông hiện đại.
        </p>
      </div>

      <div style={{
        maxWidth: "1400px",
        margin: "80px auto",
        padding: "0 5%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "50px"
      }}>
        {products.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              background: "#fff",
              overflow: "hidden",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              transition: "transform 0.4s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-12px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "380px", objectFit: "cover" }} />
              <div style={{ padding: "25px", textAlign: "center" }}>
                <h3 style={{ fontSize: "20px", margin: "0 0 10px", letterSpacing: "2px" }}>{p.name}</h3>
                <p style={{ color: "#A51C30", fontSize: "20px", fontWeight: "bold" }}>{p.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}