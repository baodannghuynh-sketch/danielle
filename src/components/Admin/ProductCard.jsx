// src/components/admin/products/ProductCard.jsx
export default function ProductCard({
  product,
  onViewDetail,
  onEdit,
  onDelete,
}) {
  const firstImage = product.images?.[0];

  return (
    <div className="ap-product-card">
      <div className="ap-product-image-wrapper">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="ap-product-image"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300/f5f5f5/999?text=No+Image";
            }}
          />
        ) : (
          <div className="ap-product-image-empty">
            Không có ảnh
          </div>
        )}
        {!product.in_stock && (
          <span className="ap-badge-out">
            HẾT HÀNG
          </span>
        )}
        {product.category && (
          <span className="ap-badge-category">
            {product.category}
          </span>
        )}
      </div>

      <div className="ap-product-body">
        <h3 className="ap-product-name">
          {product.name}
        </h3>
        <p className="ap-product-price">
          {Number(product.price).toLocaleString()} ₫
        </p>
        {product.description && (
          <p className="ap-product-desc">
            {product.description.length > 80
              ? product.description.slice(0, 80) +
                "..."
              : product.description}
          </p>
        )}
      </div>

      <div className="ap-product-actions">
        <button
          className="ap-btn-outline"
          onClick={() => onViewDetail(product)}
        >
          Chi tiết
        </button>
        <button
          className="ap-btn-secondary"
          onClick={() => onEdit(product)}
        >
          Sửa
        </button>
        <button
          className="ap-btn-danger"
          onClick={() => onDelete(product.id)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
