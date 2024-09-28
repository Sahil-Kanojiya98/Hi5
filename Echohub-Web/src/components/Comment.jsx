// import React, { useState } from "react";
// import { FaHeart, FaTrash } from "react-icons/fa";
// import TimeAgo from "./TimeAgo";

// const Comment = ({ comment, onDelete, onLike, authUser }) => {
//   const [isLiked, setIsLiked] = useState(comment.likedFlag);

//   const handleLike = () => {
//     onLike(comment.commentId, isLiked, comment.likeCount);
//     setIsLiked((prev)=> !prev);
//   };

//   const handleDelete = () => {
//     onDelete(comment.commentId);
//   };

//   return (
//     <div className="flex flex-col gap-2 p-3 border-b border-gray-500">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="avatar">
//             <div className="w-8 rounded-full">
//               <img
//                 src={
//                   comment.userProfilePicture
//                     ? "http://localhost:8080" + comment.userProfilePicture
//                     : "/avatar.png"
//                 }
//                 alt="Profile"
//               />
//             </div>
//           </div>
//           <div className="flex flex-col md:flex-row">
//             <span className="font-bold text-sm">{comment.userFullName}</span>
//             <span className="text-gray-600 text-sm pl-2">
//               @{comment.userName}
//             </span>
//           </div>
//         </div>
//         <div className="flex gap-4 items-center">
//           <button
//             className={`hover:text-pink-500 focus:outline-none flex justify-center items-center gap-1 ${
//               isLiked ? "text-pink-500" : ""
//             }`}
//             onClick={handleLike}
//           >
//             <FaHeart />
//             <span>{comment.likeCount}</span>
//           </button>
//           {authUser.id === comment.userID && (
//             <button className="focus:outline-none" onClick={handleDelete}>
//               <FaTrash className="hover:text-red-500" />
//             </button>
//           )}
//         </div>
//       </div>
//       <TimeAgo
//         date={comment.createdAt}
//         className="text-gray-500 text-xs pl-2 md:pl-10"
//       />
//       <div
//         className="text-sm text-gray-400 px-3 pt-1"
//         style={{ wordBreak: "break-word" }}
//       >
//         {comment.content.split("\n").map((line, index) => (
//           <React.Fragment key={index}>
//             {line}
//             <br />
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Comment;


import React, { useState } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
import axiosInstance from "../utils/axiosConfig";
import TimeAgo from "./TimeAgo";

const Comment = ({ comment, authUser }) => {
  const [isLiked, setIsLiked] = useState(comment.likedFlag);
  const [likeCount, setLikeCount] = useState(comment.likeCount);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axiosInstance.post(`/comment/unlike/${comment.commentId}`);
        setLikeCount((prev) => prev - 1);
      } else {
        await axiosInstance.post(`/comment/like/${comment.commentId}`);
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/comment/${comment.commentId}`);
      window.location.reload(); // Optionally reload or remove the comment from UI
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 border-b border-gray-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={
                  comment.userProfilePicture
                    ? "http://localhost:8080" + comment.userProfilePicture
                    : "/avatar.png"
                }
                alt="Profile"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <span className="font-bold text-sm">{comment.userFullName}</span>
            <span className="text-gray-600 text-sm pl-2">
              @{comment.userName}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            className={`hover:text-pink-500 focus:outline-none flex justify-center items-center gap-1 ${
              isLiked ? "text-pink-500" : ""
            }`}
            onClick={handleLike}
          >
            <FaHeart />
            <span>{likeCount}</span>
          </button>
          {authUser.id === comment.userID && (
            <button className="focus:outline-none" onClick={handleDelete}>
              <FaTrash className="hover:text-red-500" />
            </button>
          )}
        </div>
      </div>
      <TimeAgo
        date={comment.createdAt}
        className="text-gray-500 text-xs pl-2 md:pl-10"
      />
      <div
        className="text-sm text-gray-400 px-3 pt-1"
        style={{ wordBreak: "break-word" }}
      >
        {comment.content.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Comment;
