// src/components/admin/OrderCard.jsx
export default function OrderCard({ order, onUpdateStatus, onViewDetail }) {
  return (
    <div
      style={{
        background: "#222",
        padding: 20,
        borderRadius: 12,
        border: "1px solid #333",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Đơn #{order.id.slice(-6)}</strong>
        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(order.id, e.target.value)}
          style={{
            padding: 8,
            borderRadius: 8,
            background: "#333",
            color: "white",
          }}
        >
          <option value="pending">Đang xử lý</option>
          <option value="shipping">Đang giao</option>
          <option value="completed">Hoàn tất</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <p style={{ color: "#aaa" }}>
        {new Date(order.created_at).toLocaleString("vi-VN")}
      </p>

      <p>
        <strong>KH:</strong> {order.profiles?.full_name} —{" "}
        {order.profiles?.phone}
      </p>

      <p style={{ marginTop: 8 }}>
        <strong>Tổng:</strong>{" "}
        <span style={{ color: "#A51C30", fontWeight: "bold" }}>
          {order.total_price.toLocaleString()}₫
        </span>
      </p>

      <button
        onClick={onViewDetail}
        style={{
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #444",
          background: "#111",
          color: "white",
          cursor: "pointer",
        }}
      >
        Xem chi tiết
      </button>
    </div>
  );
}
