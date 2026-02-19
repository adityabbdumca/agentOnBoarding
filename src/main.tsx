import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./app/store.js";
import "./index.css";
import "react-datetime/css/react-datetime.css";
import { queryClientGlobal } from "./lib/tanstack-query/query.config.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClientGlobal}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
