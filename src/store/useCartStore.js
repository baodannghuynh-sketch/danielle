// src/store/useCartStore.js
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  // ---------------- UI ----------------
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  // ---------------- DATA ----------------
  items: [],
  wishlist: [],
  recentViewed: [],

  // Load từ localStorage
  initCart: () => {
    const cart = localStorage.getItem("cart");
    const wishlist = localStorage.getItem("wishlist");
    const recent = localStorage.getItem("recent");

    if (cart) set({ items: JSON.parse(cart) });
    if (wishlist) set({ wishlist: JSON.parse(wishlist) });
    if (recent) set({ recentViewed: JSON.parse(recent) });
  },

  // Lưu vào localStorage
  persist: () => {
    const state = get();
    localStorage.setItem("cart", JSON.stringify(state.items));
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    localStorage.setItem("recent", JSON.stringify(state.recentViewed));
  },

  // ---------------- CART ----------------
  addItem: (product) => {
    let items = [...get().items];
    const idx = items.findIndex((i) => i.id === product.id);

    if (idx >= 0) {
      items[idx].quantity += 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || product.image,
        quantity: 1,
      });
    }

    set({ items });
    get().persist();
  },

  updateQuantity: (id, quantity) => {
    let items = [...get().items];

    if (quantity <= 0) {
      items = items.filter((i) => i.id !== id);
    } else {
      items = items.map((i) =>
        i.id === id ? { ...i, quantity: quantity } : i
      );
    }

    set({ items });
    get().persist();
  },

  increaseQuantity: (id) => {
    const items = get().items.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    set({ items });
    get().persist();
  },

  decreaseQuantity: (id) => {
    let items = get().items.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity - 1 } : i
    );
    items = items.filter((i) => i.quantity > 0);

    set({ items });
    get().persist();
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
    get().persist();
  },

  clear: () => {
    set({ items: [] });
    get().persist();
  },

  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  // ---------------- WISHLIST ----------------
  toggleWishlist: (p) => {
    let w = [...get().wishlist];
    const exists = w.find((i) => i.id === p.id);

    if (exists) {
      w = w.filter((i) => i.id !== p.id);
    } else {
      w.push({
        id: p.id,
        name: p.name,
        price: p.price,
        image_url: p.image_url || p.image,
      });
    }

    set({ wishlist: w });
    get().persist();
  },

  // ---------------- RECENT VIEWED ----------------
  addRecentViewed: (p) => {
    let r = [...get().recentViewed];

    // xóa nếu đã tồn tại
    r = r.filter((i) => i.id !== p.id);

    // thêm vào đầu danh sách
    r.unshift(p);

    // chỉ giữ 10 sản phẩm gần nhất
    if (r.length > 10) r.pop();

    set({ recentViewed: r });
    get().persist();
  },
}));
