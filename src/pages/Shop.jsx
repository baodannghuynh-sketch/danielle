// src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Eternal Solitaire Ring",
    price: 298000000,
    image_url:
      "https://images.unsplash.com/photo-1605100804764-5081959e1416?w=1200&q=90",
    category: "women",
    material: "Vàng trắng 18K • Kim cương 2.5ct",
  },
  {
    id: 2,
    name: "Cuban Link Heavy Chain",
    price: 89000000,
    image_url:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=90",
    category: "men",
    material: "Vàng 18K • 85g",
  },
  {
    id: 3,
    name: "Tennis Diamond Earrings",
    price: 168000000,
    image_url:
      "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200&q=90",
    category: "women",
    material: "Kim cương tổng 8ct",
  },
  {
    id: 4,
    name: "Titan Black Edition",
    price: 45800000,
    image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90",
    category: "men",
    material: "Titan phủ PVD đen",
  },
  {
    id: 5,
    name: "Heritage Platinum Wedding",
    price: 488000000,
    image_url:
      "https://images.unsplash.com/photo-1600002223724-58e9b3f3e5b3?w=1200&q=90",
    category: "handcrafted",
    material: "Platinum 950 • Kim cương GIA",
  },
  {
    id: 6,
    name: "Masterpiece Diamond Bracelet",
    price: 388000000,
    image_url:
      "https://images.unsplash.com/photo-1611926653458-09294b3142b6?w=1200&q=90",
    category: "handcrafted",
    material: "Vàng hồng • 312 viên kim cương",
  },
  {
    id: 7,
    name: "Royal Signet Ring",
    price: 128000000,
    image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90",
    category: "men",
    material: "Vàng trắng 18K • Onyx tự nhiên",
  },
  {
    id: 8,
    name: "Pearl & Diamond Necklace",
    price: 218000000,
    image_url:
      "https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=1200&q=90",
    category: "women",
    material: "Ngọc trai Nam Hải • Kim cương",
  },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi:", error);
        setProducts(mockProducts);
      } else {
        setProducts(data && data.length > 0 ? data : mockProducts);
      }
      setLoading(false);
    };

    const fetchAndScroll = async () => {
      await fetchProducts();
      window.scrollTo(0, 0);
    };
    fetchAndScroll();
  }, []);

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const categories = [
    { key: "all", label: "Sparkles", sub: "ALL", highlight: false },
    { key: "women", label: "Female", sub: "WOMEN", highlight: false },
    { key: "men", label: "Male", sub: "MEN", highlight: false },
    {
      key: "handcrafted",
      label: "Diamond",
      sub: "HANDCRAFTED",
      highlight: true,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* HERO */}
      <section className="shop-hero">
        <div className="shop-hero-overlay" />
        <div className="shop-hero-content">
          <h1 className="shop-title">SHOP</h1>
          <p className="shop-sub">
            THE ART OF ETERNAL LUXURY
          </p>
          <div className="shop-divider" />
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="shop-filter-wrap">
        <div className="shop-filter-inner">
          <div className="shop-filter">
            {categories.map((cat) => {
              const active = filter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className={`shop-filter-btn ${
                    active ? "shop-filter-btn-active" : ""
                  } ${cat.highlight ? "shop-filter-btn-highlight" : ""}`}
                >
                  <span className="shop-filter-label">
                    <span className="shop-filter-main">{cat.label}</span>
                    <span className="shop-filter-sub">{cat.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* GRID SẢN PHẨM */}
      <section className="shop-grid-wrap">
        <div className="shop-grid-inner">
          {loading ? (
            <div className="shop-loading">
              <p>Đang tải những tuyệt tác...</p>
            </div>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="shop-grid-item"
                  style={{
                    opacity: 0,
                    transform: "translateY(60px)",
                    animation: "fadeUp 0.8s ease forwards",
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="shop-empty">
              <p className="shop-empty-title">
                Bộ sưu tập đang được chế tác
              </p>
              <Link to="/" className="shop-empty-link">
                ← Quay về trang chủ
              </Link>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .shop-hero {
          height: 80vh;
          min-height: 540px;
          max-height: 720px;
          background: linear-gradient(
              rgba(0, 0, 0, 0.75),
              rgba(0, 0, 0, 0.9)
            ),
            url("https://images.unsplash.com/photo-1611590027211-b954fd027b51?w=3270&q=90")
              center/cover no-repeat fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
        }
        .shop-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(165, 28, 48, 0.25) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
        .shop-hero-content {
          position: relative;
          z-index: 10;
          padding: 0 20px;
        }
        .shop-title {
          font-size: 120px;
          font-weight: 300;
          letter-spacing: 28px;
          margin: 0 0 24px;
          font-family: "Playfair Display", serif;
          background: linear-gradient(90deg, #a51c30, #fff, #a51c30);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
          animation: glow 6s ease-in-out infinite alternate;
        }
        .shop-sub {
          font-size: 26px;
          letter-spacing: 10px;
          margin: 0 0 40px;
          opacity: 0.95;
          font-weight: 300;
        }
        .shop-divider {
          height: 3px;
          width: 180px;
          background: #a51c30;
          margin: 0 auto;
          box-shadow: 0 0 40px #a51c30;
        }

        .shop-filter-wrap {
          padding: 40px 8% 60px;
          background: #000;
          position: sticky;
          top: 72px;
          z-index: 10;
          backdrop-filter: blur(18px);
        }
        .shop-filter-inner {
          max-width: 1400px;
          margin: 0 auto;
        }
        .shop-filter {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 80px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
            inset 0 0 40px rgba(165, 28, 48, 0.1);
        }
        .shop-filter-btn {
          position: relative;
          padding: 14px 24px;
          background: transparent;
          color: #fff;
          border-radius: 60px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          transition: all 0.4s ease;
        }
        .shop-filter-btn-active {
          background: #fff;
          color: #000;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }
        .shop-filter-btn-highlight.shop-filter-btn-active {
          background: #a51c30;
          color: #fff;
          box-shadow: 0 15px 40px rgba(165, 28, 48, 0.6);
        }
        .shop-filter-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .shop-filter-main {
          font-weight: 700;
        }
        .shop-filter-sub {
          font-size: 11px;
          letter-spacing: 4px;
        }

        .shop-grid-wrap {
          padding: 10px 8% 160px;
          background: #000;
        }
        .shop-grid-inner {
          max-width: 1800px;
          margin: 0 auto;
        }
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 40px;
        }
        .shop-loading {
          text-align: center;
          padding: 120px 20px;
          font-size: 26px;
          color: #a51c30;
          letter-spacing: 4px;
        }
        .shop-empty {
          text-align: center;
          padding: 200px 20px;
          color: #666;
        }
        .shop-empty-title {
          font-size: 36px;
          margin-bottom: 30px;
          letter-spacing: 3px;
        }
        .shop-empty-link {
          color: #a51c30;
          font-size: 20px;
          font-weight: bold;
          text-decoration: none;
          border-bottom: 3px solid #a51c30;
          padding-bottom: 8px;
        }

        @keyframes glow {
          from {
            filter: drop-shadow(0 0 30px #a51c30);
          }
          to {
            filter: drop-shadow(0 0 80px #a51c30);
          }
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Tablet */
        @media (max-width: 1200px) {
          .shop-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 32px;
          }
        }

        @media (max-width: 992px) {
          .shop-title {
            font-size: 80px;
            letter-spacing: 18px;
          }
          .shop-sub {
            font-size: 20px;
            letter-spacing: 8px;
          }
          .shop-filter-wrap {
            padding: 30px 5% 40px;
            top: 70px;
          }
          .shop-grid-wrap {
            padding: 20px 5% 120px;
          }
          .shop-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 26px;
          }
        }

        @media (max-width: 768px) {
          .shop-hero {
            height: 60vh;
            min-height: 420px;
          }
          .shop-title {
            font-size: 56px;
            letter-spacing: 12px;
          }
          .shop-sub {
            font-size: 16px;
            letter-spacing: 5px;
          }
          .shop-filter {
            border-radius: 26px;
            padding: 12px 10px;
          }
          .shop-filter-btn {
            padding: 10px 16px;
            font-size: 13px;
          }
          .shop-filter-main {
            font-size: 13px;
          }
          .shop-filter-sub {
            display: none;
          }
          .shop-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 576px) {
          .shop-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 22px;
          }
          .shop-grid-wrap {
            padding: 20px 16px 80px;
          }
          .shop-filter-wrap {
            padding: 18px 12px 24px;
          }
          .shop-title {
            font-size: 44px;
            letter-spacing: 10px;
          }
        }
      `}</style>
    </div>
  );
}
