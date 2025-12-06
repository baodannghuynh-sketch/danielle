// src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { supabase } from "../supabaseclient";
import { useNavigate, Link } from "react-router-dom";

const PAYMENT_METHODS = [
  { key: "cod", label: "Thanh toán khi nhận hàng (COD)" },
  { key: "bank_transfer", label: "Chuyển khoản ngân hàng / QR" },
  { key: "card", label: "Thẻ ngân hàng (Visa / Mastercard – demo)" },
  { key: "momo", label: "Ví điện tử Momo" },
  { key: "paypal", label: "Paypal (quốc tế – demo)" },
];

export default function Checkout() {
  const { items, totalPrice, clear, getCount } = useCartStore();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = totalPrice();
  const itemCount = getCount();

  useEffect(() => {
    // Lấy user supabase (nếu đã login)
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };
    loadUser();
    window.scrollTo(0, 0);
  }, []);

  if (itemCount === 0) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "120px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontFamily: '"Playfair Display", serif',
            marginBottom: "20px",
          }}
        >
          Không có sản phẩm để thanh toán
        </h1>
        <Link
          to="/shop"
          style={{
            marginTop: "10px",
            padding: "16px 40px",
            borderRadius: "40px",
            background: "#A51C30",
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "2px",
            fontWeight: "bold",
          }}
        >
          QUAY LẠI SHOP
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.");
      return;
    }

    setLoadingSubmit(true);

    try {
      // 1. Tạo đơn hàng
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          shipping_name: name.trim(),
          shipping_phone: phone.trim(),
          shipping_address: address.trim(),
          shipping_note: note.trim() || null,
          total_price: total,
          status: "pending", // trạng thái giao hàng
          payment_method: paymentMethod,
          payment_status:
            paymentMethod === "cod" ? "unpaid" : "pending", // demo
        })
        .select("*")
        .single();

      if (orderError) {
        console.error(orderError);
        alert("Tạo đơn hàng thất bại. Vui lòng thử lại.");
        setLoadingSubmit(false);
        return;
      }

      const orderId = orderData.id;

      // 2. Tạo order_items
      const itemsPayload = items.map((it) => ({
        order_id: orderId,
        product_id: it.id,
        product_name: it.name,
        quantity: it.quantity,
        unit_price: it.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsError) {
        console.error(itemsError);
        alert(
          "Đã tạo đơn nhưng không lưu được chi tiết sản phẩm. Hãy báo lại cho admin."
        );
        setLoadingSubmit(false);
        return;
      }

      // 3. Clear cart & chuyển sang trang success
      clear();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra trong quá trình thanh toán.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        paddingTop: "120px",
        paddingBottom: "160px",
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 5%",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "60px",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT: FORM KHÁCH HÀNG */}
        <div>
          <h1
            style={{
              fontSize: "46px",
              marginBottom: "10px",
              fontFamily: '"Playfair Display", serif',
              letterSpacing: "4px",
            }}
          >
            THANH TOÁN
          </h1>
          <p style={{ color: "#aaa", marginBottom: "40px" }}>
            Hoàn tất thông tin để DANIELLE chuẩn bị tuyệt tác dành riêng cho
            bạn.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Họ tên */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* Số điện thoại */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* Địa chỉ */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Địa chỉ giao hàng</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
                required
              />
            </div>

            {/* Ghi chú */}
            <div style={{ marginBottom: "30px" }}>
              <label style={labelStyle}>Ghi chú (tuỳ chọn)</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Ví dụ: Giao ngoài giờ hành chính, gói quà, ghi lời chúc..."
              />
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div
              style={{
                marginTop: "40px",
                paddingTop: "30px",
                borderTop: "1px solid #333",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  marginBottom: "20px",
                  letterSpacing: "2px",
                }}
              >
                PHƯƠNG THỨC THANH TOÁN
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border:
                        paymentMethod === m.key
                          ? "1px solid #A51C30"
                          : "1px solid #333",
                      background:
                        paymentMethod === m.key
                          ? "rgba(165,28,48,0.15)"
                          : "#070707",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.key}
                      checked={paymentMethod === m.key}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>

              {/* Gợi ý demo cho QR / Momo / Card */}
              <p
                style={{
                  marginTop: "18px",
                  fontSize: "13px",
                  color: "#888",
                  lineHeight: 1.7,
                }}
              >
                Các phương thức như QR / Thẻ / Momo / Paypal đang ở chế độ demo
                (chưa kết nối cổng thanh toán). Đơn hàng vẫn sẽ được ghi nhận ở
                trạng thái{" "}
                <span style={{ color: "#ffc107" }}>chờ xác nhận</span>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loadingSubmit}
              style={{
                marginTop: "40px",
                width: "100%",
                padding: "18px",
                borderRadius: "999px",
                border: "none",
                background: "#A51C30",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                letterSpacing: "3px",
                cursor: "pointer",
                boxShadow: "0 18px 48px rgba(165,28,48,0.6)",
              }}
            >
              {loadingSubmit
                ? "ĐANG XỬ LÝ ĐƠN HÀNG..."
                : `XÁC NHẬN ĐẶT MUA (${total.toLocaleString()} ₫)`}
            </button>
          </form>
        </div>

        {/* RIGHT: TÓM TẮT ĐƠN HÀNG */}
        <div>
          <div
            style={{
              background:
                "radial-gradient(circle at top, #271018 0, #050505 60%)",
              borderRadius: "26px",
              padding: "26px 24px 30px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 26px 60px rgba(0,0,0,0.7)",
              position: "sticky",
              top: "120px",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                marginBottom: "24px",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              ĐƠN HÀNG CỦA BẠN
            </h2>

            <div
              style={{
                maxHeight: "260px",
                overflowY: "auto",
                paddingRight: "6px",
              }}
            >
              {items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "10px 4px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <img
                    src={
                      Array.isArray(it.image_url)
                        ? it.image_url[0]
                        : it.image_url
                    }
                    alt={it.name}
                    style={{
                      width: "62px",
                      height: "62px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "2px",
                      }}
                    >
                      {it.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#aaa",
                      }}
                    >
                      SL: {it.quantity}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#ffb3c0",
                    }}
                  >
                    {(it.price * it.quantity).toLocaleString()} ₫
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "20px",
                paddingTop: "18px",
                borderTop: "1px solid #333",
                fontSize: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span>Tạm tính</span>
                <span>{total.toLocaleString()} ₫</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span>Phí vận chuyển</span>
                <span style={{ color: "#4caf50" }}>Miễn phí</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "14px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                <span>TỔNG CỘNG</span>
                <span style={{ color: "#A51C30" }}>
                  {total.toLocaleString()} ₫
                </span>
              </div>
            </div>

            <p
              style={{
                marginTop: "18px",
                fontSize: "12px",
                color: "#999",
                lineHeight: 1.8,
              }}
            >
              Bằng việc đặt mua, bạn đồng ý với điều khoản bảo hành trọn đời và
              chính sách đổi trả trong vòng 7 ngày của DANIELLE (áp dụng cho sản
              phẩm nguyên vẹn, chưa qua sử dụng).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "13px",
  color: "#ccc",
  marginBottom: "6px",
  letterSpacing: "1px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #333",
  background: "#080808",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};
