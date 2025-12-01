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
  // UPLOAD IMAGE
  // ==========================
  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      toast.error("Upload ảnh thất bại!");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    setForm((prev) => ({
      ...prev,
      main_image_url: publicUrl,
    }));

    toast.success("Tải ảnh thành công!");
  };

  // ==========================
  // OPEN / CLOSE MODAL
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
  // SAVE PRODUCT
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
      main_image_url: form.main_image_url || null,
      description: form.description.trim() || null,
    };

    let error;
    if (form.id) {
      const { error: err } = await supabase
        .from("products")
        .update(payload)
        .eq("id", form.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("products")
        .insert(payload);
      error = err;
    }

    if (error) {
      console.error(error);
      toast.error("Lưu sản phẩm thất bại!");
    } else {
      toast.success(form.id ? "Đã cập nhật." : "Đã thêm sản phẩm mới!");
      await fetchProducts();
      setModalOpen(false);
      setForm(emptyProduct);
    }

    setSaving(false);
  };

  // ==========================
  // DELETE PRODUCT
  // ==========================
  const handleDelete = async (product) => {
    const ok = window.confirm(
      `Bạn có chắc chắn xóa "${product.name}" không?`
    );
    if (!ok) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      toast.error("Xóa thất bại!");
    } else {
      toast.success("Đã xóa!");
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
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
            Thêm, chỉnh sửa và xoá các tuyệt tác kim cương DANIELLE.
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

      {/* TABLE */}
      <div
        style={{
          background: "rgba(10,10,10,0.9)",
          borderRadius: "24px",
          padding: "24px",
          overflowX: "auto",
        }}
      >
        {loading ? (
          <p style={{ padding: "60px", textAlign: "center" }}>
            Đang tải sản phẩm...
          </p>
        ) : products.length === 0 ? (
          <p style={{ padding: "60px", textAlign: "center" }}>
            Chưa có sản phẩm nào.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ fontSize: "12px", opacity: 0.8 }}>
                <th style={thStyle}>HÌNH</th>
                <th style={thStyle}>TÊN</th>
                <th style={thStyle}>DANH MỤC</th>
                <th style={thStyle}>GIÁ</th>
                <th style={thStyle}>NGÀY</th>
                <th style={{ ...thStyle, textAlign: "right" }}>THAO TÁC</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <td style={tdStyle}>
                    {p.main_image_url ? (
                      <img
                        src={p.main_image_url}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "16px",
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.category || "—"}</td>
                  <td style={tdStyle}>{formatPrice(p.price)}</td>
                  <td style={tdStyle}>
                    {p.created_at
                      ? new Date(p.created_at).toLocaleString("vi-VN")
                      : "—"}
                  </td>

                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button
                      onClick={() => openEditModal(p)}
                      style={btnEdit}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      style={btnDelete}
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

      {/* MODAL */}
      {modalOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2
              style={{
                margin: "0 0 20px",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              {form.id ? "CHỈNH SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
            </h2>

            <form onSubmit={handleSave}>
              <label style={labelStyle}>
                Tên sản phẩm
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={inputStyle}
                />
              </label>

              <div style={{ display: "flex", gap: "16px" }}>
                <label style={{ ...labelStyle, flex: 1 }}>
                  Giá (VND)
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    style={inputStyle}
                  />
                </label>

                <label style={{ ...labelStyle, flex: 1 }}>
                  Danh mục
                  <input
                    value={form.category}
                    onChange={(e) =>
                      handleChange("category", e.target.value)
                    }
                    style={inputStyle}
                  />
                </label>
              </div>

              {/* UPLOAD ẢNH */}
              <label style={labelStyle}>
                Ảnh sản phẩm
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  style={{
                    marginTop: "10px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid #333",
                    background: "#151515",
                    color: "#fff",
                  }}
                />

                {form.main_image_url && (
                  <div style={{ marginTop: "16px" }}>
                    <img
                      src={form.main_image_url}
                      alt="preview"
                      style={{
                        width: "180px",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "16px",
                        border: "1px solid #444",
                      }}
                    />
                  </div>
                )}
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "14px", marginTop: "26px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={btnCancel}
                >
                  Hủy
                </button>

                <button type="submit" style={btnSave}>
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
  padding: "14px",
  fontWeight: 600,
  textTransform: "uppercase",
  fontSize: "11px",
  color: "#bbb",
};

const tdStyle = {
  padding: "16px 14px",
  fontSize: "14px",
};

const labelStyle = {
  display: "block",
  marginTop: "14px",
  marginBottom: "6px",
  fontSize: "13px",
  color: "#ccc",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#151515",
  color: "#fff",
};

const btnEdit = {
  padding: "8px 18px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "transparent",
  color: "#fff",
  fontSize: "13px",
  cursor: "pointer",
  marginRight: "10px",
};

const btnDelete = {
  padding: "8px 18px",
  borderRadius: "999px",
  border: "1px solid #ff6b6b",
  background: "rgba(255,107,107,0.08)",
  color: "#ff8a8a",
  fontSize: "13px",
  cursor: "pointer",
};

const btnCancel = {
  padding: "12px 24px",
  borderRadius: "999px",
  background: "transparent",
  border: "1px solid #555",
  color: "#ccc",
};

const btnSave = {
  padding: "12px 28px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg,#A51C30,#c52b40,#A51C30)",
  color: "#fff",
  fontWeight: "bold",
  letterSpacing: "2px",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalBox = {
  width: "640px",
  maxWidth: "95%",
  background: "#0b090a",
  borderRadius: "26px",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "28px 30px 34px",
  boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
};
