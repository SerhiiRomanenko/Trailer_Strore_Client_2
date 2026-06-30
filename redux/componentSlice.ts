import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../types";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "https://trailer-strore-server.onrender.com";

function loadCachedComponents(): Product[] {
  try {
    const cached = localStorage.getItem("cachedComponents");
    if (cached) {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch { /* ignore */ }
  return [];
}

interface ComponentsState {
  list: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const cachedComponents = loadCachedComponents();

const initialState: ComponentsState = {
  list: cachedComponents,
  status: cachedComponents.length > 0 ? "succeeded" : "idle",
  error: null,
};

export const fetchComponents = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("components/fetchComponents", async (_, { rejectWithValue }) => {
  try {
    const maxRetries = 2;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/components`, {
          timeout: 30000,
        });
        return response.data;
      } catch (error: any) {
        if (i === maxRetries) throw error;
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
    return [];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addComponent = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("components/addComponent", async (newComponentData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return rejectWithValue(
        "Токен авторизації відсутній. Будь ласка, увійдіть як адміністратор."
      );
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/components`,
      newComponentData,
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
});

export const updateComponent = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>(
  "components/updateComponent",
  async (updatedComponentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue(
          "Токен авторизації відсутній. Будь ласка, увійдіть як адміністратор."
        );
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/components/${updatedComponentData.id}`,
        updatedComponentData,
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

export const deleteComponent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("components/deleteComponent", async (componentId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return rejectWithValue(
        "Токен авторизації відсутній. Будь ласка, увійдіть як адміністратор."
      );
    }

    await axios.delete(`${API_BASE_URL}/api/components/${componentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return componentId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchComponentById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("components/fetchComponentById", async (componentId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/components/${componentId}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const componentSlice = createSlice({
  name: "components",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchComponents.rejected, (state, action) => {
        // Don't change status if we have cached data
        if (state.list.length === 0) {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch components";
        }
      })
      .addCase(addComponent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addComponent.rejected, (state, action) => {
        state.error = action.payload || "Failed to add component";
      })
      .addCase(updateComponent.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateComponent.rejected, (state, action) => {
        state.error = action.payload || "Failed to update component";
      })
      .addCase(deleteComponent.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteComponent.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete component";
      })
      .addCase(fetchComponentById.fulfilled, (state, action) => {
        const existingIndex = state.list.findIndex(
          (item) => item.id === action.payload.id
        );
        if (existingIndex !== -1) {
          state.list[existingIndex] = action.payload;
        } else {
          state.list.push(action.payload);
        }
        state.status = "succeeded";
      })
      .addCase(fetchComponentById.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch component by ID";
      });
  },
});

export default componentSlice.reducer;
