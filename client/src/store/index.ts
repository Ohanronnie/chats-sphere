import { configureStore } from "@reduxjs/toolkit";
import idReducer from "./slice";

const store = configureStore({
  reducer: {
    user: idReducer,
  },
});

export default store;
