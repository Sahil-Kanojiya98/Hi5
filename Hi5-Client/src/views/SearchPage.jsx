// import { FaSearch, FaEye, FaUserPlus, FaEnvelope } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import MainLayout from "../components/layout/MainLayout";

// function SearchPage() {
  

//   return (
//     <MainLayout>
//       <div className="flex justify-center mx-auto pt-[70px] md:pt-0 md:pl-[70px] lg:pl-[260px] w-full">
//         <div className="flex flex-col justify-center w-full max-w-3xl">
//           {/* Header Section */}
//           <div className="top-0 sticky border-gray-500 p-2 md:p-6 border-b">
//             <div className="flex justify-between items-center">
//               <h1 className="md:block hidden font-semibold text-xl lg:text-2xl">Search Users</h1>
//               <div className="flex justify-between items-center border-gray-700 border rounded-md w-full sm:w-auto overflow-hidden">
//                 <input
//                   type="text"
//                   placeholder="Search users..."
//                   className="bg-white dark:bg-black px-3 sm:px-4 py-2 w-full sm:w-64 focus:outline-none"
//                   aria-label="Search users"
//                 />
//                 <button className="p-3" aria-label="Search">
//                   <FaSearch className="w-5 h-5 text-gray-300" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col space-y-4 mt-3 mb-10 sm:mb-3 sm:p-4 h-[calc(100dvh-160px)] overflow-y-auto hide-scrollbar">
//             {users.map((user) => (
//               <div
//                 key={user.id}
//                 className="flex justify-between items-center bg-white dark:bg-black mx-3 sm:mx-0 p-3 rounded-lg transition"
//               >
//                 {/* User Info */}
//                 <div className="flex items-center gap-4">
//                   <div className="rounded-full w-10 h-10 overflow-hidden">
//                     <img
//                       src={user.profileImage}
//                       alt={`${user.fullname}'s profile`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm sm:text-md">{user.fullname}</p>
//                     <p className="text-gray-400 text-sm">@{user.username}</p>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2">
//                   <Link
//                     to="#"
//                     className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white transition"
//                     title="View Profile"
//                   >
//                     <FaEye />
//                     <span className="md:inline hidden">View</span>
//                   </Link>
//                   <button
//                     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white transition"
//                     title="Add Friend"
//                   >
//                     <FaUserPlus />
//                     <span className="md:inline hidden">Follow</span>
//                   </button>
//                   <button
//                     className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white transition"
//                     title="Send Message"
//                   >
//                     <FaEnvelope />
//                     <span className="md:inline hidden">Message</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

// export default SearchPage;


// const users = [
//   { id: 1, fullname: "John Doe", username: "john_doe", profileImage: "https://i.pravatar.cc/100?img=1" },
//   { id: 2, fullname: "Jane Smith", username: "jane_smith", profileImage: "https://i.pravatar.cc/100?img=2" },
//   { id: 3, fullname: "Michael Brown", username: "mike_brown", profileImage: "https://i.pravatar.cc/100?img=3" },
//   { id: 4, fullname: "Emma White", username: "emma_white", profileImage: "https://i.pravatar.cc/100?img=4" },
//   { id: 5, fullname: "Chris Black", username: "chris_black", profileImage: "https://i.pravatar.cc/100?img=5" },
//   { id: 6, fullname: "Sophia Green", username: "sophia_green", profileImage: "https://i.pravatar.cc/100?img=6" },
//   { id: 7, fullname: "Liam Grey", username: "liam_grey", profileImage: "https://i.pravatar.cc/100?img=7" },
//   { id: 8, fullname: "Olivia Red", username: "olivia_red", profileImage: "https://i.pravatar.cc/100?img=8" },
//   { id: 9, fullname: "Ethan Blue", username: "ethan_blue", profileImage: "https://i.pravatar.cc/100?img=9" },
//   { id: 10, fullname: "Mia Yellow", username: "mia_yellow", profileImage: "https://i.pravatar.cc/100?img=10" },
//   { id: 11, fullname: "Jacob White", username: "jacob_white", profileImage: "https://i.pravatar.cc/100?img=11" },
//   { id: 12, fullname: "Charlotte Black", username: "charlotte_black", profileImage: "https://i.pravatar.cc/100?img=12" },
//   { id: 13, fullname: "Aiden Brown", username: "aiden_brown", profileImage: "https://i.pravatar.cc/100?img=13" },
//   { id: 14, fullname: "Amelia Gray", username: "amelia_gray", profileImage: "https://i.pravatar.cc/100?img=14" },
//   { id: 15, fullname: "Oliver Purple", username: "oliver_purple", profileImage: "https://i.pravatar.cc/100?img=15" },
//   { id: 16, fullname: "Isabella Blue", username: "isabella_blue", profileImage: "https://i.pravatar.cc/100?img=16" },
//   { id: 17, fullname: "Lucas Pink", username: "lucas_pink", profileImage: "https://i.pravatar.cc/100?img=17" },
//   { id: 18, fullname: "Harper Silver", username: "harper_silver", profileImage: "https://i.pravatar.cc/100?img=18" },
//   { id: 19, fullname: "Ella Gold", username: "ella_gold", profileImage: "https://i.pravatar.cc/100?img=19" },
//   { id: 20, fullname: "Jack Brown", username: "jack_brown", profileImage: "https://i.pravatar.cc/100?img=20" },
// ];
