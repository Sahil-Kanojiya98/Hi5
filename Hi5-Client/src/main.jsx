// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Preloader from "./components/common/preloader/Preloader.jsx";
import { Suspense } from "react";
import StoreProvider from "./components/providers/StoreProvider.jsx";
import ThemeProvider from "./components/providers/ThemeProvider.jsx";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./components/providers/AuthProvider.jsx";
import { ToastProvider } from "./components/providers/ToastProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Suspense fallback={<Preloader />}>
    <StoreProvider>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Router>
              <App />
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </StoreProvider>
  </Suspense>
  // </StrictMode>
);

// import { Slide, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// toast provider
{
  /* //         <ToastContainer */
}
{
  /* //           position="bottom-center" */
}
{
  /* //           hideProgressBar */
}
{
  /* //           closeButton={false} */
}
{
  /* //           icon={false} */
}
{
  /* //           transition={Slide} */
}
{
  /* //           autoClose={true} */
}
{
  /* //           newestOnTop={true} */
}
{
  /* //           closeOnClick={false} */
}
{
  /* //           pauseOnHover={false} */
}
{
  /* //           style={{ */
}
{
  /* //             width: "100%", */
}
{
  /* //             display: "flex", */
}
{
  /* //             justifyContent: "center", */
}
{
  /* //             alignItems: "center", */
}
{
  /* //             flexDirection: "column", */
}
{
  /* //             userSelect: "none", */
}
{
  /* //           }} */
}
{
  /* //           draggablePercent={60} */
}
{
  /* //           draggableDirection="x" */
}
{
  /* //           draggable={true} */
}
{
  /* //           limit={3} */
}
{
  /* //         /> */
}
