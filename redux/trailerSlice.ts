import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../types";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "https://trailer-strore-server.onrender.com";

function loadCachedTrailers(): Product[] {
  try {
    const cached = localStorage.getItem("cachedTrailers");
    if (cached) {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch { /* ignore */ }
  return [];
}

interface TrailersState {
  list: Product[];
  currentProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const cachedTrailers = loadCachedTrailers();

const initialState: TrailersState = {
  list: cachedTrailers,
  currentProduct: null,
  status: cachedTrailers.length > 0 ? "succeeded" : "idle",
  error: null,
};

export const fetchTrailers = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("trailers/fetchTrailers", async (_, { rejectWithValue }) => {
  try {
    const maxRetries = 2;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/trailers`, {
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

export const fetchTrailerById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("trailers/fetchTrailerById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/trailers/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchTrailerBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("trailers/fetchTrailerBySlug", async (slug, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/trailers/slug/${slug}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addTrailer = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("trailers/addTrailer", async (newTrailer, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return rejectWithValue(
        "Токен авторизації відсутній. Будь ласка, увійдіть як адміністратор."
      );
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/trailers`,
      newTrailer,
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

export const updateTrailer = createAsyncThunk<
  Product,
  { id: string; updatedData: Partial<Product> },
  { rejectValue: string }
>(
  "trailers/updateTrailer",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue(
          "Токен авторизації відсутній. Будь ласка, увійдіть як адміністратор."
        );
      }

      const response = await axios.put(`${API_BASE_URL}/api/trailers/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTrailer = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("trailers/deleteTrailer", async (trailerId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return rejectWithValue(
        "Токен авторизації відсутній. Будь ласка, увійдіть як адміністратор."
      );
    }

    await axios.delete(`${API_BASE_URL}/api/trailers/${trailerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return trailerId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const trailerSlice = createSlice({
  name: "trailers",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrailers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTrailers.rejected, (state, action) => {
        // Don't change status if we have cached data
        if (state.list.length === 0) {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch trailers";
        }
      })
      .addCase(fetchTrailerById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchTrailerById.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch product by ID";
        state.currentProduct = null;
      })
      .addCase(fetchTrailerBySlug.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchTrailerBySlug.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch product details";
        state.currentProduct = null;
      })
      .addCase(addTrailer.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addTrailer.rejected, (state, action) => {
        state.error = action.payload || "Failed to add trailer";
      })
      .addCase(updateTrailer.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (trailer) => trailer.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateTrailer.rejected, (state, action) => {
        state.error = action.payload || "Failed to update trailer";
      })
      .addCase(deleteTrailer.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (trailer) => trailer.id !== action.payload
        );
      })
      .addCase(deleteTrailer.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete trailer";
      });
  },
});

export const { clearCurrentProduct } = trailerSlice.actions;
export default trailerSlice.reducer;
