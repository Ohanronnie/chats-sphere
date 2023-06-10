import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  id: string;
  messages: string[];
}
export type RootState = {
  user: IState;
};
const initialState: IState = {
  id: "",
  messages: [],
};

const idSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setId } = idSlice.actions;
export default idSlice.reducer;
