// src/components/Admin/OrderDetailModal.jsx
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "../../supabaseclient";

export default function OrderDetailModal({ order, onClose, onOrderUpdated }) {
  if (!order) return null;

  const invoiceRef = useRef(null);
  const [note, setNote] = useState(order.admin_note || "");
  const [savingNote, setSavingNote] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // 📝 Lưu Admin Note vào Supabase
  const handleSaveNote = async () => {
    setSavingNote(true);

    const { error } = await supabase
      .from("orders")
      .update({ admin_note: note })
      .eq("id", order.id);

    setSavingNote(false);

    if (error) {
      alert("Lưu ghi chú thất bại!");
      return;
    }

    if (onOrderUpdated) onOrderUpdated({ ...order, admin_note: note });

    alert("Đã lưu ghi chú nội bộ!");
  };

  // 📄 Xuất PDF
  const exportPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`order_${order.id}.pdf`);
  };

  // 🖼 Tải ảnh PNG
  const downloadImage = async () => {
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `order_${order.id}.png`;
    link.click();
  };

  // 📧 Gửi email xác nhận (cần API backend của bạn)
  const sendEmail = async () => {
    setEmailSending(true);

    try {
      const res = await fetch("/api/send-order-email", {
        method: "POST",
        body: JSON.stringify({ orderId: order.id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Lỗi gửi email");

      alert("Email xác nhận đã được gửi.");
    } catch (err) {
      console.error(err);
      alert("Gửi email thất bại. Kiểm tra lại API!");
    }

    setEmailSending(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 750,
          background: "#1e1e1e",
          color: "white",
          borderRadius: 12,
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ===== HEADER ===== */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 22 }}>Chi tiết đơn hàng</h2>
            <p style={{ margin: 0, marginTop: 6, color: "#ccc" }}>
              Mã đơn: <strong>{order.id.slice(-8).toUpperCase()}</strong>
            </p>
            <p style={{ margin: 0, color: "#999", fontSize: 13 }}>
              Ngày tạo:{" "}
              {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: "white",
                padding: 6,
                borderRadius: 8,
                display: "inline-block",
              }}
            >
              <QRCode
                size={70}
                value={JSON.stringify({
                  id: order.id,
                  total: order.total_price,
                })}
              />
            </div>
            <p style={{ fontSize: 11, color: "#ccc", marginTop: 4 }}>
              QR đơn hàng
            </p>
          </div>
        </div>

        {/* ===== INVOICE CONTENT ===== */}
        <div
          ref={invoiceRef}
          style={{
            padding: "24px",
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          {/* KHÁCH HÀNG */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 10 }}>👤 Khách hàng</h3>
            <p>Tên: {order.profiles?.full_name}</p>
            <p>SĐT: {order.profiles?.phone}</p>
            <p>Địa chỉ: {order.profiles?.address}</p>
          </div>

          {/* ADMIN NOTE */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 10 }}>📝 Ghi chú nội bộ (Admin)</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: "100%",
                minHeight: 80,
                background: "#2a2a2a",
                color: "white",
                border: "1px solid #444",
                borderRadius: 8,
                padding: 10,
                fontSize: 14,
                resize: "vertical",
              }}
              placeholder="Ghi chú chỉ admin thấy..."
            />

            <button
              onClick={handleSaveNote}
              disabled={savingNote}
              style={{
                marginTop: 8,
                padding: "8px 14px",
                background: "#2ecc71",
                border: "none",
                borderRadius: 6,
                color: "#000",
                cursor: "pointer",
                fontWeight: "bold",
                opacity: savingNote ? 0.5 : 1,
              }}
            >
              {savingNote ? "Đang lưu..." : "Lưu ghi chú"}
            </button>
          </div>

          {/* SẢN PHẨM */}
          <div>
            <h3 style={{ marginBottom: 10 }}>🛒 Sản phẩm</h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#333" }}>
                  <th style={th}>Ảnh</th>
                  <th style={th}>Tên</th>
                  <th style={th}>SL</th>
                  <th style={th}>Giá</th>
                  <th style={th}>Tạm tính</th>
                </tr>
              </thead>

              <tbody>
                {order.order_items.map((item, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#262626" : "#1f1f1f",
                    }}
                  >
                    <td style={td}>
                      <img
                        src={item.products?.image}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 6,
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td style={td}>{item.products?.name}</td>
                    <td style={{ ...td, textAlign: "center" }}>
                      {item.quantity}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      {item.price_at_purchase.toLocaleString()}₫
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      {(item.quantity * item.price_at_purchase).toLocaleString()}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2
              style={{
                textAlign: "right",
                marginTop: 20,
                color: "#ff4d4d",
              }}
            >
              Tổng: {order.total_price.toLocaleString()}₫
            </h2>
          </div>
        </div>

        {/* ===== FOOTER BUTTONS ===== */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #333",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button style={btnGray} onClick={exportPDF}>
            📄 Xuất PDF
          </button>

          <button style={btnGray} onClick={downloadImage}>
            🖼 Tải ảnh hóa đơn
          </button>

          <button
            style={btnBlue}
            disabled={emailSending}
            onClick={sendEmail}
          >
            {emailSending ? "Đang gửi..." : "📧 Gửi email xác nhận"}
          </button>

          <button style={btnRed} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: 10,
  textAlign: "left",
  borderBottom: "1px solid #444",
};

const td = {
  padding: 10,
  borderBottom: "1px solid #333",
};

const btnGray = {
  padding: "10px 16px",
  background: "#444",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
};

const btnBlue = {
  padding: "10px 16px",
  background: "#3498db",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
};

const btnRed = {
  padding: "10px 16px",
  background: "#e74c3c",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
};
