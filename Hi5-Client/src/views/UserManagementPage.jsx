// import { useState, useEffect } from "react";
// import { FaSearch } from "react-icons/fa";
// import axiosInstance from "../utils/axiosConfig";
// import UserSkeleton from "../components/skeletons/UserSkeleton";
// import InfiniteScroll from "react-infinite-scroll-component";

// function UserManagementPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchUsers = async (term, pageNumber) => {
//     try {
//       setIsLoading(true);
//       const response = await axiosInstance.get("/user/search", {
//         params: { pattern: term, page: pageNumber },
//       });
//       console.log(response);
//       setUsers((prevUsers) => [...prevUsers, ...response.data.content]);
//       const totalPages = response.data.totalPages;
//       if (pageNumber >= totalPages - 1) {
//         setHasMore(false);
//       }
//     } catch (e) {
//       console.error(e);
//       setError("Failed to load users. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteUser = async (userId) => {
//     try {
//       await axiosInstance.delete(`/admin/user/${userId}`);
//       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
//       setError(null);
//     } catch (e) {
//       console.error(e);
//       setError("Failed to delete user. Please try again.");
//     }
//   };

//   useEffect(() => {
//     if (searchTerm !== "") {
//       setPage(0);
//       setHasMore(true);
//       setError(null);
//       setUsers([]);
//       fetchUsers(searchTerm, 0);
//     } else {
//       setUsers([]);
//       setPage(0);
//       setHasMore(true);
//       setError(null);
//     }
//   }, [searchTerm]);

//   useEffect(() => {
//     if (page > 0 && searchTerm) {
//       fetchUsers(searchTerm, page);
//     }
//   }, [page, searchTerm]);

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//   };

//   const loadMoreUsers = () => {
//     if (!isLoading && hasMore) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   return (
//     <div className="flex-[4_4_0] border-[#374151] bg-black mr-auto border-r min-h-[calc(100vh+1px)]">
//       <div className="top-0 z-10 sticky border-[#212121] bg-black p-4 border-b">
//         <div className="flex justify-between items-center">
//           <p className="font-semibold text-white text-xl">Search Users</p>
//           <div className="flex items-center bg-black p-2 border rounded-md">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={handleInputChange}
//               placeholder="Search users..."
//               className="bg-transparent px-2 py-1 w-full text-white outline-none placeholder-white"
//             />
//             <button className="ml-2 text-white hover:text-gray-300">
//               <FaSearch className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="p-4">
//         {!isLoading && error && (
//           <p className="my-4 text-center text-red-500">{error}</p>
//         )}
//         {!isLoading && users.length === 0 && searchTerm != "" && (
//           <p className="text-center text-white">
//             No users found for {searchTerm}.
//           </p>
//         )}

//         {users.length > 0 && (
//           <InfiniteScroll
//             dataLength={users.length}
//             next={loadMoreUsers}
//             hasMore={hasMore}
//             loader={
//               <div className="flex flex-col gap-4">
//                 {[...Array(3)].map((_, i) => (
//                   <UserSkeleton key={i} />
//                 ))}
//               </div>
//             }
//             endMessage={<p className="text-center text-white">No more users</p>}
//           >
//             <div className="flex flex-col gap-4">
//               {users.map((user) => (
//                 <div
//                   key={user?.id}
//                   className="flex justify-between items-center gap-4 bg-black hover:bg-[#212121] p-4 rounded-md transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="rounded-full w-10 h-10 overflow-hidden avatar">
//                       <img
//                         src={
//                           user?.profilePictureUrl
//                             ? `http://localhost:8080${user?.profilePictureUrl}`
//                             : "/avatar.png"
//                         }
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-white">
//                         {user?.fullname}
//                       </p>
//                       <p className="text-sm text-white">@{user?.username}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => deleteUser(user.id)}
//                     className="bg-red-700 hover:bg-red-500 px-3 py-2 rounded-md hover:text-gray-300"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </InfiniteScroll>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UserManagementPage;