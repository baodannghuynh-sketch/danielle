// src/pages/AdminProducts.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { toast } from "react-toastify";

function formatPrice(vnd) {
  if (!vnd && vnd !== 0) return "";
  return Number(vnd).toLocaleString("vi-VN") + " ₫";
}

const emptyProduct = {
  id: null,
  name: "",
  price: "",
  category: "",
  main_image_url: "",
  description: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  // ==========================
  // LOAD DANH SÁCH SẢN PHẨM
  // ==========================
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Không tải được danh sách sản phẩm!");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================
  // MỞ / ĐÓNG MODAL
  // ==========================
  const openNewModal = () => {
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setForm({
      id: product.id,
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      main_image_url: product.main_image_url || "",
      description: product.description || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setForm(emptyProduct);
  };

  // ==========================
  // HANDLE INPUT
  // ==========================
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================
  // THÊM / SỬA SẢN PHẨM
  // ==========================
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      toast.warning("Giá phải là số.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim() || null,
      main_image_url: form.main_image_url.trim() || null,
      description: form.description.trim() || null,
    };

    let error;
    if (form.id) {
      // UPDATE
      const { error: err } = await supabase
        .from("products")
        .update(payload)
        .eq("id", form.id);
      error = err;
    } else {
      // INSERT
      const { error: err } = await supabase.from("products").insert(payload);
      error = err;
    }

    if (error) {
      console.error(error);
      toast.error("Lưu sản phẩm thất bại!");
    } else {
      toast.success(form.id ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm mới.");
      await fetchProducts();
      setModalOpen(false);
      setForm(emptyProduct);
    }

    setSaving(false);
  };

  // ==========================
  // XÓA SẢN PHẨM
  // ==========================
  const handleDelete = async (product) => {
    const ok = window.confirm(
      `Bạn chắc chắn muốn xóa "${product.name}"? Hành động này không thể hoàn tác.`
    );
    if (!ok) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error(error);
      toast.error("Xóa sản phẩm thất bại!");
    } else {
      toast.success("Đã xóa sản phẩm.");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 40px 80px",
        background: "radial-gradient(circle at top, #2a0f16 0, #050404 55%)",
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
            QUẢN LÝ SẢN PHẨM
          </h1>
          <p style={{ marginTop: "10px", color: "#bbb" }}>
            Thêm, chỉnh sửa và xoá các tuyệt tác trong bộ sưu tập DANIELLE.
          </p>
        </div>

        <button
          onClick={openNewModal}
          style={{
            padding: "14px 32px",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(135deg, #A51C30 0%, #c52b40 50%, #A51C30 100%)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
            letterSpacing: "2px",
            cursor: "pointer",
            boxShadow: "0 12px 30px rgba(165, 28, 48, 0.5)",
          }}
        >
          + THÊM SẢN PHẨM
        </button>
      </div>

      {/* BẢNG SẢN PHẨM */}
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
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <p style={{ fontSize: "20px", color: "#ccc", marginBottom: "20px" }}>
              Chưa có sản phẩm nào trong hệ thống.
            </p>
            <button
              onClick={openNewModal}
              style={{
                padding: "14px 28px",
                borderRadius: "999px",
                border: "1px solid #A51C30",
                background: "transparent",
                color: "#A51C30",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + Thêm sản phẩm đầu tiên
            </button>
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
              <tr style={{ textAlign: "left", fontSize: "13px", opacity: 0.8 }}>
                <th style={thStyle}>HÌNH</th>
                <th style={thStyle}>TÊN SẢN PHẨM</th>
                <th style={thStyle}>DANH MỤC</th>
                <th style={thStyle}>GIÁ</th>
                <th style={thStyle}>NGÀY TẠO</th>
                <th style={{ ...thStyle, textAlign: "right" }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    borderBottom: "1px solid rgba(255,255,255,0.02)",
                  }}
                >
                  {/* IMAGE */}
                  <td style={tdStyle}>
                    {p.main_image_url ? (
                      <img
                        src={p.main_image_url}
                        alt={p.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "16px",
                          border: "1px solid #333",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "16px",
                          background:
                            "linear-gradient(135deg,#222,#111,#2b0c14)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          color: "#777",
                        }}
                      >
                        No image
                      </div>
                    )}
                  </td>

                  {/* NAME + DESCRIPTION */}
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                      {p.name}
                    </div>
                    {p.description && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#aaa",
                          maxWidth: "420px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.description}
                      </div>
                    )}
                  </td>

                  {/* CATEGORY */}
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.05)",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {p.category || "—"}
                    </span>
                  </td>

                  {/* PRICE */}
                  <td style={tdStyle}>
                    <span
                      style={{
                        color: "#ffb3c0",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      {formatPrice(p.price)}
                    </span>
                  </td>

                  {/* CREATED AT */}
                  <td style={tdStyle}>
                    {p.created_at
                      ? new Date(p.created_at).toLocaleString("vi-VN")
                      : "—"}
                  </td>

                  {/* ACTIONS */}
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      onClick={() => openEditModal(p)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "999px",
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: "transparent",
                        color: "#fff",
                        fontSize: "13px",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "999px",
                        border: "1px solid #ff6b6b",
                        background: "rgba(255,107,107,0.08)",
                        color: "#ff8a8a",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL THÊM / SỬA */}
      {modalOpen && (
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
              width: "640px",
              maxWidth: "95%",
              background: "#0b090a",
              borderRadius: "26px",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
              padding: "28px 30px 34px",
              position: "relative",
            }}
          >
            <h2
              style={{
                margin: "0 0 20px",
                fontFamily: '"Playfair Display", serif',
                fontSize: "26px",
                letterSpacing: "3px",
              }}
            >
              {form.id ? "CHỈNH SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
            </h2>

            <form onSubmit={handleSave}>
              <label style={labelStyle}>
                Tên sản phẩm
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={inputStyle}
                  required
                />
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "14px",
                }}
              >
                <label style={{ ...labelStyle, flex: 1 }}>
                  Giá (VND)
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    style={inputStyle}
                    required
                  />
                </label>

                <label style={{ ...labelStyle, flex: 1 }}>
                  Danh mục
                  <input
                    type="text"
                    placeholder="women / men / handcrafted..."
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    style={inputStyle}
                  />
                </label>
              </div>

              <label style={labelStyle}>
                Ảnh chính (URL)
                <input
                  type="text"
                  placeholder="https://..."
                  value={form.main_image_url}
                  onChange={(e) =>
                    handleChange("main_image_url", e.target.value)
                  }
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Mô tả
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "14px",
                  marginTop: "26px",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "999px",
                    border: "1px solid #555",
                    background: "transparent",
                    color: "#ccc",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "999px",
                    border: "none",
                    background:
                      "linear-gradient(135deg,#A51C30,#c52b40,#A51C30)",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    letterSpacing: "2px",
                    boxShadow: "0 10px 26px rgba(165,28,48,0.6)",
                  }}
                >
                  {saving ? "ĐANG LƯU..." : "LƯU LẠI"}
                </button>
              </div>
            </form>
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

const labelStyle = {
  display: "block",
  fontSize: "13px",
  color: "#ccc",
  marginTop: "14px",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#151515",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};
//src/pages/AdminProducts.jsx
