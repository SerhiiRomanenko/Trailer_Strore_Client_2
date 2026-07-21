import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "../types";
import api from "../api/axiosInstance";

function loadCachedComponents(): Product[] {
  try {
    const cached = localStorage.getItem("cachedComponents");
    if (cached) {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    /* ignore */
  }
  return [];
}

interface ComponentsState {
  list: Product[];
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const cachedComponents = loadCachedComponents();

const initialState: ComponentsState = {
  list: cachedComponents,
  detailStatus: "idle",
  status: cachedComponents.length > 0 ? "succeeded" : "idle",
  error: null,
};

export const fetchComponents = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("components/fetchComponents", async (_, { rejectWithValue }) => {
  const maxRetries = 2;
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const { data } = await api.get("/api/components");
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      lastError = error;
      if (i < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
  }

  return rejectWithValue(
    lastError?.response?.data?.message || lastError?.message || "Не вдалося завантажити комплектуючі"
  );
});

export const fetchComponentById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("components/fetchComponentById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/components/${id}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося завантажити комплектуючу"
    );
  }
});

export const addComponent = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("components/addComponent", async (newComponentData, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/api/components", newComponentData);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося додати комплектуючу"
    );
  }
});

export const updateComponent = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("components/updateComponent", async (updatedComponentData, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/components/${updatedComponentData.id}`, updatedComponentData);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося оновити комплектуючу"
    );
  }
});

export const deleteComponent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("components/deleteComponent", async (componentId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/components/${componentId}`);
    return componentId;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося видалити комплектуючу"
    );
  }
});

const componentSlice = createSlice({
  name: "components",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchComponents.rejected, (state, action) => {
        if (state.list.length === 0) {
          state.status = "failed";
          state.error = action.payload || "Не вдалося завантажити комплектуючі";
        }
      })
      .addCase(fetchComponentById.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })
      .addCase(fetchComponentById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        const existingIndex = state.list.findIndex(
          (item) => item.id === action.payload.id
        );
        if (existingIndex !== -1) {
          state.list[existingIndex] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(fetchComponentById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.payload || "Не вдалося завантажити комплектуючу";
      })
      .addCase(addComponent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addComponent.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося додати комплектуючу";
      })
      .addCase(updateComponent.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
      })
      .addCase(updateComponent.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося оновити комплектуючу";
      })
      .addCase(deleteComponent.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteComponent.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося видалити комплектуючу";
      });
  },
});

export default componentSlice.reducer;
