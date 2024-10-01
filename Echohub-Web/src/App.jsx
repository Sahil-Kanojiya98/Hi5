import { lazy } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";
import { useSelector } from "react-redux";
import SavedPostsPage from "./pages/SavedPostsPage";
import SearchPage from "./pages/SearchPage";
import RoleGuard from "./guards/RoleGuard";
import AdminPage from "./pages/AdminPage";
import ContentManagementPage from "./pages/ContentManagementPage";
import UserManagementPage from "./pages/UserManagementPage";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const TokenManager = lazy(() => import("./components/TokenManager"));
const Sidebar = lazy(() => import("./components/SideBar"));
const RightPanel = lazy(() => import("./components/RightPanel"));

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  console.log("isAuthenticated: " + isAuthenticated);
  console.log("IS_ADMIN:" + user?.roles.includes("ROLE_ADMIN"));
  console.log("ROLES OF USER:" + JSON.stringify(user?.roles));

  return (
    <div className="flex max-w-6xl mx-auto">
      {isAuthenticated && <Sidebar authUser={user} />}
      <div className="flex-1">
        <Routes>
          <Route path="/manager" element={<TokenManager />} />
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
          {/* <Route
          path="/"
          element={
            user?.roles.includes("ROLE_ADMIN") ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/home" />
            )
          }
        /> */}

          <Route
            path="/"
            element={
              <AuthGuard>
                {user?.roles.includes("ROLE_ADMIN") ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/home" />
                )}
              </AuthGuard>
            }
          />

          <Route
            path="/home"
            element={
              <AuthGuard>
                <RoleGuard requiredRoles={["ROLE_USER"]}>
                  <HomePage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <AuthGuard>
                <RoleGuard requiredRoles={["ROLE_USER"]}>
                  <ProfilePage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/saved"
            element={
              <AuthGuard>
                <RoleGuard requiredRoles={["ROLE_USER"]}>
                  <SavedPostsPage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/search"
            element={
              <AuthGuard>
                <RoleGuard requiredRoles={["ROLE_USER"]}>
                  <SearchPage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <RoleGuard requiredRoles={["ROLE_ADMIN"]}>
                  <Navigate to="/admin/dashboard" />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AuthGuard>
                <RoleGuard requiredRoles={["ROLE_ADMIN"]}>
                  <AdminPage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/admin/content-management"
            element={
              <AuthGuard>
                <RoleGuard requiredRoles={["ROLE_ADMIN"]}>
                  <ContentManagementPage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/admin/user-management"
            element={
              <AuthGuard>
                <RoleGuard requiredRoles={["ROLE_ADMIN"]}>
                  <UserManagementPage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/404"
            element={
              <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
                <p className="text-center text-2xl mt-4">404 Not Found</p>
              </div>
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
      </div>
      {isAuthenticated && <RightPanel authUser={user} />}
    </div>
  );
}

export default App;
