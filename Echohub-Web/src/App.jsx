import React, { lazy, Suspense } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";

// import TokenManager from "./components/TokenManager";
// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";
// import HomePage from "./pages/HomePage";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const TokenManager = lazy(() => import('./components/TokenManager'));


function App() {

  return (
    <div className='flex max-w-6xl max-w-7xl mx-auto'>
      {/* <Sidebar/> */}
      <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/login"
          element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestGuard>
              <SignUpPage />
            </GuestGuard>
          }
        />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          }
        />
        <Route path="/manager" element={<TokenManager />} />
      </Routes>
      	{/* <RightPanel/> */}
      </div>
  );
}

export default App;
