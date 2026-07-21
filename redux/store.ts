import { configureStore, Middleware } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import favoritesReducer from "./favoritesSlice";
import ordersReducer from "./ordersSlice";
import trailersReducer from "./trailerSlice";
import componentsReducer from "./componentSlice";

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage full or disabled — silent fail, no crash
  }
};

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const actionType = (action as { type?: string })?.type;

  if (actionType?.startsWith("cart/")) {
    const cartState = store.getState().cart;
    safeSetItem("cartItems", JSON.stringify(cartState.items));
  }
  if (actionType?.startsWith("favorites/")) {
    const favoritesState = store.getState().favorites;
    safeSetItem("favoriteItems", JSON.stringify(favoritesState.ids));
  }
  if (actionType === "trailers/fetchTrailers/fulfilled") {
    const trailersList = store.getState().trailers.list;
    safeSetItem("cachedTrailers", JSON.stringify(trailersList));
  }
  if (actionType === "components/fetchComponents/fulfilled") {
    const componentsList = store.getState().components.list;
    safeSetItem("cachedComponents", JSON.stringify(componentsList));
  }
  if (
    actionType === "orders/fetchAllOrders/fulfilled" ||
    actionType === "orders/fetchMyOrders/fulfilled" ||
    actionType === "orders/addOrder/fulfilled" ||
    actionType === "orders/updateOrderStatus/fulfilled" ||
    actionType === "orders/deleteOrder/fulfilled"
  ) {
    const ordersList = store.getState().orders.list;
    safeSetItem("cachedOrders", JSON.stringify(ordersList));
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
