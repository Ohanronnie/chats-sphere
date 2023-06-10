import { configureStore } from "@reduxjs/toolkit";
import idReducer from "./counterSlice.ts";

const store = configureStore({
  reducer: {
    id: idReducer,
  },
});

export default store;
