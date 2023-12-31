import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IState {
  id: string;
  messages: string[];
}

const initialState: IState = {
  id: "",
  messages: [],
};

const idSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setId } = idSlice.actions;
export default idSlice.reducer;
