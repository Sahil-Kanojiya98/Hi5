import { lazy } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import { useSelector } from "react-redux";
import SavedPostsPage from "./pages/SavedPostsPage";
import SearchPage from "./pages/SearchPage";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const TokenManager = lazy(() => import("./components/TokenManager"));
const Sidebar = lazy(() => import("./components/SideBar"));
const RightPanel = lazy(() => import("./components/RightPanel"));

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log("isAuthenticated: " + isAuthenticated);

  return (
    <div className="flex max-w-6xl mx-auto">
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route path="/manager" element={<TokenManager />} />
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
        <Route
          path="/profile/:id"
          element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="/saved"
          element={
            <AuthGuard>
              <SavedPostsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/search"
          element={
            <AuthGuard>
              <SearchPage />
            </AuthGuard>
          }
        />
        <Route
          path="*"
          element={
            <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
              <p className="text-center text-2xl mt-4">404 Not Found</p>
            </div>
          }
        />
      </Routes>
      {isAuthenticated && <RightPanel />}
    </div>
  );
}

export default App;
