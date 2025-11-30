// src/components/CartDrawer.jsx
import { useEffect, useState, useRef } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";

const FREE_SHIP_AT = 300000;

export default function CartDrawerLeft() {
  const {
    isOpen,
    close,
    items,
    totalPrice,
    getCount,
    initCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    recentViewed,
  } = useCartStore();

  const navigate = useNavigate();

  const drawerRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const dragging = useRef(false);

  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const shippingFee = 25000;
  const rawTotal = totalPrice();

  useEffect(() => {
    initCart();
  }, []);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    dragging.current = true;
  };

  const onTouchMove = (e) => {
    if (!dragging.current) return;
    currentX.current = e.touches[0].clientX;
    const dx = currentX.current - startX.current;
    if (dx < 0) drawerRef.current.style.transform = `translateX(${dx}px)`;
  };

  const onTouchEnd = () => {
    dragging.current = false;
    const dx = currentX.current - startX.current;
    if (dx < -80) close();
    else drawerRef.current.style.transform = "translateX(0)";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 998,
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "380px",
          height: "100vh",
          background: "#111118",
          color: "white",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          boxShadow: "6px 0 25px rgba(0,0,0,0.5)",
          transform: "translateX(0)",
          animation: "slideLeft 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0 }}>Giỏ hàng ({getCount()})</h2>

          <button
            onClick={close}
            style={{
              background: "transparent",
              border: "none",
              color: "#ccc",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 20px",
          }}
        >
          {items.length === 0 ? (
            <p style={{ padding: 40, textAlign: "center", color: "#aaa" }}>
              Giỏ hàng trống...
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "16px 0",
                  borderBottom: "1px solid #333",
                }}
              >
                <img
                  src={item.image}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <b>{item.name}</b>
                  <p style={{ margin: "6px 0", color: "#f29b9b" }}>
                    {item.price.toLocaleString()}₫
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      style={qtyBtn}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      style={qtyBtn}
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        marginLeft: "auto",
                        color: "#ff6b6b",
                        background: "none",
                        border: "none",
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* ⭐⭐⭐ PHẦN 6 — Recently Viewed ⭐⭐⭐ */}
          {recentViewed?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ color: "#eee", marginBottom: 10 }}>
                Đã xem gần đây
              </h3>

              {recentViewed.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "10px 0",
                    cursor: "pointer",
                    borderBottom: "1px solid #222",
                  }}
                >
                  <img
                    src={p.image}
                    width={60}
                    height={60}
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <b>{p.name}</b>
                    <p style={{ margin: 0, color: "#f29b9b" }}>
                      {p.price.toLocaleString()}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: 20,
            background: "#0b0b10",
            borderTop: "1px solid #333",
          }}
        >
          {/* Tiết kiệm */}
          {(() => {
            let comboDiscount = 0;

            items.forEach((item) => {
              if (item.quantity >= 3)
                comboDiscount += Math.floor(item.price * item.quantity * 0.1);
              else if (item.quantity === 2)
                comboDiscount += Math.floor(item.price * item.quantity * 0.05);
            });

            const freeShipDiscount =
              rawTotal >= FREE_SHIP_AT ? shippingFee : 0;

            const voucherDiscount = appliedVoucher
              ? Math.floor(rawTotal * appliedVoucher / 100)
              : 0;

            const totalSaved =
              comboDiscount + voucherDiscount + freeShipDiscount;

            return (
              totalSaved > 0 && (
                <div
                  style={{
                    background: "#1a1a22",
                    padding: "12px",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    color: "#7CFFB2",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "15px",
                  }}
                >
                  🎉 Bạn đã tiết kiệm được{" "}
                  <span style={{ color: "#3CFF9A" }}>
                    {totalSaved.toLocaleString()}₫
                  </span>
                </div>
              )
            );
          })()}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            <span>Tổng:</span>
            <span>{totalPrice().toLocaleString()}₫</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: 12,
              borderRadius: 999,
              border: "none",
              background: "linear-gradient(135deg,#ff7676,#A51C30)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            Thanh toán
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

const qtyBtn = {
  width: 26,
  height: 26,
  borderRadius: "50%",
  border: "1px solid #555",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
};
