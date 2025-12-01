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

        // Chuẩn hóa mảng ảnh: ưu tiên image_url[], nếu không có thì dùng main_image_url
        let imgs = [];
        if (Array.isArray(normalized.image_url) && normalized.image_url.length) {
          imgs = normalized.image_url;
        } else if (normalized.image_url) {
          imgs = [normalized.image_url];
        } else if (normalized.main_image_url) {
          imgs = [normalized.main_image_url];
        }

        normalized = {
          ...normalized,
          image_url: imgs,
        };

        setProduct(normalized);

        addRecentViewed({
          id: normalized.id,
          name: normalized.name,
          price: normalized.price,
          image: imgs[0] || "",
        });
      }
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, addRecentViewed]);

  const handleAddToCart = () => {
    if (!product) return;

    // Đưa luôn image_url để Cart dùng được
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
        }}
      >
        Đang tải tuyệt tác...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#A51C30",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          textAlign: "center",
          padding: "40px",
        }}
      >
        Sản phẩm không tồn tại hoặc đã bị xóa
      </div>
    );
  }

  const images = Array.isArray(product.image_url)
    ? product.image_url
    : [product.image_url || ""];
  const isWishlisted = wishlist?.some((w) => w.id === product.id);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        paddingTop: "120px",
        paddingBottom: "180px",
      }}
    >
      <div
        style={{
          maxWidth: "1800px",
          margin: "0 auto",
          padding: "0 5%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "100px",
          alignItems: "start",
        }}
      >
        {/* LEFT — GALLERY */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
              marginBottom: "30px",
            }}
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              style={{
                width: "100%",
                height: "800px",
                objectFit: "cover",
                transition: "all 0.8s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "30px",
                left: "30px",
                background: "rgba(165,28,48,0.9)",
                color: "white",
                padding: "12px 28px",
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: "bold",
                letterSpacing: "3px",
                boxShadow: "0 10px 30px rgba(165,28,48,0.4)",
              }}
            >
              BEST SELLER
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "16px",
              }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      selectedImage === i
                        ? "4px solid #A51C30"
                        : "4px solid transparent",
                    transition: "all 0.4s ease",
                    boxShadow:
                      selectedImage === i
                        ? "0 20px 40px rgba(165,28,48,0.3)"
                        : "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "140px",
                      objectFit: "cover",
                      filter:
                        selectedImage === i
                          ? "brightness(1)"
                          : "brightness(0.7)",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — INFO */}
        <div style={{ padding: "60px 0" }}>
          <p
            style={{
              fontSize: "18px",
              letterSpacing: "6px",
              color: "#A51C30",
              margin: "0 0 20px",
              fontWeight: "500",
            }}
          >
            {product.category || "MASTERPIECE"}
          </p>

          <h1
            style={{
              fontSize: "72px",
              fontWeight: "300",
              letterSpacing: "8px",
              margin: "0 0 30px",
              fontFamily: '"Playfair Display", serif',
            }}
          >
            {product.name.toUpperCase()}
          </h1>

          <p
            style={{
              fontSize: "42px",
              color: "#A51C30",
              fontWeight: "bold",
              margin: "40px 0",
            }}
          >
            {product.price.toLocaleString("vi-VN")} ₫
          </p>

          {/* BLOCK THÔNG TIN */}
          <div
            style={{
              padding: "40px 0",
              borderTop: "1px solid #333",
              borderBottom: "1px solid #333",
              margin: "60px 0",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <strong style={{ color: "#aaa", letterSpacing: "2px" }}>
                CHẤT LIỆU
              </strong>
              <p style={{ fontSize: "20px", margin: "8px 0 0" }}>
                Vàng {product.material || "18K"} nguyên khối • Kim cương tự
                nhiên GIA
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <strong style={{ color: "#aaa", letterSpacing: "2px" }}>
                MÃ SẢN PHẨM
              </strong>
              <p style={{ fontSize: "20px", margin: "8px 0" }}>
                DL-{String(product.id).padStart(5, "0")}
              </p>
            </div>

            <div>
              <strong style={{ color: "#aaa", letterSpacing: "2px" }}>
                TÌNH TRẠNG
              </strong>
              <p
                style={{
                  fontSize: "20px",
                  margin: "8px 0",
                  color:
                    product.in_stock !== false ? "#66BB6A" : "#EF5350",
                }}
              >
                {product.in_stock !== false
                  ? "Còn hàng • Giao ngay trong 24h"
                  : "Hết hàng • Đặt trước"}
              </p>
            </div>
          </div>

          {/* Nút Thêm giỏ hàng (giữ giao diện cũ) */}
          <button
            onClick={handleAddToCart}
            style={{
              padding: "18px 50px",
              background: "#A51C30",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "3px",
              cursor: "pointer",
              boxShadow: "0 15px 40px rgba(165,28,48,0.5)",
            }}
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>

      {added && (
        <div
          style={{
            position: "fixed",
            top: "140px",
            right: "40px",
            background: "#000",
            color: "#66BB6A",
            padding: "24px 40px",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            border: "2px solid #66BB6A",
            zIndex: 10000,
            fontSize: "20px",
            fontWeight: "bold",
            animation: "slideInRight 0.6s ease",
          }}
        >
          Đã thêm vào giỏ hàng!
        </div>
      )}

      <style jsx>{`
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
      `}</style>
    </div>
  );
}
