import { Routes, Route, Navigate } from "react-router-dom";
import GuestGuard from "./guards/GuestGuard";
import TokenManager from "./components/test/TokenManager";
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";
import LoginPage from "./views/LoginPage";
import SignUpPage from "./views/SignUpPage";
import { useSelector } from "react-redux";
import SignUpOAuth2Handler from "./components/auth/SignUpOAuth2Handler";
import LoginOAuth2Handler from "./components/auth/LoginOAuth2Handler";
import ForgotPasswordPage from "./views/ForgotPasswordPage";
import OAuth2Error from "./components/auth/OAuth2Error";
import NotFound from "./components/temp/NotFound";
import HomePage from "./views/HomePage";
import ReelsPage from "./views/ReelsPage";
import SearchPage from "./views/SearchPage";
import ChatPage from "./views/ChatPage";
import NotificationsPage from "./views/NotificationsPage";
import ProfilePage from "./views/ProfilePage";
// import SettingsPage from "./views/SettingsPage";
// import SharedMediaPage from "./views/SharedMediaPage";
// import SavedPostsPage from "./pages/SavedPostsPage";
// import SearchPage from "./pages/SearchPage";
// import AdminPage from "./pages/AdminPage";
// import ContentManagementPage from "./pages/ContentManagementPage";
// import UserManagementPage from "./pages/UserManagementPage";

const RoutesConfig = () => {
  const user = useSelector((state) => state.user.profile);

  return (
    <Routes>
      <Route path="/token-manage" element={<TokenManager />} />

      <Route
        path="/"
        element={
          <AuthGuard>
            {user?.role === "ADMIN" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/home" />
            )}
          </AuthGuard>
        }
      />

      <Route
        path="/login"
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />

      <Route
        path="/login/oauth2"
        element={
          <GuestGuard>
            <LoginOAuth2Handler />
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
        path="/signup/oauth2"
        element={
          <GuestGuard>
            <SignUpOAuth2Handler />
          </GuestGuard>
        }
      />

      <Route
        path="/error/oauth2"
        element={
          <GuestGuard>
            <OAuth2Error />
          </GuestGuard>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <GuestGuard>
            <ForgotPasswordPage />
          </GuestGuard>
        }
      />

      <Route
        path="/home"
        element={
          <AuthGuard>
            <RoleGuard requiredRole={"USER"}>
              <HomePage />
            </RoleGuard>
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
        path="/chat"
        element={
          <AuthGuard>
            <ChatPage />
          </AuthGuard>
        }
      />

      <Route
        path="/chat/:userId"
        element={
          <AuthGuard>
            <ChatPage />
          </AuthGuard>
        }
      />

      <Route
        path="/reels"
        element={
          <AuthGuard>
            <ReelsPage />
          </AuthGuard>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        }
      />

      <Route
        path="/notifications"
        element={
          // <></>
          <AuthGuard>
            <NotificationsPage />
          </AuthGuard>
        }
      />

      <Route
        path="/settings"
        element={
          <></>
          // <AuthGuard>
          //   <SettingsPage />
          // </AuthGuard>
        }
      />

      {/* <Route path="/share" element={<SharedMediaPage />} /> */}

      <Route
        path="/admin"
        element={
          <AuthGuard>
            <RoleGuard requiredRole={"ADMIN"}>home</RoleGuard>
          </AuthGuard>
        }
      />

      <Route path="*" element={<NotFound />} />

      {/* <Route element={<AuthGuard />}>
        <Route element={<RoleGuard requiredRoles={["ROLE_USER"]} />}>
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/saved" element={<SavedPostsPage />} />
        </Route>
      </Route> */}

      {/* <Route
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
      /> */}
    </Routes>
  );
};

export default RoutesConfig;
