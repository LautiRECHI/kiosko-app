import { create } from "zustand";

interface CartItem {
  varianteId: string;
  nombre: string;
  sabor_tipo: string;
  precio: number;
  cantidad: number;
}

interface CartStore {
  items: CartItem[];
  agregar: (item: CartItem) => void;
  quitar: (varianteId: string) => void;
  limpiar: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  agregar: (item) => {
    const items = get().items;
    const existe = items.find((i) => i.varianteId === item.varianteId);
    if (existe) {
      set({
        items: items.map((i) =>
          i.varianteId === item.varianteId
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        ),
      });
    } else {
      set({ items: [...items, { ...item, cantidad: 1 }] });
    }
  },
  quitar: (varianteId) => {
    set({ items: get().items.filter((i) => i.varianteId !== varianteId) });
  },
  limpiar: () => set({ items: [] }),
  total: () => get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
}));