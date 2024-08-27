import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Preloader from "./components/Preloader.jsx";
import App from "./App.jsx";
import StoreProvider from "./providers/StoreProvider";
import AuthProvider from "./providers/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Suspense fallback={<Preloader />}>
    <StoreProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </StoreProvider>
  </Suspense>
  // </StrictMode>
);
