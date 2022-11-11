import { configureStore } from "@reduxjs/toolkit";
import globalSliceReducer from "./slices/globalSlice";
export const store = configureStore({
  reducer: {
    global: globalSliceReducer,
  },
});
