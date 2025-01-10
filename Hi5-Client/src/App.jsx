import RoutesConfig from "./Routes";
// import { lazy } from "react";
// import { Route, Navigate, Routes } from "react-router-dom";
// import AuthGuard from "./guards/AuthGuard";
// import GuestGuard from "./guards/GuestGuard";
// import { useSelector } from "react-redux";
// import SavedPostsPage from "./pages/SavedPostsPage";
// import SearchPage from "./pages/SearchPage";
// import RoleGuard from "./guards/RoleGuard";
// import AdminPage from "./pages/AdminPage";
// import ContentManagementPage from "./pages/ContentManagementPage";
// import UserManagementPage from "./pages/UserManagementPage";
// import { HelpOutline } from '@mui/icons-material';
// import Hi5 from './components/logo/Hi5';
// const ProfilePage = lazy(() => import("./pages/ProfilePage"));
// const LoginPage = lazy(() => import("./pages/LoginPage"));
// const SignUpPage = lazy(() => import("./pages/SignUpPage"));
// const HomePage = lazy(() => import("./pages/HomePage"));
// const TokenManager = lazy(() => import("./components/TokenManager"));
// const Sidebar = lazy(() => import("./components/SideBar"));
// const RightPanel = lazy(() => import("./components/RightPanel"));

const App = () => {
  console.log("App Mounted");


  return (
    <>
      <RoutesConfig />
    </>

    // <div className="flex mx-auto max-w-6xl">
    //   {isAuthenticated && <Sidebar authUser={user} />}
    //   <div className="flex-1">
    //     <Routes>
    //       <Route path="/manager" element={<TokenManager />} />
    //       <Route
    //         path="/login"
    //         element={
    //           <GuestGuard>
    //             <LoginPage />
    //           </GuestGuard>
    //         }
    //       />
    //       <Route
    //         path="/signup"
    //         element={
    //           <GuestGuard>
    //             <SignUpPage />
    //           </GuestGuard>
    //         }
    //       />
    //       {/* <Route
    //       path="/"
    //       element={
    //         user?.roles.includes("ROLE_ADMIN") ? (
    //           <Navigate to="/admin" />
    //         ) : (
    //           <Navigate to="/home" />
    //         )
    //       }
    //     /> */}

    //       <Route
    //         path="/"
    //         element={
    //           <AuthGuard>
    //             {user?.roles.includes("ROLE_ADMIN") ? (
    //               <Navigate to="/admin" />
    //             ) : (
    //               <Navigate to="/home" />
    //             )}
    //           </AuthGuard>
    //         }
    //       />

    //       <Route
    //         path="/home"
    //         element={
    //           <AuthGuard>
    //             <RoleGuard requiredRoles={["ROLE_USER"]}>
    //               <HomePage />
    //             </RoleGuard>
    //           </AuthGuard>
    //         }
    //       />
    //       <Route
    //         path="/profile/:id"
    //         element={
    //           <AuthGuard>
    //             <RoleGuard requiredRoles={["ROLE_USER"]}>
    //               <ProfilePage />
    //             </RoleGuard>
    //           </AuthGuard>
    //         }
    //       />
    //       <Route
    //         path="/saved"
    //         element={
    //           <AuthGuard>
    //             <RoleGuard requiredRoles={["ROLE_USER"]}>
    //               <SavedPostsPage />
    //             </RoleGuard>
    //           </AuthGuard>
    //         }
    //       />
    //       <Route
    //         path="/search"
    //         element={
    //           <AuthGuard>
    //             <RoleGuard requiredRoles={["ROLE_USER"]}>
    //               <SearchPage />
    //             </RoleGuard>
    //           </AuthGuard>
    //         }
    //       />
    //       <Route
    //         path="/admin"
    //         element={
    //           <AuthGuard>
    //             <RoleGuard requiredRoles={["ROLE_ADMIN"]}>
    //               <Navigate to="/admin/dashboard" />
    //             </RoleGuard>
    //           </AuthGuard>
    //         }
    //       />
    //       <Route
    //         path="/admin/dashboard"
    //         element={
    //           <AuthGuard>
    //             <RoleGuard requiredRoles={["ROLE_ADMIN"]}>
    //               <AdminPage />
    //             </RoleGuard>
    //           </AuthGuard>
    //         }
    //       />
    //       <Route
    //         path="/admin/content-management"
    //         element={
    //           <AuthGuard>
    //             <RoleGuard requiredRoles={["ROLE_ADMIN"]}>
    //               <ContentManagementPage />
    //             </RoleGuard>
    //           </AuthGuard>
    //         }
    //       />
    //       <Route
    //         path="/admin/user-management"
    //         element={
    //           <AuthGuard>
    //             <RoleGuard requiredRoles={["ROLE_ADMIN"]}>
    //               <UserManagementPage />
    //             </RoleGuard>
    //           </AuthGuard>
    //         }
    //       />
    //       <Route
    //         path="/404"
    //         element={
    //           <div className="flex-[4_4_0] border-gray-700 mr-auto border-r min-h-screen">
    //             <p className="mt-4 text-2xl text-center">404 Not Found</p>
    //           </div>
    //         }
    //       />
    //       <Route
    //         path="*"
    //         element={
    //           <div className="flex-[4_4_0] border-gray-700 mr-auto border-r min-h-screen">
    //             <p className="mt-4 text-2xl text-center">404 Not Found</p>
    //           </div>
    //         }
    //       />
    //     </Routes>
    //   </div>
    //   {isAuthenticated && <RightPanel authUser={user} />}
    // </div>
  );
};

export default App;
