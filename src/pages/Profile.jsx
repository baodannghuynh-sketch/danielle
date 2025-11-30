// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/7662/7662057.png"; // Avatar kim cương sang trọng

  // =============================
  // 📌 Load User + Profile
  // =============================
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);

      const { data: pf } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (pf) {
        setProfile({
          full_name: pf.full_name || "",
          phone: pf.phone || "",
          address: pf.address || "",
          avatar_url: pf.avatar_url || "",
        });
      }

      setLoading(false);
    };

    load();
  }, []);

  // =============================
  // 📌 Handle save
  // =============================
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          avatar_url: profile.avatar_url,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Đã lưu hồ sơ!");

      // 🔥 Cập nhật navbar ngay lập tức
      const event = new CustomEvent("profileUpdated");
      window.dispatchEvent(event);

      // 🔥 Quay về trang trước
      setTimeout(() => navigate(-1), 400);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi lưu hồ sơ!");
    } finally {
      setSaving(false);
    }
  };

  // =============================
  // 📌 Upload ảnh avatar
  // =============================
  const uploadAvatar = async (file) => {
    if (!file) return;

    const fileName = `avatar_${user.id}_${Date.now()}`;

    let { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) {
      toast.error("Upload ảnh lỗi!");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    setProfile({ ...profile, avatar_url: urlData.publicUrl });

    toast.success("Đổi avatar thành công!");
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "200px", color: "#fff" }}>
        Đang tải...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url("${profile.avatar_url ||
          DEFAULT_AVATAR}") center/cover`,
        padding: "160px 20px 80px",
        display: "flex",
        justifyContent: "center",
        color: "white",
      }}
    >
      <form
        onSubmit={handleSave}
        style={{
          width: "520px",
          background: "rgba(255,255,255,0.06)",
          padding: "40px",
          borderRadius: "22px",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* AVATAR */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <label style={{ cursor: "pointer" }}>
            <img
              src={profile.avatar_url || DEFAULT_AVATAR}
              alt="avatar"
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid rgba(255,255,255,0.6)",
                boxShadow: "0 0 20px rgba(255,255,255,0.4)",
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadAvatar(e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>

          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              marginTop: "20px",
              fontSize: "36px",
              letterSpacing: "4px",
            }}
          >
            {profile.full_name || "Chưa có tên"}
          </h2>
        </div>

        {/* INPUT */}
        <label style={labelStyle}>Họ và tên</label>
        <input
          value={profile.full_name}
          onChange={(e) =>
            setProfile({ ...profile, full_name: e.target.value })
          }
          style={inputStyle}
        />

        <label style={labelStyle}>Số điện thoại</label>
        <input
          value={profile.phone}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
          style={inputStyle}
        />

        <label style={labelStyle}>Địa chỉ</label>
        <input
          value={profile.address}
          onChange={(e) =>
            setProfile({ ...profile, address: e.target.value })
          }
          style={inputStyle}
        />

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "16px",
            borderRadius: "50px",
            border: "none",
            background: "linear-gradient(90deg, #A51C30, #c51c35)",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "3px",
            cursor: "pointer",
          }}
        >
          {saving ? "Đang lưu..." : "LƯU THAY ĐỔI"}
        </button>
      </form>
    </div>
  );
}

// Style
const labelStyle = {
  marginTop: "14px",
  fontSize: "15px",
  opacity: 0.9,
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "6px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.15)",
  color: "white",
  fontSize: "16px",
};
