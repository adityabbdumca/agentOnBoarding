import { RouterProvider } from "react-router-dom";

import { startTransition, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { setColor, setTheme } from "./GlobalSlice/theme.slice";
import router from "./routes/router";
import { useGetTheme } from "./service";
import PrudentialLoader from "./Components/Loader/PrudentialLoader";

function App() {
  const dispatch = useDispatch();
  const { theme: userTheme } = useSelector((state) => state.theme);
  const { data, isPending } = useGetTheme();

  useEffect(() => {
    if (data?.data?.status === 200) {
      const lightColor =
        (data?.data?.return_data[0]?.primaryColor?.slice(0, 7) || "##ff0000") +
        "1a";
      dispatch(setTheme(data?.data?.return_data[0]));
      dispatch(setColor({ lightColor }));
      startTransition(() => {
        document.documentElement.style.setProperty(
          "--color-primary",
          data?.data?.return_data[0]?.primaryColor || "#ff0000"
        );
        document.documentElement.style.setProperty(
          "--color-secondary",
          data?.data?.return_data[0]?.secondaryColor || "#dd9292"
        );
        document.documentElement.style.setProperty(
          "--color-tertiary",
          data?.data?.return_data[0]?.tertiaryColor || "#ffffff"
        );
        document.documentElement.style.setProperty("--light-color", lightColor);
      });
    }
  }, [data]);

  if (isPending) {
    return <PrudentialLoader />;
  }

  return (
    <ThemeProvider
      theme={{
        // ...theme,
        ...userTheme,
      }}
    >
      <div className="selection:bg-primary/20 selection:text-black selection: font-medium">
        <RouterProvider router={router} />
      </div>
      <ToastContainer
        draggable
        position="top-center"
        autoClose={3000}
        toastClassName={"toast"}
        limit={2}
        style={{
          fontFamily: "Manrope !important",
          fontSize: "12px",
          fontWeight: "500",
        }}
      />
    </ThemeProvider>
  );
}

export default App;
