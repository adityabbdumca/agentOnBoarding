import { createSlice } from "@reduxjs/toolkit";
const lessthan576 = window.matchMedia("(max-width: 576px)").matches;
const SideBar = createSlice({
  name: "sidebar",
  initialState: {
    open: lessthan576 ? false : true,
    sideMenu: [],
  },
  reducers: {
    setSidebarOpen: (state, action) => {
      state.open = action.payload;
    },
    setSideMenu: (state, action) => {
      state.sideMenu = action.payload;
    },
  },
});

export default SideBar.reducer;

export const { setSidebarOpen, setSideMenu } = SideBar.actions;
