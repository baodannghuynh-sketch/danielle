// src/pages/AdminOrders.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { toast } from "react-toastify";

function formatPrice(vnd) {
  if (!vnd && vnd !== 0) return "";
  return Number(vnd).toLocaleString("vi-VN") + " ₫";
}

const STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const STATUS_COLORS = {
  pending: "#FFC107",
  confirmed: "#42A5F5",
  shipping: "#29B6F6",
  completed: "#66BB6A",
  cancelled: "#EF5350",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Không tải được danh sách đơn hàng!");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetail = async (order) => {
    setDetailOrder(order);
    setDetailItems([]);
    setDetailOpen(true);

    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (error) {
      console.error(error);
      toast.error("Không tải được chi tiết đơn hàng!");
    } else {
      setDetailItems(data || []);
    }
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailOrder(null);
    setDetailItems([]);
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    setUpdatingStatus(true);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại!");
    } else {
      toast.success("Đã cập nhật trạng thái đơn hàng.");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (detailOrder && detailOrder.id === orderId) {
        setDetailOrder((prev) => ({ ...prev, status: newStatus }));
      }
    }
    setUpdatingStatus(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 40px 80px",
        background: "radial-gradient(circle at top, #160a10 0, #050404 55%)",
        color: "#fff",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: '"Playfair Display", serif',
              fontSize: "42px",
              letterSpacing: "6px",
            }}
          >
            QUẢN LÝ ĐƠN HÀNG
          </h1>
          <p style={{ marginTop: "10px", color: "#bbb" }}>
            Xem trạng thái, chi tiết và thông tin khách hàng cho từng đơn.
          </p>
        </div>
      </div>

      {/* BẢNG ĐƠN HÀNG */}
      <div
        style={{
          background: "rgba(10,10,10,0.9)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
          padding: "24px",
          overflowX: "auto",
        }}
      >
        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <p
              style={{
                fontSize: "22px",
                letterSpacing: "3px",
                color: "#A51C30",
              }}
            >
              Đang tải danh sách đơn hàng...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <p style={{ fontSize: "20px", color: "#ccc" }}>
              Chưa có đơn hàng nào trong hệ thống.
            </p>
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  fontSize: "13px",
                  opacity: 0.8,
                }}
              >
                <th style={thStyle}>MÃ ĐƠN</th>
                <th style={thStyle}>KHÁCH HÀNG</th>
                <th style={thStyle}>TỔNG TIỀN</th>
                <th style={thStyle}>THANH TOÁN</th>
                <th style={thStyle}>TRẠNG THÁI</th>
                <th style={thStyle}>THỜI GIAN</th>
                <th style={{ ...thStyle, textAlign: "right" }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    borderBottom: "1px solid rgba(255,255,255,0.02)",
                  }}
                >
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontWeight: 600,
                        letterSpacing: "1px",
                      }}
                    >
                      #{String(o.id).padStart(6, "0")}
                    </span>
                  </td>

                  {/* KHÁCH */}
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>
                      {o.shipping_name || "—"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#aaa" }}>
                      {o.shipping_phone || ""}
                    </div>
                  </td>

                  {/* TỔNG TIỀN */}
                  <td style={tdStyle}>
                    <span
                      style={{
                        color: "#ffb3c0",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      {formatPrice(o.total_price)}
                    </span>
                  </td>

                  {/* THANH TOÁN */}
                  <td style={tdStyle}>
                    <div style={{ fontSize: "12px", color: "#ccc" }}>
                      <div>
                        Hình thức:{" "}
                        <strong>{o.payment_method || "Không rõ"}</strong>
                      </div>
                      <div>
                        Trạng thái:{" "}
                        <span
                          style={{
                            color:
                              o.payment_status === "paid"
                                ? "#66BB6A"
                                : o.payment_status === "pending"
                                ? "#FFC107"
                                : "#EF5350",
                          }}
                        >
                          {o.payment_status || "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* TRẠNG THÁI GIAO HÀNG */}
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.05)",
                          fontSize: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: STATUS_COLORS[o.status] || "#fff",
                          border: `1px solid ${
                            STATUS_COLORS[o.status] ||
                            "rgba(255,255,255,0.2)"
                          }`,
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: STATUS_COLORS[o.status] || "#ccc",
                          }}
                        ></span>
                        {STATUS_LABELS[o.status] || o.status || "Không rõ"}
                      </span>

                      <select
                        value={o.status || "pending"}
                        onChange={(e) =>
                          handleChangeStatus(o.id, e.target.value)
                        }
                        disabled={updatingStatus}
                        style={{
                          marginTop: 4,
                          padding: "6px 10px",
                          borderRadius: "999px",
                          border: "1px solid #333",
                          background: "#111",
                          color: "#eee",
                          fontSize: "12px",
                          outline: "none",
                          cursor: "pointer",
                          width: "100%",
                          maxWidth: "180px",
                        }}
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipping">Đang giao</option>
                        <option value="completed">Hoàn tất</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </td>

                  {/* THỜI GIAN */}
                  <td style={tdStyle}>
                    {o.created_at
                      ? new Date(o.created_at).toLocaleString("vi-VN")
                      : "—"}
                  </td>

                  {/* ACTION */}
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      onClick={() => openOrderDetail(o)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "999px",
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: "transparent",
                        color: "#fff",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {detailOpen && detailOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "860px",
              maxWidth: "95%",
              maxHeight: "90vh",
              overflow: "auto",
              background: "#0b090a",
              borderRadius: "26px",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
              padding: "28px 30px 34px",
              position: "relative",
            }}
          >
            <button
              onClick={closeDetail}
              style={{
                position: "absolute",
                right: 18,
                top: 16,
                background: "transparent",
                border: "none",
                color: "#aaa",
                cursor: "pointer",
                fontSize: "22px",
              }}
            >
              ×
            </button>

            <h2
              style={{
                margin: "0 0 8px",
                fontFamily: '"Playfair Display", serif',
                fontSize: "26px",
                letterSpacing: "3px",
              }}
            >
              ĐƠN HÀNG #{String(detailOrder.id).padStart(6, "0")}
            </h2>
            <p style={{ color: "#bbb", marginBottom: "10px" }}>
              {detailOrder.created_at
                ? new Date(detailOrder.created_at).toLocaleString("vi-VN")
                : ""}
            </p>
            <p style={{ color: "#bbb", marginBottom: "20px", fontSize: "13px" }}>
              Thanh toán:{" "}
              <strong>{detailOrder.payment_method || "Không rõ"}</strong> •{" "}
              <span
                style={{
                  color:
                    detailOrder.payment_status === "paid"
                      ? "#66BB6A"
                      : detailOrder.payment_status === "pending"
                      ? "#FFC107"
                      : "#EF5350",
                }}
              >
                {detailOrder.payment_status || "Chưa cập nhật"}
              </span>
            </p>

            {/* Info KH + ĐỊA CHỈ như cũ + BẢNG CHI TIẾT SẢN PHẨM (giữ nguyên phần bạn đã có) */}
            {/* ... (phần còn lại giữ nguyên code bạn gửi trước, tôi không lặp lại vì chỉ thêm vài dòng phía trên) */}
            {/* Bạn có thể copy phần "info khách + địa chỉ + danh sách sản phẩm" y như file cũ của bạn vào đây */}
            {/* (Nếu cần, tôi có thể gửi lại full modal chi tiết, nhưng logic không đổi) */}

          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "14px 14px",
  fontWeight: 600,
  color: "#bbb",
  textTransform: "uppercase",
  fontSize: "11px",
  letterSpacing: "1px",
};

const tdStyle = {
  padding: "18px 14px",
  fontSize: "14px",
  verticalAlign: "middle",
};
