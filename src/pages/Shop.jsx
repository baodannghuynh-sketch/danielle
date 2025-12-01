// src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { Link } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      setProducts(data || []);
      window.scrollTo(0, 0);
    };
    load();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        paddingTop: "180px",
        paddingBottom: "120px",
      }}
    >
      {/* Title */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "64px",
          fontFamily: '"Playfair Display", serif',
          letterSpacing: "10px",
          marginBottom: "50px",
        }}
      >
        DANIELLE COLLECTION
      </h1>

      {/* WRAPPER NARROW */}
      <div
        style={{
          maxWidth: "1500px", // ⭐ Thu nhỏ lại cho sang trọng
          margin: "0 auto",
          padding: "0 40px",
        }}
      >
        {/* PRODUCT GRID — 4 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // ⭐ 4 sản phẩm / hàng
            gap: "36px",
          }}
        >
          {products.map((p) => {
            const image = p.main_image_url ?? p.image_url?.[0] ?? "";

            return (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "26px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    transition: "0.3s",
                  }}
                >
                  {/* IMAGE */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={image}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "340px",
                        objectFit: "cover",
                      }}
                    />

                    {/* HẾT HÀNG */}
                    {p.in_stock === false && (
                      <span
                        style={{
                          position: "absolute",
                          top: "14px",
                          left: "14px",
                          background: "black",
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "50px",
                          fontSize: "12px",
                          letterSpacing: "2px",
                        }}
                      >
                        HẾT HÀNG
                      </span>
                    )}
                  </div>

                  {/* INFO */}
                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        fontSize: "20px",
                        marginBottom: "6px",
                        letterSpacing: "2px",
                        fontWeight: "600",
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {p.name}
                    </div>

                    <div
                      style={{
                        fontSize: "18px",
                        color: "#A51C30",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                      }}
                    >
                      {Number(p.price).toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
