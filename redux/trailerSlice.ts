// src/redux/trailerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../types";

interface TrailersState {
  list: Product[];
  currentProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TrailersState = {
  list: [],
  currentProduct: null,
  status: "idle",
  error: null,
};

export const fetchTrailers = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("trailers/fetchTrailers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/trailers");
    return response.data;
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
    const response = await axios.get(`/api/trailers/${id}`);
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
    const response = await axios.get(`/api/trailers/slug/${slug}`);
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

    const response = await axios.post("/api/trailers", newTrailer, {
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

      const response = await axios.put(`/api/trailers/${id}`, updatedData, {
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

    await axios.delete(`/api/trailers/${trailerId}`, {
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
      .addCase(fetchTrailers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrailers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTrailers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch trailers";
      })
      .addCase(fetchTrailerById.pending, (state) => {
        state.status = "loading";
        state.currentProduct = null;
      })
      .addCase(
        fetchTrailerById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = "succeeded";
          state.currentProduct = action.payload;
        }
      )
      .addCase(fetchTrailerById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch product by ID";
        state.currentProduct = null;
      })
      .addCase(fetchTrailerBySlug.pending, (state) => {
        state.status = "loading";
        state.currentProduct = null;
      })
      .addCase(
        fetchTrailerBySlug.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = "succeeded";
          state.currentProduct = action.payload;
        }
      )
      .addCase(fetchTrailerBySlug.rejected, (state, action) => {
        state.status = "failed";
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
