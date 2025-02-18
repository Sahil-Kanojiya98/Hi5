// import { useState } from "react";
// import MainLayout from "../components/layout/MainLayout";
// import { FaArrowLeft, FaMoon, FaSignOutAlt, FaSun } from "react-icons/fa";
// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
// import useLogout from "../hooks/useLogout";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleTheme } from "../redux/slices/themeSlice";

// const SettingsPage = () => {
//   const [email, setEmail] = useState("johndoe@example.com");
//   const [username, setUsername] = useState("JohnDoe");
//   const [notificationsReels, setNotificationsReels] = useState(true);
//   const [notificationsPosts, setNotificationsPosts] = useState(true);
//   const [followSetting, setFollowSetting] = useState("ask");
//   const [twoFactorAuth, setTwoFactorAuth] = useState(false);
//   const theme = useSelector((state) => state.theme.theme);

//   // Modals visibility state
//   const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
//   const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
//   const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
//   const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
//     useState(false);
//   const [isTwoFactorAuthModalOpen, setIsTwoFactorAuthModalOpen] =
//     useState(false);
//   const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
//     useState(false);

//   const handleDeleteAccount = () => {
//     alert("Account deleted!");
//   };

//   const dispatch = useDispatch();

//   const changeThemeClickHandler = () => {
//     dispatch(toggleTheme());
//   };

//   const navigate = useNavigate();

//   const handleBackClick = () => {
//     if (window.history.length > 1) {
//       navigate(-1);
//     } else {
//       navigate("/");
//     }
//   };

//   const logout = useLogout();

//   return (
//     <MainLayout>
//       <div className="flex justify-center mx-auto pt-[60px] sm:pt-[80px] md:pt-[0px] md:pl-[70px] lg:pl-[260px] w-full h-screen">
//         <div className="flex justify-center bg-gray-100 dark:bg-gray-900 mx-auto p-3 sm:p-6 w-full">
//           <div className="flex flex-col bg-white dark:bg-black shadow-lg mb-10 p-6 rounded-lg w-full max-w-2xl">
//             {/* Header */}
//             <div className="flex items-center gap-4 mb-6">
//               <div
//                 onClick={handleBackClick}
//                 className="text-gray-500 dark:text-gray-400 cursor-pointer"
//               >
//                 <FaArrowLeft className="text-2xl" />
//               </div>
//               <h1 className="font-semibold text-2xl text-gray-800 dark:text-gray-200">
//                 Settings
//               </h1>
//             </div>

//             {/* Content */}
//             <div className="space-y-8 h-screen overflow-y-auto hide-scrollbar">
//               <section>
//                 <h2 className="mb-4 font-bold text-gray-800 text-xl dark:text-gray-200">
//                   Theme Settings
//                 </h2>
//                 <div
//                   onClick={changeThemeClickHandler}
//                   className="flex items-center space-x-4 text-xl cursor-pointer"
//                 >
//                   {/* Sun Icon */}
//                   <div className="text-gray-800">
//                     <FaSun
//                       className={`transition-all duration-300 ${
//                         theme === "dark" ? "opacity-0" : "opacity-100"
//                       }`}
//                     />
//                   </div>

//                   <div className="relative bg-gray-300 dark:bg-gray-700 rounded-full w-12 h-6">
//                     <div
//                       className={`w-6 h-6 bg-blue-400 dark:bg-blue-600 rounded-full absolute transition-all duration-300 transform ${
//                         theme === "dark" ? "translate-x-6" : "translate-x-0"
//                       }`}
//                     />
//                   </div>

//                   <div className="dark:text-gray-200">
//                     <FaMoon
//                       className={`transition-all duration-300 ${
//                         theme === "light" ? "opacity-0" : "opacity-100"
//                       }`}
//                     />
//                   </div>
//                 </div>
//               </section>

