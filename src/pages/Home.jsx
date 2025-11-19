// src/pages/Home.jsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ overflowX: "hidden" }}>

      {/* HERO FULL SCREEN – ĐỈNH CAO LUXURY */}
      <section style={{
        height: "100vh",
        minHeight: "700px",
        background: 'url("https://images.unsplash.com/photo-1605100804764-5081959e1416?q=80&w=3270&ixlib=rb-4.0.3") center/cover no-repeat fixed',
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white"
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(165,28,48,0.88) 0%, rgba(0,0,0,0.75) 100%)"
        }}></div>

        <div style={{ position: "relative", maxWidth: "1100px", padding: "0 20px" }}>
          <h1 style={{
            fontSize: "96px",
            fontWeight: "300",
            letterSpacing: "18px",
            margin: "0 0 24px 10px",
            fontFamily: "'Playfair Display', serif"
          }}>
            DANIELLE
          </h1>
          <p style={{
            fontSize: "29px",
            letterSpacing: "5px",
            margin: "20px 0 50px",
            fontWeight: "300",
            opacity: 0.96,
            fontFamily: "'Cormorant Garamond', serif"
          }}>
            LUXURY JEWELRY • HANDCRAFTED IN 18K GOLD & NATURAL DIAMONDS
          </p>
          <Link to="/shop" style={{
            display: "inline-block",
            padding: "20px 68px",
            background: "white",
            color: "#A51C30",
            fontWeight: "bold",
            letterSpacing: "4px",
            textDecoration: "none",
            fontSize: "17px",
            transition: "all 0.4s ease",
            boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
            borderRadius: "4px"
          }}
          onMouseEnter={e => e.target.style.background = "#f0f0f0"}
          onMouseLeave={e => e.target.style.background = "white"}
          >
            KHÁM PHÁ BỘ SƯU TẬP
          </Link>
        </div>
      </section>

      {/* SỨ MỆNH CỦA DANIELLE */}
      <section style={{ padding: "140px 8%", background: "#faf9f7", textAlign: "center" }}>
        <h2 style={{ fontSize: "52px", letterSpacing: "5px", marginBottom: "32px", color: "#111" }}>
          SỨ MỆNH CỦA DANIELLE
        </h2>
        <p style={{
          fontSize: "21px",
          maxWidth: "960px",
          margin: "0 auto 60px",
          lineHeight: "1.9",
          color: "#444",
          fontFamily: "'Cormorant Garamond', serif"
        }}>
          Mỗi món trang sức Danielle là một tác phẩm nghệ thuật – được chế tác thủ công từ vàng 18K nguyên khối
          và kim cương tự nhiên tuyển chọn kỹ lưỡng. Chúng tôi tin rằng vẻ đẹp thật sự nằm ở sự tinh tế và cá tính riêng.
        </p>
        <div style={{ height: "1px", width: "100px", background: "#A51C30", margin: "0 auto" }}></div>
      </section>

      {/* 3 Ô LINK SIÊU SANG – ĐIỀU HƯỚNG CHÍNH */}
      <section style={{ padding: "120px 8%", background: "white" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "70px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {/* TRANG SỨC NAM */}
          <Link to="/men" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              textAlign: "center",
              padding: "50px 30px",
              border: "1px solid #eee",
              borderRadius: "18px",
              transition: "all 0.6s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-20px)"
              e.currentTarget.style.boxShadow = "0 35px 70px rgba(165,28,48,0.18)"
              e.currentTarget.style.borderColor = "#A51C30"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
              e.currentTarget.style.borderColor = "#eee"
            }}
            >
              <div style={{ fontSize: "88px", marginBottom: "28px", color: "#A51C30" }}>Male</div>
              <h3 style={{ fontSize: "30px", letterSpacing: "5px", margin: "0 0 18px", color: "#111" }}>
                TRANG SỨC NAM
              </h3>
              <p style={{ color: "#666", lineHeight: "1.8", fontSize: "18px", marginBottom: "24px" }}>
                Phong cách mạnh mẽ, tối giản nhưng đầy cuốn hút. Dành cho quý ông hiện đại.
              </p>
              <span style={{
                color: "#A51C30",
                fontWeight: "bold",
                letterSpacing: "3px",
                fontSize: "16px",
                borderBottom: "2px solid #A51C30",
                paddingBottom: "6px"
              }}>
                XEM NGAY →
              </span>
            </div>
          </Link>

          {/* TRANG SỨC NỮ */}
          <Link to="/women" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              textAlign: "center",
              padding: "50px 30px",
              border: "1px solid #eee",
              borderRadius: "18px",
              transition: "all 0.6s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-20px)"
              e.currentTarget.style.boxShadow = "0 35px 70px rgba(165,28,48,0.18)"
              e.currentTarget.style.borderColor = "#A51C30"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
              e.currentTarget.style.borderColor = "#eee"
            }}
            >
              <div style={{ fontSize: "88px", marginBottom: "28px", color: "#A51C30" }}>Female</div>
              <h3 style={{ fontSize: "30px", letterSpacing: "5px", margin: "0 0 18px", color: "#111" }}>
                TRANG SỨC NỮ
              </h3>
              <p style={{ color: "#666", lineHeight: "1.8", fontSize: "18px", marginBottom: "24px" }}>
                Tinh tế, thanh lịch và đầy nữ tính. Tôn vinh vẻ đẹp tự nhiên của người phụ nữ.
              </p>
              <span style={{
                color: "#A51C30",
                fontWeight: "bold",
                letterSpacing: "3px",
                fontSize: "16px",
                borderBottom: "2px solid #A51C30",
                paddingBottom: "6px"
              }}>
                KHÁM PHÁ →
              </span>
            </div>
          </Link>

          {/* THỦ CÔNG TINH XẢO – NỔI BẬT NHẤT */}
          <Link to="/handcrafted" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              textAlign: "center",
              padding: "50px 30px",
              background: "#000",
              color: "white",
              borderRadius: "18px",
              transition: "all 0.6s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-20px)"
              e.currentTarget.style.boxShadow = "0 40px 80px rgba(0,0,0,0.6)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
            >
              <div style={{ fontSize: "88px", marginBottom: "28px", color: "#A51C30" }}>Diamond</div>
              <h3 style={{ fontSize: "30px", letterSpacing: "7px", margin: "0 0 18px" }}>
                THỦ CÔNG TINH XẢO
              </h3>
              <p style={{ opacity: 0.92, lineHeight: "1.8", fontSize: "18px", marginBottom: "24px" }}>
                Mỗi chi tiết đều được nghệ nhân chế tác bằng tay với tình yêu và sự tỉ mỉ tuyệt đối.
              </p>
              <span style={{
                color: "#fff",
                fontWeight: "bold",
                letterSpacing: "3px",
                fontSize: "16px",
                borderBottom: "3px solid #A51C30",
                paddingBottom: "8px"
              }}>
                XEM BỘ SƯU TẬP →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* FULL WIDTH BANNER */}
      <section style={{
        height: "80vh",
        minHeight: "650px",
        background: 'url("https://images.unsplash.com/photo-1611590027211-b954fd027b51?q=80&w=3270&ixlib=rb-4.0.3") center/cover no-repeat fixed',
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }}></div>
        <h2 style={{
          position: "relative",
          color: "white",
          fontSize: "76px",
          letterSpacing: "16px",
          fontWeight: "300",
          textAlign: "center",
          fontFamily: "'Playfair Display', serif"
        }}>
          TIMELESS ELEGANCE
        </h2>
      </section>

      {/* IMAGE + TEXT */}
      <section style={{ padding: "140px 8%", background: "#fff", display: "flex", gap: "100px", alignItems: "center", flexWrap: "wrap", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ flex: "1", minWidth: "320px" }}>
          <h2 style={{ fontSize: "48px", letterSpacing: "4px", marginBottom: "30px", color: "#111" }}>
            TẠO DẤU ẤN RIÊNG CỦA BẠN
          </h2>
          <p style={{ fontSize: "20px", lineHeight: "1.9", color: "#444", fontFamily: "'Cormorant Garamond', serif" }}>
            Tại Danielle, chúng tôi không chỉ bán trang sức – chúng tôi giúp bạn kể câu chuyện của chính mình.
            Từ chiếc nhẫn cưới đầu tiên đến vòng cổ kỷ niệm, mỗi món đều mang một ý nghĩa riêng.
          </p>
          <Link to="/shop" style={{
            display: "inline-block",
            marginTop: "40px",
            color: "#A51C30",
            fontWeight: "bold",
            letterSpacing: "3px",
            fontSize: "17px",
            textDecoration: "none",
            borderBottom: "3px solid #A51C30",
            paddingBottom: "6px"
          }}>
            XEM TẤT CẢ SẢN PHẨM →
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=927"
          alt="Danielle Signature"
          style={{ width: "560px", maxWidth: "100%", borderRadius: "16px", boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }}
        />
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "160px 8%", background: "#000", color: "white", textAlign: "center" }}>
        <h2 style={{ fontSize: "58px", letterSpacing: "10px", marginBottom: "24px", fontWeight: "300" }}>
          BẮT ĐẦU HÀNH TRÌNH CỦA BẠN
        </h2>
        <p style={{ fontSize: "24px", maxWidth: "860px", margin: "0 auto 60px", opacity: 0.9, lineHeight: "1.8" }}>
          Khám phá bộ sưu tập mới nhất và tìm ra món trang sức hoàn hảo dành riêng cho bạn.
        </p>
        <Link to="/shop" style={{
          padding: "22px 80px",
          background: "#A51C30",
          color: "white",
          fontSize: "19px",
          fontWeight: "bold",
          letterSpacing: "4px",
          textDecoration: "none",
          display: "inline-block",
          borderRadius: "4px",
          transition: "all 0.4s ease"
        }}
        onMouseEnter={e => e.target.style.background = "#8f1729"}
        onMouseLeave={e => e.target.style.background = "#A51C30"}
        >
          MUA NGAY
        </Link>
      </section>
    </div>
  )
}