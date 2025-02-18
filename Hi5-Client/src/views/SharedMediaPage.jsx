// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { getSharedPost } from "../services/api";
// import {
//   FaBookmark,
//   FaComment,
//   FaExclamationTriangle,
//   FaHeart,
//   FaMoon,
//   FaShare,
//   FaSun,
// } from "react-icons/fa";
// import TimeAgo from "../components/temp/TimeAgo";
// import logo from "../assets/images/logo/hi5.svg";
// import PostSkeleton from "../components/skeletons/PostSkeleton";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleTheme } from "../redux/slices/themeSlice";

// const SharedMediaPage = () => {
//   const [post, setPost] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const location = useLocation();
//   const postId = new URLSearchParams(location.search).get("postid");

//   const dispatch = useDispatch();

//   const theme = useSelector((state) => state.theme.theme);

//   // Fetch post data
//   useEffect(() => {
//     const fetchPost = async () => {
//       if (!postId) {
//         setError("Invalid post ID provided.");
//         setIsLoading(false);
//         return;
//       }
//       try {
//         setIsLoading(true);
//         const response = await getSharedPost(postId);
//         setPost(response.data);
//       } catch (err) {
//         console.log(err);
//         setError("Failed to load post. Please try again later.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPost();
//   }, [postId]);

//   const shareClickHandler = () => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: "Check out this post!",
//           text: "This is an interesting post I found.",
//           url: "http://localhost:3000/share?postid=" + post.id,
//         })
//         .then(() => console.log("Share successful"))
//         .catch((error) => console.error("Share failed:", error));
//     } else {
//       console.log("Web Share API not supported in this browser.");
//     }
//   };

//   const changeThemeClickHandler = () => {
//     dispatch(toggleTheme());
//   };

//   return (
//     <>
//       {/* Header */}
//       <header className="bg-white dark:bg-black shadow-md p-4">
//         <div className="flex justify-between items-center mx-auto container">
//           {/* Logo */}
//           <Link to="/" className="flex justify-center items-center gap-3">
//             <img src={logo} alt="Hi5 Logo" className="w-10" />
//             <p className="sm:block lg:block hidden md:hidden font-lobster text-4xl">
//               Hi5
//             </p>
//           </Link>

//           {/* Header Controls */}
//           <div className="flex items-center gap-2 sm:gap-6">
//             {/* Login Button */}
//             <div className="flex justify-center items-center gap-2 sm:gap-3">
//               <Link to="/login">
//                 <button className="bg-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 dark:bg-gray-800 shadow-md px-2 sm:px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition">
//                   Login
//                 </button>
//               </Link>

//               <Link to="/signup">
//                 <button className="bg-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 dark:bg-gray-800 shadow-md px-2 sm:px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition">
//                   SignUp
//                 </button>
//               </Link>
//             </div>

//             {/* Dark Mode Toggle */}
//             <button
//               onClick={changeThemeClickHandler}
//               className="flex justify-center items-center bg-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 dark:bg-gray-800 shadow-md rounded-full w-10 h-10 text-gray-600 dark:text-gray-300 transition"
//             >
//               {theme === "dark" ? (
//                 <FaSun className="w-5 h-5 text-yellow-500" />
//               ) : (
//                 <FaMoon className="w-5 h-5 text-gray-500" />
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Post Content */}
//       <div className="flex justify-center items-center w-screen h-full min-h-[calc(100dvh-75px)]">
//         {isLoading ? (
//           <PostSkeleton />
//         ) : error ? (
//           <div className="shadow-xl px-5 py-2 rounded-lg text-center text-red-600">
//             {error}
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-black shadow-md p-6 rounded-lg w-full max-w-lg">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center space-x-3">
//                 <img
//                   src={post.profilePictureUrl}
//                   alt={`${post.fullname}'s profile`}
//                   className="rounded-full w-12 h-12 object-cover"
//                 />
//                 <div>
//                   <p className="font-semibold text-md sm:text-lg">
//                     {post.fullname}
//                   </p>
//                   <p className="flex items-center text-gray-500 text-sm">
//                     <span>@{post.username}</span>
//                     <span className="mx-1">•</span>
//                     <TimeAgo date={post.createdAt} />
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <button className="text-gray-600 hover:text-red-500 transition">
//                   <FaExclamationTriangle />
//                 </button>
//                 <button className="text-gray-600 hover:text-blue-500 transition">
//                   <FaBookmark />
//                 </button>
//               </div>
//             </div>

//             <div className="my-6">
//               <p className="text-gray-800 text-sm sm:text-base dark:text-gray-200 leading-relaxed">
//                 {post.content}
//               </p>
//             </div>

//             {post.imageUrl && (
//               <div className="mb-4">
//                 <img
//                   src={post.imageUrl}
//                   alt="Post content"
//                   className="rounded-md w-full object-cover"
//                 />
//               </div>
//             )}
//             {post.videoUrl && (
//               <div className="mb-4">
//                 <video
//                   src={post.videoUrl}
//                   controls
//                   className="rounded-md w-full object-contain"
//                 />
//               </div>
//             )}

//             <div className="flex justify-between items-center text-gray-500">
//               <div className="flex items-center space-x-4">
//                 <button className="flex items-center space-x-2 hover:text-red-400 transition">
//                   <FaHeart className="w-5 h-5" />
//                   <span className="font-medium text-sm">{post.likesCount}</span>
//                 </button>
//                 <button className="flex items-center space-x-2 hover:text-blue-400 transition">
//                   <FaComment className="w-5 h-5" />
//                   <span className="font-medium text-sm">
//                     {post.commentsCount}
//                   </span>
//                 </button>
//                 <button
//                   className="flex items-center space-x-2 hover:text-green-400 transition"
//                   onClick={shareClickHandler}
//                 >
//                   <FaShare className="w-5 h-5" />
//                   <span className="font-medium text-sm">Share</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default SharedMediaPage;
