// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseclient'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Men from './pages/Men'
import Women from './pages/Women'
import Handcrafted from './pages/Handcrafted'
import AdminLayout from './pages/AdminLayout'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ======================
  // LOAD ADMIN FLAG
  // ======================
  useEffect(() => {
    const adminFlag = localStorage.getItem("isAdmin");
    setIsAdmin(adminFlag === "true");
  }, []);

  // ======================
  // LOAD SESSION + PROFILE
  // ======================
  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user || null;

        setUser(currentUser);

        if (currentUser) {
          // Lấy role admin
          await checkAdminRole(currentUser.email);

          // Lấy profile (QUAN TRỌNG)
          const { data: p } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

          setProfile(p);
        } else {
          setProfile(null);
        }

      } catch (err) {
        console.error("Lỗi getSession:", err);

      } finally {
        setLoading(false);
      }
    };

    load();

    // Realtime
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);

      if (u) {
        checkAdminRole(u.email);

        supabase
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .single()
          .then(res => setProfile(res.data));
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // ======================
  // CHECK ADMIN
  // ======================
  const checkAdminRole = async (email) => {
    try {
      const { data } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single();

      setIsAdmin(!!data);

    } catch (err) {
      console.error("Lỗi checkAdminRole:", err);
      setIsAdmin(false);
    }
  };

  // Splash loading
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Playfair Display", serif'
      }}>
        <h1 style={{
          fontSize: '120px',
          letterSpacing: '20px',
          background: 'linear-gradient(90deg, #A51C30, #fff, #A51C30)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          DANIELLE
        </h1>
        <p style={{ letterSpacing: '10px', marginTop: '40px' }}>
          L U X U R Y &nbsp; I S &nbsp; E T E R N A L
        </p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>

        {/* ⭐ TRUYỀN ĐỦ PROFILE CHO NAVBAR ⭐ */}
        <Navbar user={user} profile={profile} isAdmin={isAdmin} />

        <main style={{ minHeight: '100vh', paddingTop: '120px' }}>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />

            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/handcrafted" element={<Handcrafted />} />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={isAdmin ? <AdminLayout /> : <Navigate to="/" />}
            >
              <Route index element={<AdminProducts />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

          <ToastContainer position="top-right" theme="dark" />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