//               {/* Account Settings */}
//               <section>
//                 <h2 className="mb-4 font-bold text-gray-800 text-xl dark:text-gray-200">
//                   Account Settings
//                 </h2>
//                 <p className="text-gray-600 text-sm dark:text-gray-400">
//                   Update your username to personalize your account.
//                 </p>
//                 <div className="flex sm:flex-row flex-col justify-between sm:items-center mt-4">
//                   <span className="text-gray-600 dark:text-gray-400">
//                     Username: {username}
//                   </span>
//                   <button
//                     onClick={() => setIsUsernameModalOpen(true)}
//                     className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-900 dark:bg-blue-800 mt-1 sm:mt-0 ml-4 px-4 py-2 rounded-md text-white"
//                   >
//                     Change Username
//                   </button>
//                 </div>
//               </section>

//               <section>
//                 <p className="text-gray-600 text-sm dark:text-gray-400">
//                   Logout your account.
//                 </p>
//                 <button
//                   onClick={logout}
//                   className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:hover:bg-red-900 dark:bg-red-800 mt-2 px-4 py-2 rounded-md text-white"
//                 >
//                   <FaSignOutAlt className="text-xl" />
//                   Logout
//                 </button>
//               </section>

//               {/* Privacy Settings */}
//               <section>
//                 <h2 className="mb-4 font-bold text-gray-800 text-xl dark:text-gray-200">
//                   Privacy Settings
//                 </h2>
//                 <p className="mb-3 text-gray-600 text-sm dark:text-gray-400">
//                   Manage follow request behavior: ask each time or auto follow
//                   approve.
//                 </p>
//                 <button
//                   onClick={() => setIsFollowModalOpen(true)}
//                   className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-900 dark:bg-blue-800 px-4 py-2 rounded-md text-white"
//                 >
//                   Follow Request Behavior
//                 </button>
//               </section>

//               {/* Notification Settings */}
//               <section>
//                 <h2 className="mb-4 font-bold text-gray-800 text-xl dark:text-gray-200">
//                   Notification Settings
//                 </h2>
//                 <p className="mb-3 text-gray-600 text-sm dark:text-gray-400">
//                   Customize your notifications for posts and reels.
//                 </p>
//                 <button
//                   onClick={() => setIsNotificationsModalOpen(true)}
//                   className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-900 dark:bg-blue-800 px-4 py-2 rounded-md text-white"
//                 >
//                   Notifications for Reels & Posts
//                 </button>
//               </section>

//              {/* Security Settings */}
// <section>
//   <h2 className="mb-4 font-bold text-gray-800 text-xl dark:text-gray-200">
//     Security Settings
//   </h2>
//   <p className="mb-3 text-gray-600 text-sm dark:text-gray-400">
//     Enable two-factor authentication to secure your account.
//   </p>
//   <button
//     onClick={() => setIsTwoFactorAuthModalOpen(true)}
//     className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white dark:text-gray-200"
//   >
//     Enable Two-Factor Authentication
//   </button>
// </section>

// {/* Danger Zone */}
// <section>
//   <h2 className="mb-4 font-bold text-red-500 text-xl dark:text-red-400">
//     Danger Zone
//   </h2>
//   <p className="mb-3 text-gray-600 text-sm dark:text-gray-400">
//     This is where you can permanently delete your account.
//   </p>
//   <button
//     onClick={() => setIsDeleteAccountModalOpen(true)}
//     className="bg-red-600 hover:bg-red-700 shadow-2xl p-2 rounded-md text-white dark:text-gray-200 transition duration-200"
//   >
//     Delete Account
//   </button>
// </section>

