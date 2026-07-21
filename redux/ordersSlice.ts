import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "../types";
import api from "../api/axiosInstance";

export interface OrderItem extends Product {
  quantity: number;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  date: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    method: "pickup" | "nova-poshta";
    cityRef?: string;
    cityName?: string;
    branchRef?: string;
    branchName?: string;
  };
  payment: {
    method: "cash" | "card";
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

interface OrdersState {
  list: Order[];
  currentOrder: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const cachedOrders = (() => {
  try {
    const cached = localStorage.getItem("cachedOrders");
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
})();

const initialState: OrdersState = {
  list: cachedOrders,
  currentOrder: null,
  status: cachedOrders.length > 0 ? "succeeded" : "idle",
  detailStatus: "idle",
  error: null,
};

export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchAllOrders", async (_, { rejectWithValue }) => {
  const maxRetries = 2;
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const { data } = await api.get("/api/orders");
      return data;
    } catch (error: any) {
      lastError = error;
      if (i < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
  }

  return rejectWithValue(
    lastError?.response?.data?.message || lastError?.message || "Не вдалося завантажити замовлення"
  );
});

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/api/orders/my-orders");
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося завантажити мої замовлення"
    );
  }
});

export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/fetchOrderById", async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/orders/${orderId}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося завантажити замовлення"
    );
  }
});

export const addOrder = createAsyncThunk<
  Order,
  Omit<Order, "id" | "status" | "date" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>("orders/addOrder", async (newOrderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/api/orders", newOrderData);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося створити замовлення"
    );
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: OrderStatus },
  { rejectValue: string }
>("orders/updateOrderStatus", async ({ orderId, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/orders/${orderId}/status`, { status });
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося оновити статус"
    );
  }
});

export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("orders/deleteOrder", async (orderId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/orders/${orderId}`);
    return orderId;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося видалити замовлення"
    );
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.detailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Не вдалося завантажити замовлення";
      })
      // fetchMyOrders — uses same status (list-level)
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Не вдалося завантажити мої замовлення";
      })
      // fetchOrderById — uses detailStatus (independent of list)
      .addCase(fetchOrderById.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.payload || "Не вдалося завантажити замовлення";
        state.currentOrder = null;
      })
      // addOrder
      .addCase(addOrder.fulfilled, (state, action) => {
        if (!state.list.some((order) => order.id === action.payload.id)) {
          state.list.push(action.payload);
        }
        state.status = "succeeded";
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося створити замовлення";
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = {
            ...state.list[index],
            status: action.payload.status,
            updatedAt: action.payload.updatedAt,
          };
        }
        state.status = "succeeded";
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося оновити статус замовлення";
      })
      // deleteOrder
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.list = state.list.filter((order) => order.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося видалити замовлення";
      });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
