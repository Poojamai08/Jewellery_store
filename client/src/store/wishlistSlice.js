import { createSlice } from "@reduxjs/toolkit";

const savedWishlist = localStorage.getItem("aureliaWishlist");

const initialState = {
  items: savedWishlist ? JSON.parse(savedWishlist) : [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => String(item.id) === String(product.id)
      );

      if (!existingItem) {
        state.items.push(product);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => String(item.id) !== String(action.payload)
      );
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existingItem) {
        state.items = state.items.filter(
          (item) => String(item.id) !== String(product.id)
        );
      } else {
        state.items.push(product);
      }
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;