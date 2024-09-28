// import { StrictMode } from 'react'
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Preloader from "./components/Preloader.jsx";
import App from "./App.jsx";
import StoreProvider from "./providers/StoreProvider";
import AuthProvider from "./providers/AuthProvider.jsx";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Suspense fallback={<Preloader />}>
    <StoreProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer
            position="bottom-center"
            hideProgressBar
            closeButton={false}
            icon={false}
            transition={Slide}
            autoClose={true}
            newestOnTop={true}
            closeOnClick={false}
            pauseOnHover={false}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              userSelect: "none",
            }}
            draggablePercent={60}
            draggableDirection="x"
            draggable={true}
            limit={3}
          />
          <App />
        </BrowserRouter>
      </AuthProvider>
    </StoreProvider>
  </Suspense>
  // </StrictMode>
);
