// src/components/admin/products/ProductEditModal.jsx
import { useState } from "react";

export default function ProductEditModal({
  product,
  onClose,
  onSave,
}) {
  const [name, setName] = useState(product.name || "");
  const [price, setPrice] = useState(product.price || "");
  const [category, setCategory] = useState(
    product.category || ""
  );
  const [description, setDescription] = useState(
    product.description || ""
  );
  const [inStock, setInStock] = useState(
    product.in_stock ?? true
  );
  const [images, setImages] = useState(
    product.images || []
  );
  const [newImage, setNewImage] = useState("");
  const [saving, setSaving] = useState(false);

  const addImage = () => {
    const url = newImage.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setNewImage("");
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || images.length === 0) {
      return alert(
        "Vui lòng nhập Tên, Giá và ít nhất 1 ảnh!"
      );
    }
    if (isNaN(price) || Number(price) <= 0) {
      return alert("Giá phải là số dương!");
    }
    setSaving(true);
    await onSave({
      name,
      price,
      category,
      description,
      in_stock: inStock,
      images,
    });
    setSaving(false);
  };

  return (
    <div className="ap-modal-backdrop">
      <div className="ap-modal ap-modal-edit">
        <div className="ap-modal-header">
          <h2>Chỉnh sửa sản phẩm</h2>
          <button
            className="ap-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form
          className="ap-modal-body ap-edit-grid"
          onSubmit={handleSubmit}
        >
          <div className="ap-edit-left">
            <div className="ap-field">
              <label>Tên sản phẩm *</label>
              <input
                className="ap-input"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>
            <div className="ap-field">
              <label>Giá bán (VNĐ) *</label>
              <input
                type="number"
                className="ap-input"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />
            </div>
            <div className="ap-field">
              <label>Danh mục</label>
              <input
                className="ap-input"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              />
            </div>
            <div className="ap-field">
              <label>Mô tả</label>
              <textarea
                className="ap-input ap-textarea"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
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
              <span>Còn hàng</span>
            </label>
          </div>

          <div className="ap-edit-right">
            <div className="ap-field">
              <label>Ảnh sản phẩm</label>
              <div className="ap-image-input-row">
                <input
                  className="ap-input"
                  placeholder="Dán link ảnh mới..."
                  value={newImage}
                  onChange={(e) =>
                    setNewImage(e.target.value)
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
            </div>

            <div className="ap-gallery-preview">
              {images.length === 0 ? (
                <div className="ap-gallery-empty">
                  Chưa có ảnh
                </div>
              ) : (
                images.map((url, idx) => (
                  <div
                    key={idx}
                    className="ap-gallery-item"
                  >
                    <img
                      src={url}
                      alt={`img-${idx}`}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/160x120/f5f5f5/999?text=Ảnh+lỗi";
                      }}
                    />
                    <button
                      type="button"
                      className="ap-gallery-remove"
                      onClick={() => removeImage(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>

        <div className="ap-modal-footer">
          <button
            className="ap-btn-secondary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            className="ap-btn-danger"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
