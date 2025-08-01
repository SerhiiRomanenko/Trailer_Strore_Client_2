// store.ts
import { configureStore, Middleware } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import favoritesReducer from "./favoritesSlice";
import ordersReducer from "./ordersSlice";
import trailersReducer from "./trailerSlice";
import componentsReducer from "./componentSlice";

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const actionType = (action as { type?: string })?.type;

  if (actionType?.startsWith("cart/")) {
    const cartState = store.getState().cart;
    localStorage.setItem("cartItems", JSON.stringify(cartState.items));
  }
  if (actionType?.startsWith("favorites/")) {
    const favoritesState = store.getState().favorites;
    localStorage.setItem("favoriteItems", JSON.stringify(favoritesState.ids));
  }

  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
    trailers: trailersReducer,
    components: componentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
