// src/store/useCartStore.js
import { create } from 'zustand';

// Đảm bảo hook này được EXPORT để các Component khác có thể import
export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  initCart: () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        set({ items: JSON.parse(saved) });
      } catch {
        localStorage.removeItem('cart');
      }
    }
  },

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...state.items, { ...product, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      let newItems;
      if (quantity <= 0) {
        newItems = state.items.filter((i) => i.id !== id);
      } else {
        newItems = state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    }),

  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    }),

  clear: () => {
    localStorage.removeItem('cart');
    set({ items: [], isOpen: false });
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getCount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));