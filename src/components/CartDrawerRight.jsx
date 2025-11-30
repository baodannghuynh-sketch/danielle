import { useCartStore } from "../store/useCartStore";

export default function CartDrawerRight() {
  const { wishlist, toggleWishlist } = useCartStore();

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: "350px",
        height: "100vh",
        background: "#16161f",
        color: "white",
        zIndex: 998,
        padding: "20px",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.4)",
      }}
    >
      <h2>Yêu thích ({wishlist.length})</h2>

      {wishlist.length === 0 ? (
        <p style={{ marginTop: 40, color: "#777", textAlign: "center" }}>
          Danh sách trống
        </p>
      ) : (
        wishlist.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 16,
              borderBottom: "1px solid #333",
              paddingBottom: 12,
            }}
          >
            <img
              src={item.image}
              width={70}
              height={70}
              style={{ borderRadius: 8, objectFit: "cover" }}
            />
            <div>
              <b>{item.name}</b>
              <p style={{ color: "#f29b9b" }}>
                {item.price.toLocaleString()}₫
              </p>

              <button
                onClick={() => toggleWishlist(item)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff6b6b",
                  cursor: "pointer",
                }}
              >
                Bỏ thích
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
// src/components/CartDrawerRight.jsx