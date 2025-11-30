// src/components/admin/products/ProductForm.jsx
import { useState } from "react";

export default function ProductForm({ onCreate }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setImageInput("");
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || images.length === 0) {
      return alert(
        "Vui lòng nhập Tên, Giá và ít nhất 1 ảnh sản phẩm!"
      );
    }

    if (isNaN(price) || Number(price) <= 0) {
      return alert("Giá phải là số dương!");
    }

    setLoading(true);
    const payload = {
      name,
      price,
      category,
      images,
      description,
      in_stock: inStock,
    };

    const res = await onCreate(payload);
    setLoading(false);

    if (res?.ok) {
      // reset form
      setName("");
      setPrice("");
      setCategory("");
      setImageInput("");
      setImages([]);
      setDescription("");
      setInStock(true);
    }
  };

  return (
    <div className="ap-card ap-form">
      <h2 className="ap-form-title">
        Thêm sản phẩm mới
      </h2>

      <form
        className="ap-form-grid"
        onSubmit={handleSubmit}
      >
        <div className="ap-form-left">
          <div className="ap-field">
            <label>Tên sản phẩm *</label>
            <input
              className="ap-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Bó hoa hồng đỏ Ecuador"
            />
          </div>

          <div className="ap-field">
            <label>Giá bán (VNĐ) *</label>
            <input
              className="ap-input"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="290000"
              min="1"
            />
          </div>

          <div className="ap-field">
            <label>Danh mục</label>
            <input
              className="ap-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Hoa hồng, Hoa cưới, Hoa sinh nhật..."
            />
          </div>

          <div className="ap-field">
            <label>Mô tả (tùy chọn)</label>
            <textarea
              className="ap-input ap-textarea"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Mô tả ngắn gọn về chất liệu, xuất xứ, phong cách..."
            />
          </div>

          <label className="ap-checkbox">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) =>
                setInStock(e.target.checked)
              }
            />
            <span>Còn hàng (hiển thị trên website)</span>
          </label>
        </div>

        {/* Ảnh */}
        <div className="ap-form-right">
          <div className="ap-field">
            <label>Link ảnh sản phẩm</label>
            <div className="ap-image-input-row">
              <input
                className="ap-input"
                placeholder="Dán link ảnh, sau đó nhấn Thêm ảnh"
                value={imageInput}
                onChange={(e) =>
                  setImageInput(e.target.value)
                }
              />
              <button
                type="button"
                className="ap-btn-secondary"
                onClick={addImage}
              >
                + Thêm
              </button>
            </div>
            <small className="ap-field-hint">
              Bạn có thể thêm nhiều ảnh. Sử dụng CDN như
              Imgur, Cloudinary, v.v.
            </small>
          </div>

          <div className="ap-gallery-preview">
            {images.length === 0 ? (
              <div className="ap-gallery-empty">
                Chưa có ảnh nào. Thêm link ảnh để xem
                preview.
              </div>
            ) : (
              images.map((url, idx) => (
                <div
                  key={idx}
                  className="ap-gallery-item"
                >
                  <img
                    src={url}
                    alt={`Ảnh ${idx + 1}`}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/160x120/f5f5f5/999?text=Ảnh+lỗi";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="ap-gallery-remove"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </form>

      <div className="ap-form-actions">
        <button
          type="submit"
          className="ap-btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "THÊM SẢN PHẨM"}
        </button>
      </div>
    </div>
  );
}
