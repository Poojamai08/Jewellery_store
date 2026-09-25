import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

const loadState = () => {
  try {
    const savedCart = localStorage.getItem("aureliaCart");
    const savedWishlist = localStorage.getItem("aureliaWishlist");

    return {
      cart: {
        items: savedCart ? JSON.parse(savedCart) : [],
      },
      wishlist: {
        items: savedWishlist ? JSON.parse(savedWishlist) : [],
      },
    };
  } catch (error) {
    console.error("Error loading saved Redux data:", error);

    return {
      cart: {
        items: [],
      },
      wishlist: {
        items: [],
      },
    };
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },

  preloadedState,
});

store.subscribe(() => {
  try {
    const state = store.getState();

    localStorage.setItem(
      "aureliaCart",
      JSON.stringify(state.cart.items)
    );

    localStorage.setItem(
      "aureliaWishlist",
      JSON.stringify(state.wishlist.items)
    );
  } catch (error) {
    console.error("Error saving Redux data:", error);
  }
});

export default store;