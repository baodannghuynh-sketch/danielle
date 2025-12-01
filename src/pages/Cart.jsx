// src/pages/Cart.jsx
import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    initCart,
  } = useCartStore();

  useEffect(() => {
    initCart();
    window.scrollTo(0, 0);
  }, [initCart]);

  if (!items || items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <h2
          style={{
            fontSize: "48px",
            marginBottom: "20px",
            letterSpacing: "6px",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          GIỎ HÀNG RỖNG
        </h2>
        <p style={{ opacity: 0.6, marginBottom: "40px" }}>
          Bạn chưa chọn tuyệt tác nào.
        </p>
        <Link
          to="/shop"
          style={{
            background: "#A51C30",
            padding: "18px 50px",
            color: "#fff",
            borderRadius: "50px",
            textDecoration: "none",
            fontSize: "18px",
            letterSpacing: "3px",
            fontWeight: "bold",
          }}
        >
          KHÁM PHÁ BỘ SƯU TẬP
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        paddingTop: "140px",
        paddingBottom: "200px",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          padding: "0 5%",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            marginBottom: "60px",
            letterSpacing: "10px",
            fontFamily: '"Playfair Display", serif',
            textAlign: "center",
          }}
        >
          YOUR CART
        </h1>

        {/* CART LIST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "60px",
          }}
        >
          <div>
            {items.map((item) => {
              const imageSrc = Array.isArray(item.image_url)
                ? item.image_url[0]
                : item.image_url || item.image || "";

              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                    padding: "30px 0",
                    borderBottom: "1px solid #222",
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      width: "180px",
                      height: "180px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "26px",
                        margin: 0,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        fontSize: "20px",
                        color: "#A51C30",
                        margin: "15px 0",
                      }}
                    >
                      {item.price.toLocaleString("vi-VN")} ₫
                    </p>

                    {/* QUANTITY */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={qtyBtnStyle}
                      >
                        -
                      </button>

                      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={qtyBtnStyle}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "transparent",
                      color: "#fff",
                      border: "none",
                      fontSize: "28px",
                      cursor: "pointer",
                      opacity: 0.5,
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "40px",
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                marginBottom: "30px",
                letterSpacing: "4px",
              }}
            >
              TỔNG ĐƠN
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                fontSize: "20px",
              }}
            >
              <span>Tạm tính</span>
              <span>{totalPrice().toLocaleString("vi-VN")} ₫</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "22px",
                fontWeight: "bold",
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #222",
                color: "#A51C30",
              }}
            >
              <span>Tổng cộng</span>
              <span>{totalPrice().toLocaleString("vi-VN")} ₫</span>
            </div>

            <Link
              to="/checkout"
              style={{
                marginTop: "40px",
                display: "block",
                background: "#A51C30",
                padding: "18px 50px",
                textAlign: "center",
                borderRadius: "50px",
                color: "#fff",
                fontSize: "18px",
                letterSpacing: "3px",
                fontWeight: "bold",
                textDecoration: "none",
                boxShadow: "0 15px 40px rgba(165,28,48,0.5)",
              }}
            >
              TIẾN HÀNH THANH TOÁN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* STYLE BUTTON GIẢM/TĂNG */
const qtyBtnStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#A51C30",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "bold",
  boxShadow: "0 8px 20px rgba(165,28,48,0.5)",
};
