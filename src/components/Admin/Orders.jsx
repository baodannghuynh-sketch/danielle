// src/components/admin/Orders.jsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseclient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles(full_name, phone, address),
        order_items(
          quantity,
          price,
          products(name, main_image_url)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi Supabase:", error);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div style={{ padding: 40, color: "white", fontSize: 20 }}>
        Đang tải đơn hàng...
      </div>
    );
  }

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        Đơn hàng ({orders.length})
      </h1>

      {orders.length === 0 && (
        <p style={{ textAlign: "center", padding: 50 }}>Không có đơn hàng</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            padding: 20,
            background: "#111",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 22 }}>
            Đơn hàng #{order.id.substring(0, 8)}
          </h3>

          <p>Khách hàng: {order.profiles?.full_name || "—"}</p>
          <p>SĐT: {order.profiles?.phone || "—"}</p>
          <p>Địa chỉ: {order.profiles?.address || "—"}</p>

          <p>
            Tổng tiền:{" "}
            <strong style={{ color: "#A51C30" }}>
              {Number(order.total_price).toLocaleString()}₫
            </strong>
          </p>

          <p>Trạng thái: {order.status}</p>

          <div style={{ marginTop: 20 }}>
            <h4>Sản phẩm:</h4>

            {order.order_items?.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 10,
                }}
              >
                <img
                  src={item.products?.main_image_url}
                  alt=""
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />

                <div>
                  <p style={{ margin: 0, fontSize: 16 }}>
                    {item.products?.name}
                  </p>
                  <p style={{ margin: 0, color: "#bbb" }}>
                    SL: {item.quantity} ×{" "}
                    {Number(item.price).toLocaleString()}₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
