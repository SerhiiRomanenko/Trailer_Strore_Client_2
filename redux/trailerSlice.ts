import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";
import api from "../api/axiosInstance";

function loadCachedTrailers(): Product[] {
  try {
    const cached = localStorage.getItem("cachedTrailers");
    if (cached) {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    /* ignore */
  }
  return [];
}

interface TrailersState {
  list: Product[];
  currentProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const cachedTrailers = loadCachedTrailers();

const initialState: TrailersState = {
  list: cachedTrailers,
  currentProduct: null,
  status: cachedTrailers.length > 0 ? "succeeded" : "idle",
  detailStatus: "idle",
  error: null,
};

export const fetchTrailers = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("trailers/fetchTrailers", async (_, { rejectWithValue }) => {
  const maxRetries = 2;
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const { data } = await api.get("/api/trailers");
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      lastError = error;
      if (i < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
  }

  return rejectWithValue(
    lastError?.response?.data?.message || lastError?.message || "Не вдалося завантажити причепи"
  );
});

export const fetchTrailerById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("trailers/fetchTrailerById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/trailers/${id}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося завантажити причіп"
    );
  }
});

export const fetchTrailerBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("trailers/fetchTrailerBySlug", async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/trailers/slug/${slug}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося завантажити деталі"
    );
  }
});

export const addTrailer = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("trailers/addTrailer", async (newTrailer, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/api/trailers", newTrailer);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося додати причіп"
    );
  }
});

export const updateTrailer = createAsyncThunk<
  Product,
  { id: string; updatedData: Partial<Product> },
  { rejectValue: string }
>("trailers/updateTrailer", async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/trailers/${id}`, updatedData);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося оновити причіп"
    );
  }
});

export const deleteTrailer = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("trailers/deleteTrailer", async (trailerId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/trailers/${trailerId}`);
    return trailerId;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Не вдалося видалити причіп"
    );
  }
});

const trailerSlice = createSlice({
  name: "trailers",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.detailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchTrailers ---
      .addCase(fetchTrailers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTrailers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchTrailers.rejected, (state, action) => {
        if (state.list.length === 0) {
          state.status = "failed";
          state.error = action.payload || "Не вдалося завантажити причепи";
        }
      })
      // --- fetchTrailerById ---
      .addCase(fetchTrailerById.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })
      .addCase(fetchTrailerById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.detailStatus = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchTrailerById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.payload || "Не вдалося завантажити причіп";
      })
      // --- fetchTrailerBySlug ---
      .addCase(fetchTrailerBySlug.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })
      .addCase(fetchTrailerBySlug.fulfilled, (state, action: PayloadAction<Product>) => {
        state.detailStatus = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchTrailerBySlug.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.payload || "Не вдалося завантажити деталі причепа";
      })
      // --- addTrailer ---
      .addCase(addTrailer.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addTrailer.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося додати причіп";
      })
      // --- updateTrailer ---
      .addCase(updateTrailer.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (trailer) => trailer.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
      })
      .addCase(updateTrailer.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося оновити причіп";
      })
      // --- deleteTrailer ---
      .addCase(deleteTrailer.fulfilled, (state, action) => {
        state.list = state.list.filter((trailer) => trailer.id !== action.payload);
      })
      .addCase(deleteTrailer.rejected, (state, action) => {
        state.error = action.payload || "Не вдалося видалити причіп";
      });
  },
});

export const { clearCurrentProduct } = trailerSlice.actions;
export default trailerSlice.reducer;
