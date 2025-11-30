// src/components/Footer.jsx

import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { toast } from "react-toastify";

// Icon Feather
import { FiInstagram, FiMail, FiPhone } from "react-icons/fi";
// Icon Font Awesome
import { FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";

// =========================
// Styles & components phụ
// =========================
const linkStyle = {
  color: "#999",
  textDecoration: "none",
  transition: "color 0.4s ease",
  fontSize: "15px",
};

const SocialIcon = ({ children, href = "#" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#666",
      transition: "all 0.3s ease",
      display: "inline-flex",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = "#A51C30";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = "#666";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    {children}
  </a>
);

export default function Footer() {
  const [session, setSession] = useState(null);
  const [subCount, setSubCount] = useState(0);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false); // email Supabase đã có trong newsletter chưa
  const [welcomePopup, setWelcomePopup] = useState(false);

  // =======================================
  // 1️⃣ Load session + analytics
  // =======================================
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);

      if (currentSession?.user?.email) {
        await checkNewsletter(currentSession.user.email);
      }

      await loadAnalytics();
    };

    init();

    // lắng nghe login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        const s = newSession?.session ?? null;
        setSession(s);

        const email = s?.user?.email;
        if (email) {
          checkNewsletter(email);
        } else {
          setAlreadySubscribed(false);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Đếm tổng người đăng ký newsletter
  const loadAnalytics = async () => {
    const { count, error } = await supabase
      .from("newsletter")
      .select("id", { count: "exact", head: true });

    if (!error && typeof count === "number") {
      setSubCount(count);
    }
  };

  // Kiểm tra email Supabase đã có trong bảng newsletter chưa
  const checkNewsletter = async (email) => {
    if (!email) {
      setAlreadySubscribed(false);
      return;
    }

    const { data, error } = await supabase
      .from("newsletter")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!error && data) {
      setAlreadySubscribed(true);
    } else {
      setAlreadySubscribed(false);
    }
  };

  // =======================================
  // 2️⃣ Xử lý đăng ký email
  // (giữ logic cũ: lưu vào bảng newsletter
  //  + supabase.auth.signUp với mật khẩu tạm)
  // =======================================
  const handleSubscribe = async (email) => {
    if (!email) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    try {
      // a) Lưu email vào bảng newsletter
      const { error: newsletterError } = await supabase
        .from("newsletter")
        .upsert({ email });

      if (newsletterError) {
        console.error(newsletterError);
        toast.error("Tài Khoản Đã Tồn Tại!");
        return;
      }

      // b) Đăng ký Supabase Auth với mật khẩu tạm
      const { error } = await supabase.auth.signUp({
        email,
        password: "newsletter-temp-1234",
        options: {
          emailRedirectTo: "http://localhost:5173/verify",
        },
      });

      // Email đã tồn tại trong Auth
      if (error && error.message?.toLowerCase()?.includes("already")) {
        toast.info("Email đã đăng ký tài khoản, hãy đăng nhập ở trang Đăng nhập.");
        // nhưng vẫn coi như đã subscribe newsletter
        setAlreadySubscribed(true);
        await loadAnalytics();
        return;
      }

      if (error) {
        console.error(error);
        toast.error("Đăng ký tài khoản thất bại!");
        return;
      }

      // c) (optional) gọi Edge Function gửi email chào mừng
      try {
        await fetch(
          "https://YOUR-PROJECT.supabase.co/functions/v1/welcome-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );
      } catch (err) {
        console.log("Không gửi được email chào mừng (Edge Function).", err);
      }

      // d) cập nhật trạng thái
      setSubCount((prev) => prev + 1);
      setAlreadySubscribed(true);
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác minh.");
      setWelcomePopup(true);
      setTimeout(() => setWelcomePopup(false), 4000);
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi hệ thống!");
    }
  };

  // =======================================
  // 3️⃣ UI GIAO DIỆN CŨ — KHÔNG ĐỔI
  // =======================================
  return (
    <footer
      style={{
        backgroundColor: "#000",
        color: "#999",
        marginTop: "150px",
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "100px 5vw 60px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* 3 cột chính */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "80px",
            marginBottom: "100px",
            paddingBottom: "80px",
            borderBottom: "1px solid #222",
          }}
        >
          {/* Cột 1 – Thông tin thương hiệu */}
          <div>
            <h3
              style={{
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "4px",
                marginBottom: "30px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Danielle Luxury Jewelry
            </h3>
            <p
              style={{
                lineHeight: "1.9",
                fontSize: "15px",
                color: "#aaa",
              }}
            >
              Since 2025 – Handcrafted masterpieces in gold, diamonds & rare
              gems.
              <br />
              <br />
              <strong style={{ color: "#A51C30" }}>Tiền Giang</strong> • Thị Trấn Vĩnh Bình, GCT
              <br />
              <strong style={{ color: "#A51C30" }}>TP.HCM</strong> • Phố Đi Bộ Nguyễn Huệ, Q.1           </p>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: "15px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FiPhone size={16} /> +84 335 808 265
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FiMail size={16} /> baodan.nghuynh@gmail.com
              </span>
            </div>
          </div>

          {/* Cột 2 – Liên kết */}
          <div>
            <h3
              style={{
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: "30px",
                fontSize: "14px",
              }}
            >
              Khám phá
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                lineHeight: "2.6",
              }}
            >
              {[
                "Bộ sưu tập mới",
                "Nhẫn cưới",
                "Trang sức đá quý",
                "Dịch vụ tùy chỉnh",
                "Chính sách bảo hành",
                "Câu chuyện thương hiệu",
              ].map((item) => (
                <li key={item}>
                  <a href="/shop" style={linkStyle}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3 – Liên hệ & MXH + Newsletter */}
          <div>
            <h3
              style={{
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: "30px",
                fontSize: "14px",
              }}
            >
              Kết nối với chúng tôi
            </h3>
            <div
              style={{
                display: "flex",
                gap: "20px",
                fontSize: "28px",
                marginBottom: "30px",
              }}
            >
              <SocialIcon href="https://instagram.com">
                <FiInstagram />
              </SocialIcon>
              <SocialIcon href="https://facebook.com">
                <FaFacebookF />
              </SocialIcon>
              <SocialIcon href="https://youtube.com">
                <FaYoutube />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com">
                <FaLinkedinIn />
              </SocialIcon>
            </div>

            {/* OPTION C: nếu user đang login & email đó đã đăng ký newsletter → hiển thị thông báo
                ngược lại vẫn hiện form đăng ký */}
            {session && alreadySubscribed ? (
              <p
                style={{
                  fontSize: "14px",
                  color: "#7CFFB2",
                  lineHeight: "1.8",
                }}
              >
                ✔ Email <strong>{session.user.email}</strong> đã đăng ký nhận
                thông tin từ Danielle.
                <br />
                Hiện có <strong>{subCount}</strong> người theo dõi Danielle.
              </p>
            ) : (
              <>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#777",
                    lineHeight: "1.8",
                  }}
                >
                  Đăng ký nhận thông tin về bộ sưu tập độc quyền & ưu đãi riêng.
                </p>
                <form
                  style={{ marginTop: "20px", display: "flex" }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const email = e.target.email?.value?.trim();
                    handleSubscribe(email);
                  }}
                >
                  <input
                    name="email"
                    type="email"
                    placeholder="Email của bạn"
                    style={{
                      flex: 1,
                      padding: "14px 18px",
                      background: "#111",
                      border: "1px solid #333",
                      color: "#fff",
                      borderRadius: "8px 0 0 8px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    style={{
                      padding: "14px 24px",
                      background: "#A51C30",
                      color: "white",
                      border: "none",
                      borderRadius: "0 8px 8px 0",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#c51c35")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#A51C30")
                    }
                  >
                    Đăng ký
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Logo + Copyright */}
        <div style={{ textAlign: "center", paddingTop: "60px" }}>
          <h1
            style={{
              fontSize: "68px",
              background:
                "linear-gradient(90deg, #A51C30, #ff6b6b, #A51C30)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 8px",
              letterSpacing: "12px",
              fontWeight: 700,
            }}
          >
            DANIELLE
          </h1>
          <p
            style={{
              color: "#A51C30",
              fontSize: "24px",
              margin: "0 0 50px",
              letterSpacing: "6px",
              fontWeight: 500,
            }}
          >
            LUXURY JEWELRY • EST. 2025
          </p>

          <p
            style={{
              color: "#444",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            © 2025 DANIELLE Jewelry. All rights reserved. Handcrafted in Vietnam
            with love.
          </p>
        </div>

        {/* POPUP CHÀO MỪNG (khi vừa đăng ký xong) */}
        {welcomePopup && (
          <div
            style={{
              position: "fixed",
              bottom: "40px",
              right: "40px",
              background: "#111",
              color: "#fff",
              padding: "30px",
              borderRadius: "20px",
              border: "1px solid #A51C30",
              zIndex: 2000,
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "10px" }}>🎉 Chào mừng bạn!</h3>
            <p style={{ margin: 0 }}>
              Bạn đã đăng ký nhận ưu đãi thành công. Hãy kiểm tra email để xác
              minh tài khoản.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
