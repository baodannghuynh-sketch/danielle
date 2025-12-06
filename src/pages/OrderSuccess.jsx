// src/pages/OrderSuccess.jsx
import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #2a0f16 0, #020202 60%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          textAlign: "center",
          padding: "50px 40px 60px",
          borderRadius: "30px",
          background: "rgba(0,0,0,0.7)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "2px solid #4CAF50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <span style={{ fontSize: "40px", color: "#4CAF50" }}>✓</span>
        </div>

        <h1
          style={{
            fontSize: "34px",
            marginBottom: "12px",
            fontFamily: '"Playfair Display", serif',
            letterSpacing: "3px",
          }}
        >
          ĐẶT HÀNG THÀNH CÔNG
        </h1>
        <p
          style={{
            color: "#ccc",
            marginBottom: "24px",
            fontSize: "15px",
            lineHeight: 1.7,
          }}
        >
          DANIELLE đã ghi nhận đơn hàng của bạn.
          <br />
          Chúng tôi sẽ liên hệ để xác nhận và chuẩn bị tác phẩm một cách hoàn
          hảo nhất.
        </p>

        {orderId && (
          <p
            style={{
              fontSize: "14px",
              color: "#aaa",
              marginBottom: "28px",
            }}
          >
            Mã đơn hàng của bạn:&nbsp;
            <span style={{ color: "#ffb3c0", fontWeight: "bold" }}>
              #{String(orderId).padStart(6, "0")}
            </span>
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Link
            to="/shop"
            style={{
              padding: "14px 28px",
              borderRadius: "40px",
              border: "none",
              background: "#A51C30",
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
              letterSpacing: "2px",
              fontSize: "13px",
            }}
          >
            TIẾP TỤC MUA SẮM
          </Link>
          <Link
            to="/"
            style={{
              padding: "14px 28px",
              borderRadius: "40px",
              border: "1px solid #555",
              color: "#ccc",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "2px",
            }}
          >
            VỀ TRANG CHỦ
          </Link>
        </div>
      </div>
    </div>
  );
}
