import { createSlice } from "@reduxjs/toolkit";
interface IState {
  id: string;
  messages: string[] | [];
}
const initialState: IState = {
  id: "",
  messages: [],
};
const idSlice = createSlice({
  name: "id",
  initialState,
  reducers: {
    setId(state, payload) {
      state.id = payload.payload;
    },
  },
});

export const { setId } = idSlice.actions;
export default idSlice.reducer;
