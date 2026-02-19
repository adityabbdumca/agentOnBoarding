import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: {
      primaryColor: "#1976d2",
      secondaryColor: "#DCC6E7",
      tertiaryColor: "#fff",
      buttonsColor: "#292929",
      textColor: "#fff",
      fontFamily: "Manrope",
      lightColor: "#4b1849ad",
    },
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    setColor: (state, action) => {
      state.theme = { ...state.theme, ...action.payload };
    },
  },
});

export const { setTheme, setColor } = themeSlice.actions;

export default themeSlice.reducer;
