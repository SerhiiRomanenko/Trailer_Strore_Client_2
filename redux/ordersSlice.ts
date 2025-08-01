import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../types";
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
  error: string | null;
}

const initialState: OrdersState = {
  list: [],
  currentOrder: null,
  status: "idle",
  error: null,
};

export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Отримання одного замовлення за ID
export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/fetchOrderById", async (orderId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Додавання нового замовлення
export const addOrder = createAsyncThunk<
  Order, // Тип повернення
  Omit<Order, "id" | "status" | "date" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>("orders/addOrder", async (newOrderData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post("/api/orders", newOrderData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: OrderStatus },
  { rejectValue: string }
>(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Видалення замовлення
export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("orders/deleteOrder", async (orderId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    await axios.delete(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return orderId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
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
        state.error = action.payload || "Failed to fetch orders";
      })
      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch my orders";
      })
      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
        state.currentOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch order by ID";
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
        state.status = "failed";
        state.error = action.payload || "Failed to add order";
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update order status";
      })
      // deleteOrder
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.list = state.list.filter((order) => order.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete order";
      });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
