import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  ids: string[];
}

const loadFromLocalStorage = (): string[] => {
  try {
    const serializedState = localStorage.getItem("favoriteItems");
    if (serializedState === null) {
      return [];
    }
    const parsed: unknown = JSON.parse(serializedState);

    if (!Array.isArray(parsed)) {
      return [];
    }

    if (
      parsed.length > 0 &&
      typeof parsed[0] === "object" &&
      parsed[0] !== null &&
      "id" in parsed[0]
    ) {
      return parsed.map((item) => String((item as { id: unknown }).id));
    }

    if (parsed.every((item) => typeof item === "string")) {
      return parsed as string[];
    }

    return [];
  } catch (e) {
    console.warn("Could not load favorite items from local storage", e);
    return [];
  }
};

const initialState: FavoritesState = {
  ids: loadFromLocalStorage(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingIndex = state.ids.indexOf(id);
      if (existingIndex >= 0) {
        state.ids.splice(existingIndex, 1);
      } else {
        state.ids.push(id);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
