// src/components/admin/products/ProductDetailModal.jsx
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

export default function ProductDetailModal({
  product,
  onClose,
}) {
  const ref = useRef(null);

  const exportPDF = async () => {
    if (!ref.current) return;

    const canvas = await html2canvas(ref.current, {
      scale: 2,
    });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`product_${product.id}.pdf`);
  };

  const downloadImage = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, {
      scale: 2,
    });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `product_${product.id}.png`;
    link.click();
  };

  return (
    <div className="ap-modal-backdrop">
      <div className="ap-modal">
        <div className="ap-modal-header">
          <h2>Chi tiết sản phẩm</h2>
          <button
            className="ap-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div ref={ref} className="ap-modal-body">
          <div className="ap-modal-top">
            <div className="ap-modal-gallery">
              {product.images?.length ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300/f5f5f5/999?text=No+Image";
                  }}
                />
              ) : (
                <div className="ap-gallery-empty-large">
                  Không có ảnh
                </div>
              )}

              {product.images?.length > 1 && (
                <div className="ap-modal-thumbs">
                  {product.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`thumb-${i}`}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x80/f5f5f5/999?text=No+Image";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="ap-modal-info">
              <h3>{product.name}</h3>
              <p className="ap-modal-price">
                {Number(
                  product.price
                ).toLocaleString()}
                ₫
              </p>
              {product.category && (
                <p className="ap-modal-category">
                  Danh mục: {product.category}
                </p>
              )}
              <p className="ap-modal-stock">
                Trạng thái:{" "}
                {product.in_stock ? (
                  <span className="ap-stock-in">
                    Còn hàng
                  </span>
                ) : (
                  <span className="ap-stock-out">
                    Hết hàng
                  </span>
                )}
              </p>
              {product.description && (
                <p className="ap-modal-desc">
                  {product.description}
                </p>
              )}

              <div className="ap-modal-qr-wrapper">
                <div className="ap-modal-qr">
                  <QRCode
                    value={JSON.stringify({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                    })}
                    size={80}
                  />
                </div>
                <span className="ap-modal-qr-label">
                  QR sản phẩm
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-modal-footer">
          <button
            className="ap-btn-outline"
            onClick={exportPDF}
          >
            📄 Xuất PDF
          </button>
          <button
            className="ap-btn-secondary"
            onClick={downloadImage}
          >
            🖼 Tải PNG
          </button>
          <button
            className="ap-btn-danger"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
