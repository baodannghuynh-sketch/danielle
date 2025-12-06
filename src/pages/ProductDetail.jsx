// src/pages/ProductDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { useCartStore } from "../store/useCartStore";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addItem, addRecentViewed, wishlist } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } else if (data) {
        let normalized = data;
        if (normalized.image_url && !Array.isArray(normalized.image_url)) {
          normalized = { ...normalized, image_url: [normalized.image_url] };
        }

        setProduct(normalized);

        addRecentViewed({
          id: normalized.id,
          name: normalized.name,
          price: normalized.price,
          image: normalized.image_url?.[0] || "",
        });
      }
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, addRecentViewed]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) {
    return (
      <div className="pd-root pd-root-loading">
        Đang tải tuyệt tác...
        <style jsx>{`
          .pd-root-loading {
            min-height: 100vh;
            background: #000;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
          }
        `}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-root pd-root-error">
        Sản phẩm không tồn tại hoặc đã bị xóa
        <style jsx>{`
          .pd-root-error {
            min-height: 100vh;
            background: #000;
            color: #a51c30;
            display: flex;
            align-items: center;
            justifyContent: center;
            font-size: 32px;
            text-align: center;
            padding: 40px;
          }
        `}</style>
      </div>
    );
  }

  const images = Array.isArray(product.image_url)
    ? product.image_url
    : [product.image_url || ""];
  const isWishlisted = wishlist?.some((w) => w.id === product.id);

  return (
    <div className="pd-root">
      <div className="pd-container">
        {/* LEFT – GALLERY */}
        <div className="pd-left">
          <div className="pd-main-image-wrap">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="pd-main-image"
            />
            <div className="pd-badge">
              BEST SELLER
            </div>
          </div>

          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`pd-thumb-item ${
                    selectedImage === i ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt="" className="pd-thumb-img" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT – INFO */}
        <div className="pd-right">
          <p className="pd-category">
            {product.category || "MASTERPIECE"}
          </p>

          <h1 className="pd-name">
            {product.name.toUpperCase()}
          </h1>

          <p className="pd-price">
            {product.price.toLocaleString("vi-VN")} ₫
          </p>

          <div className="pd-block">
            <div className="pd-block-row">
              <strong>CHẤT LIỆU</strong>
              <p>
                Vàng {product.material || "18K"} nguyên khối • Kim cương tự nhiên
                GIA
              </p>
            </div>

            <div className="pd-block-row">
              <strong>MÃ SẢN PHẨM</strong>
              <p>DL-{String(product.id).padStart(5, "0")}</p>
            </div>

            <div className="pd-block-row">
              <strong>TÌNH TRẠNG</strong>
              <p
                style={{
                  color: product.in_stock !== false ? "#66BB6A" : "#EF5350",
                }}
              >
                {product.in_stock !== false
                  ? "Còn hàng • Giao ngay trong 24h"
                  : "Hết hàng • Đặt trước"}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pd-actions">
            <button
              className="pd-btn-primary"
              onClick={handleAddToCart}
              disabled={product.in_stock === false}
            >
              {product.in_stock === false
                ? "HẾT HÀNG"
                : "THÊM VÀO GIỎ HÀNG"}
            </button>
          </div>
        </div>
      </div>

      {added && (
        <div className="pd-toast">
          Đã thêm vào giỏ hàng!
        </div>
      )}

      <style jsx>{`
        .pd-root {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding-top: 120px;
          padding-bottom: 160px;
        }
        .pd-container {
          max-width: 1800px;
          margin: 0 auto;
          padding: 0 5%;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 80px;
          align-items: flex-start;
        }
        .pd-left {
          position: relative;
        }
        .pd-main-image-wrap {
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
          margin-bottom: 24px;
          position: relative;
        }
        .pd-main-image {
          width: 100%;
          height: 620px;
          object-fit: cover;
          transition: all 0.8s ease;
        }
        .pd-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(165, 28, 48, 0.9);
          color: white;
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 3px;
          box-shadow: 0 10px 30px rgba(165, 28, 48, 0.4);
        }
        .pd-thumbs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 14px;
        }
        .pd-thumb-item {
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        }
        .pd-thumb-item.active {
          border-color: #a51c30;
          box-shadow: 0 18px 40px rgba(165, 28, 48, 0.4);
        }
        .pd-thumb-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }

        .pd-right {
          padding: 40px 0;
        }
        .pd-category {
          font-size: 16px;
          letter-spacing: 6px;
          color: #a51c30;
          margin: 0 0 16px;
          font-weight: 500;
        }
        .pd-name {
          font-size: 56px;
          font-weight: 300;
          letter-spacing: 6px;
          margin: 0 0 24px;
          font-family: "Playfair Display", serif;
        }
        .pd-price {
          font-size: 36px;
          color: #a51c30;
          font-weight: bold;
          margin: 30px 0 10px;
        }
        .pd-block {
          padding: 32px 0;
          border-top: 1px solid #333;
          border-bottom: 1px solid #333;
          margin: 40px 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .pd-block-row strong {
          color: #aaa;
          letter-spacing: 2px;
          font-size: 13px;
        }
        .pd-block-row p {
          font-size: 18px;
          margin: 6px 0 0;
        }
        .pd-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .pd-btn-primary {
          padding: 16px 40px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #a51c30, #c52b40, #a51c30);
          color: #fff;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          letter-spacing: 3px;
          box-shadow: 0 10px 26px rgba(165, 28, 48, 0.6);
        }
        .pd-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pd-toast {
          position: fixed;
          top: 120px;
          right: 24px;
          background: #000;
          color: #66bb6a;
          padding: 18px 32px;
          border-radius: 18px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          border: 2px solid #66bb6a;
          z-index: 10000;
          font-size: 18px;
          font-weight: bold;
          animation: slideInRight 0.6s ease;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 1200px) {
          .pd-container {
            gap: 40px;
          }
          .pd-main-image {
            height: 520px;
          }
        }

        @media (max-width: 992px) {
          .pd-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .pd-main-image {
            height: 460px;
          }
          .pd-right {
            padding-top: 0;
          }
        }

        @media (max-width: 768px) {
          .pd-root {
            padding-top: 96px;
            padding-bottom: 100px;
          }
          .pd-container {
            padding: 0 18px;
          }
          .pd-main-image {
            height: 360px;
          }
          .pd-name {
            font-size: 36px;
            letter-spacing: 4px;
          }
          .pd-price {
            font-size: 28px;
          }
          .pd-block-row p {
            font-size: 16px;
          }
          .pd-btn-primary {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .pd-main-image {
            height: 320px;
          }
          .pd-name {
            font-size: 30px;
            letter-spacing: 3px;
          }
        }
      `}</style>
    </div>
  );
}
