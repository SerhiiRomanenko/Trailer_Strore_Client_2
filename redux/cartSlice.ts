import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const loadFromLocalStorage = (): CartItem[] => {
  try {
    const serializedState = localStorage.getItem("cartItems");
    if (serializedState === null) {
      return [];
    }
    const parsedItems: (Product | CartItem)[] = JSON.parse(serializedState);
    return parsedItems.map((item) => {
      if ("quantity" in item && typeof item.quantity === "number") {
        return item as CartItem;
      }
      return { ...item, quantity: 1 };
    });
  } catch (e) {
    console.warn("Could not load cart items from local storage", e);
    return [];
  }
};

const initialState: CartState = {
  items: loadFromLocalStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity++;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