//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modals for settings */}
//       <Modal
//         isOpen={isEmailModalOpen}
//         onClose={() => setIsEmailModalOpen(false)}
//         title="Change Email"
//         content={
//           <div className="mb-4">
//             <InputField
//               label="New Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//         }
//         onSave={() => setIsEmailModalOpen(false)}
//       />
//       <Modal
//         isOpen={isUsernameModalOpen}
//         onClose={() => setIsUsernameModalOpen(false)}
//         title="Change Username"
//         content={
//           <div className="mb-4">
//             <InputField
//               label="New Username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
//         }
//         onSave={() => setIsUsernameModalOpen(false)}
//       />
//       <Modal
//         isOpen={isFollowModalOpen}
//         onClose={() => setIsFollowModalOpen(false)}
//         title="Follow Request Behavior"
//         content={
//           <SelectField
//             label="Behavior"
//             value={followSetting}
//             onChange={(e) => setFollowSetting(e.target.value)}
//             options={["auto", "ask"]}
//           />
//         }
//         onSave={() => setIsFollowModalOpen(false)}
//       />
//       <Modal
//         isOpen={isNotificationsModalOpen}
//         onClose={() => setIsNotificationsModalOpen(false)}
//         title="Notification Settings"
//         content={
//           <div>
//             <CheckboxField
//               label="Reels Notifications"
//               checked={notificationsReels}
//               onChange={(e) => setNotificationsReels(e.target.checked)}
//             />
//             <CheckboxField
//               label="Posts Notifications"
//               checked={notificationsPosts}
//               onChange={(e) => setNotificationsPosts(e.target.checked)}
//             />
//           </div>
//         }
//         onSave={() => setIsNotificationsModalOpen(false)}
//       />
//       <Modal
//         isOpen={isTwoFactorAuthModalOpen}
//         onClose={() => setIsTwoFactorAuthModalOpen(false)}
//         title="Two-Factor Authentication"
//         content={
//           <CheckboxField
//             label="Enable Two-Factor Authentication"
//             checked={twoFactorAuth}
//             onChange={(e) => setTwoFactorAuth(e.target.checked)}
//           />
//         }
//         onSave={() => setIsTwoFactorAuthModalOpen(false)}
//       />
//       <Modal
//         isOpen={isDeleteAccountModalOpen}
//         onClose={() => setIsDeleteAccountModalOpen(false)}
//         title="Delete Account"
//         content={
//           <div className="text-red-600">
//             <p>
//               Are you sure you want to delete your account? This action cannot
//               be undone.
//             </p>
//           </div>
//         }
//         onSave={handleDeleteAccount}
//       />
//     </MainLayout>
//   );
// };

// const InputField = ({ label, type, value, onChange }) => (
//   <div className="mb-4">
//     <label
//       htmlFor={label}
//       className="block mb-2 font-medium text-gray-700 text-sm"
//     >
//       {label}
//     </label>
//     <input
//       type={type}
//       id={label}
//       value={value}
//       onChange={onChange}
//       className="border-gray-300 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
//     />
//   </div>
// );

// InputField.propTypes = {
//   label: PropTypes.string.isRequired,
//   type: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

// const SelectField = ({ label, value, onChange, options }) => (
//   <div className="mb-4">
//     <label
//       htmlFor={label}
//       className="block mb-2 font-medium text-gray-700 text-sm"
//     >
//       {label}
//     </label>
//     <select
//       id={label}
//       value={value}
//       onChange={onChange}
//       className="border-gray-300 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
//     >
//       {options.map((option, index) => (
//         <option key={index} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// SelectField.propTypes = {
//   label: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
//   options: PropTypes.arrayOf(PropTypes.string).isRequired,
// };

// const CheckboxField = ({ label, checked, onChange }) => (
//   <div className="mb-4">
//     <input
//       type="checkbox"
//       id={label}
//       checked={checked}
//       onChange={onChange}
//       className="mr-2"
//     />
//     <label htmlFor={label} className="text-gray-700">
//       {label}
//     </label>
//   </div>
// );

// CheckboxField.propTypes = {
//   label: PropTypes.string.isRequired,
//   checked: PropTypes.bool.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

// const Modal = ({ isOpen, onClose, title, content, onSave }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-sm">
//         <h3 className="mb-4 font-semibold text-lg">{title}</h3>
//         {content}
//         <div className="flex justify-end mt-4">
//           <button onClick={onClose} className="mr-2 text-gray-600">
//             Cancel
//           </button>
//           <button
//             onClick={onSave}
//             className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// Modal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   title: PropTypes.string.isRequired,
//   content: PropTypes.node.isRequired,
//   onSave: PropTypes.func.isRequired,
// };

// export default SettingsPage;
