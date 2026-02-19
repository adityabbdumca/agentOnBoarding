import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../GlobalSlice/theme.slice";
import agentReducer from "../modules/OnboardingDetails/agent.slice";
import sideBarReducer from "../Components/SideBar/sidebar.slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    agent: agentReducer,
    sideBar: sideBarReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});
