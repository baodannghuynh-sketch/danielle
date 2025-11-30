import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .then(({ data }) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Người dùng</h1>

      {users.map((u) => (
        <div key={u.id} style={{ padding: 20, borderBottom: "1px solid #ccc" }}>
          <p><b>Tên:</b> {u.full_name}</p>
          <p><b>SĐT:</b> {u.phone}</p>
          <p><b>Địa chỉ:</b> {u.address}</p>
          <p><b>ID:</b> {u.id}</p>
        </div>
      ))}
    </div>
  );
}
//src/pages/AdminUsers.jsx