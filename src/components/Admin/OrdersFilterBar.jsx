// src/components/admin/OrdersFilterBar.jsx
import { useState } from "react";

export default function OrdersFilterBar({ onFilter, onExport }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const applyFilter = () => {
    onFilter(search, status);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        margin: "20px 0",
        flexWrap: "wrap",
      }}
    >
      <input
        placeholder="Tìm theo mã, tên, SĐT..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onFilter(e.target.value, status);
        }}
        style={{
          padding: 12,
          flex: 1,
          borderRadius: 8,
          border: "1px solid #444",
          background: "#222",
          color: "white",
        }}
      />

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          onFilter(search, e.target.value);
        }}
        style={{
          padding: 12,
          borderRadius: 8,
          background: "#222",
          border: "1px solid #444",
          color: "white",
        }}
      >
        <option value="all">Tất cả</option>
        <option value="pending">Đang xử lý</option>
        <option value="shipping">Đang giao</option>
        <option value="completed">Hoàn tất</option>
        <option value="cancelled">Đã hủy</option>
      </select>

      <button
        onClick={onExport}
        style={{
          padding: "12px 20px",
          background: "#A51C30",
          border: "none",
          borderRadius: 8,
          color: "white",
          cursor: "pointer",
        }}
      >
        Export Excel
      </button>
    </div>
  );
}
