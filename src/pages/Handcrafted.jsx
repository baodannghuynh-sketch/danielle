// src/pages/Handcrafted.jsx
import { Link } from 'react-router-dom'

const products = [
  { id: 9, name: "Nhẫn Cưới Eternal Love", price: "298.000.000đ", img: "https://images.unsplash.com/photo-1583212292447-97e9d46d96e9?w=800" },
  { id: 10, name: "Vòng cổ Heritage Diamond", price: "388.000.000đ", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" },
  { id: 11, name: "Bông tai Royal Drop", price: "188.000.000đ", img: "https://images.unsplash.com/photo-1591637347783-0e31d46b9996?w=800" },
  { id: 12, name: "Lắc tay Masterpiece", price: "268.000.000đ", img: "https://images.unsplash.com/photo-1611591437281-46027f0e2e0e?w=800" },
]

export default function Handcrafted() {
  return (
    <div style={{ paddingTop: "120px", minHeight: "100vh", background: "#000", color: "#fff" }}>
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <h1 style={{ fontSize: "76px", letterSpacing: "18px", margin: "0 0 30px", fontWeight: "300" }}>
          THỦ CÔNG TINH XẢO
        </h1>
        <p style={{ fontSize: "24px", maxWidth: "900px", margin: "0 auto", opacity: 0.9, lineHeight: "1.8" }}>
          Mỗi sản phẩm là một tác phẩm nghệ thuật – được chế tác hoàn toàn bằng tay bởi những nghệ nhân hàng đầu thế giới.
        </p>
        <div style={{ height: "2px", width: "120px", background: "#A51C30", margin: "50px auto" }}></div>
      </div>

      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "0 5%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        gap: "80px"
      }}>
        {products.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "20px",
              transition: "all 0.6s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-20px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "520px", objectFit: "cover", filter: "brightness(0.9)" }} />
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, black)",
                padding: "60px 30px 30px",
                textAlign: "center"
              }}>
                <h3 style={{ fontSize: "26px", margin: "0 0 10px", letterSpacing: "4px" }}>{p.name}</h3>
                <p style={{ color: "#A51C30", fontSize: "24px", fontWeight: "bold" }}>{p.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}