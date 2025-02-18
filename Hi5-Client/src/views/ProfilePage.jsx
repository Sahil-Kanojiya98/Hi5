// import MainLayout from "../components/layout/MainLayout";
// import {
//   FaArrowLeft,
//   FaLink,
//   FaCalendarAlt,
//   FaEdit,
//   FaCog,
// } from "react-icons/fa";
// import Posts from "../components/post/Posts";
// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { getUserProfile } from "../services/api";

// const ProfilePage = () => {
//   const [profileData, setProfileData] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [coverImage, setCoverImage] = useState("/user/coverImage/default.png");
//   const [profileImage, setProfileImage] = useState(
//     "/user/profileImage/default.png"
//   );

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setCoverImage(URL.createObjectURL(file));
//     }
//   };

//   const handleProfileImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileImage(URL.createObjectURL(file));
//     }
//   };

//   const navigate = useNavigate();
//   const handleBackClick = () => {
//     if (window.history.length > 1) {
//       navigate(-1);
//     } else {
//       navigate("/");
//     }
//   };

//   const { userId } = useParams();
//   console.log(userId);
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const response = await getUserProfile(userId);
//         const data = response.data;
//         setProfileData(data);
//         setCoverImage(data.coverPictureUrl);
//         setProfileImage(data.profilePictureUrl);
//       } catch (err) {
//         console.log(err);
//         setError("Failed to load user profile. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userId]);

//   return (
//     <MainLayout>
//       <div className="flex justify-center bg-gray-100 dark:bg-gray-900 mx-auto p-2 md:p-6 pt-[70px] md:pt-0 md:pl-[70px] lg:pl-[260px] w-full">
//         <div className="flex flex-col justify-center w-full max-w-3xl">
//           {
//             JSON.stringify(profileData)
//           }
//           {error && (
//             <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 shadow-lg mt-[15dvh] p-6 rounded-lg w-full min-h-[200px]">
//               <h1 className="mb-4 font-bold text-lg text-red-600">
//                 Profile Not Found
//               </h1>
//               <p className="text-center text-gray-600 text-sm dark:text-gray-300">
//                 An error occurred while loading the profile, or the profile
//                 doesn&apos;t exist. Please try again later or contact support.
//               </p>
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 shadow-md mt-4 px-6 py-2 rounded-lg text-white transition duration-200"
//                 onClick={() => window.location.reload()}
//               >
//                 Reload Page
//               </button>
//             </div>
//           )}
//           {profileData && (
//             <div className="flex flex-col bg-white dark:bg-black shadow-md mt-5 rounded-lg min-h-screen">
//               <div className="flex justify-between items-center gap-4 p-4">
//                 <div className="flex items-center gap-4">
//                   <div
//                     onClick={handleBackClick}
//                     className="text-gray-500 cursor-pointer"
//                   >
//                     <FaArrowLeft className="text-2xl" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="font-bold text-xl">{profileData.fullname}</p>
//                     <span className="text-gray-600 text-sm">{profileData.postsCount} posts</span>
//                   </div>
//                 </div>
//                 {/* only if my profile */}
//                 {/* <Link
//                   to="/settings"
//                   className="text-gray-500 dark:hover:text-gray-400 hover:text-gray-600 transition duration-200 cursor-pointer"
//                   title="Settings"
//                 >
//                   <FaCog className="text-2xl" />
//                 </Link> */}
//               </div>

//               <div className="relative">
//                 <div className="group relative">
//                   <img
//                     src={coverImage}
//                     alt="Cover Image"
//                     className="w-full h-52 md:h-64 lg:h-72 object-cover"
//                   />
//                   <label
//                     htmlFor="cover-upload"
//                     className="group-hover:block right-3 bottom-3 absolute hidden bg-black/50 p-2 rounded-full text-white cursor-pointer"
//                     title="Change Cover"
//                   >
//                     <FaEdit />
//                   </label>
//                   <input
//                     id="cover-upload"
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleCoverImageChange}
//                   />
//                 </div>
//                 <div className="top-40 md:top-44 lg:top-48 left-5 md:left-10 lg:left-16 absolute">
//                   <div className="group relative border-4 border-white rounded-full w-24 md:w-32 lg:w-40 h-24 md:h-32 lg:h-40 overflow-hidden">
//                     <img
//                       src={profileImage}
//                       alt="Profile Image"
//                       className="w-full h-full object-cover"
//                     />
//                     <label
//                       htmlFor="profile-upload"
//                       className="group-hover:block right-3 bottom-3 absolute hidden bg-black/50 p-2 rounded-full text-white cursor-pointer"
//                       title="Change Profile Picture"
//                     >
//                       <FaEdit />
//                     </label>
//                     <input
//                       id="profile-upload"
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleProfileImageChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end mt-10 px-4">
//                 <button className="bg-blue-500 hover:bg-blue-600 shadow-md px-4 py-2 rounded-full text-sm text-white transition duration-200">
//                   Follow
//                 </button>
//                 <button className="bg-gray-800 hover:bg-gray-900 shadow-md ml-3 px-4 py-2 rounded-full text-sm text-white transition duration-200">
//                   Update
//                 </button>
//               </div>

//               <div className="my-6 mt-8 px-4">
//                 <div className="flex flex-col items-start gap-2">
//                   <h1 className="font-bold text-2xl">{profileData.fullname}</h1>
//                   <span className="text-gray-500 text-sm">@{profileData.username}</span>
//                   <p className="text-gray-700 text-sm dark:text-gray-300">
//                   {profileData.bio}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-4 mt-4">
//                   <div className="flex items-center gap-2">
//                     <FaLink className="text-gray-500" />
//                     <a
//                       href="https://www.johndoe.com"
//                       target="_blank"
//                       className="text-blue-500 text-sm hover:underline"
//                       rel="noreferrer"
//                     >
//                       {profileData.fullnamelink}
//                     </a>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <FaCalendarAlt className="text-gray-500" />
//                     <span className="text-gray-500 text-sm">
//                     {profileData.createdAt}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-4 mt-4">
//                   <div className="flex items-center gap-1">
//                     <span className="font-bold text-sm">120</span>
//                     <span className="text-gray-500 text-sm">Following</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <span className="font-bold text-sm">150</span>
//                     <span className="text-gray-500 text-sm">Followers</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col items-center">
//                 <div className="flex gap-3 mt-6">
//                   <div className="relative flex-1 py-3 font-semibold text-blue-500 text-center cursor-pointer">
//                     Posts
//                     <div className="bottom-0 left-0 absolute bg-blue-500 w-full h-1"></div>
//                   </div>
//                   <div className="relative flex-1 py-3 font-semibold text-blue-500 text-center cursor-pointer">
//                     Reels
//                     <div className="bottom-0 left-0 absolute bg-blue-500 w-full h-1"></div>
//                   </div>
//                 </div>

//                 <div className="mt-8 px-4 pb-8 w-full max-w-xl">
//                   <Posts feedType="saved" />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default ProfilePage;
