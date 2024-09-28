// import { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosConfig";
// import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
// import InfiniteScroll from "react-infinite-scroll-component";
// import TimeAgo from "./TimeAgo";

// const CommentDialog = ({ isOpen, onClose, postId }) => {
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [likedComments, setLikedComments] = useState(new Set());
//   const [page, setPage] = useState(0);

//   useEffect(() => {
//     if (isOpen) {
//       fetchComments();
//     }
//   }, [isOpen]);

//   const fetchComments = async (pageNumber = 0) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get(
//         `/comment/${postId}?page=${pageNumber}`
//       );
//       console.log(response.data);
//       setComments((prevComments) => [...prevComments, ...response.data]);
//       setHasMore(response.data.hasMore);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//     console.log("fetching comments");
//   };

//   const handleCommentChange = (e) => {
//     setComment(e.target.value);
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(`/comment/${postId}`, {
//         content: comment,
//       });
//       setComments((prevComments) => [response.data, ...prevComments]);
//       setComment("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLikeComment = async (commentId) => {
//     // try {
//     //   const endpoint = likedComments.has(commentId)
//     //     ? `/comment/unlike/${commentId}`
//     //     : `/comment/like/${commentId}`;

//     //   const response = await axiosInstance.post(endpoint);
//     //   console.log(response.data);
//     //   setLikedComments(prevLiked => {
//     //     const updatedLikes = new Set(prevLiked);
//     //     if (updatedLikes.has(commentId)) {
//     //       updatedLikes.delete(commentId);
//     //     } else {
//     //       updatedLikes.add(commentId);
//     //     }
//     //     return updatedLikes;
//     //   });
//     // } catch (error) {
//     //   console.error("Error liking/unliking comment:", error);
//     // }
//     console.log("like comment  or unlike comment");
//   };

//   const handleDeleteComment = async (commentId) => {
//     // try {
//     //   const response = await axiosInstance.delete(`/comment/${commentId}`);
//     //   console.log("Comment deleted:", response.data);
//     //   setComments(prevComments => prevComments.filter(c => c.id !== commentId));
//     // } catch (error) {
//     //   console.error("Error deleting comment:", error);
//     // }
//     console.log("delete comment");
//   };

//   const loadMoreComments = () => {
//     setPage((prevPage) => {
//       const nextPage = prevPage + 1;
//       fetchComments(nextPage);
//       return nextPage;
//     });
//   };

//   const hiddenScrollbarStyles = {
//     overflow: "scroll",
//     scrollbarWidth: "none",
//     "-ms-overflow-style": "none",
//     "scrollbar-width": "none",
//   };

//   return (
//     <dialog className="modal" open={isOpen}>
//       <div className="modal-box border rounded-md border-gray-700 shadow-md">
//         <h3 className="font-bold text-lg my-3">COMMENTS</h3>
//         <div className="flex flex-col gap-3 max-h-72 sm:max-h-80 md:max-h-96">
//           <InfiniteScroll
//             dataLength={comments.length}
//             next={loadMoreComments}
//             hasMore={hasMore}
//             loader={<h4>Loading...</h4>}
//             endMessage={<p>No more comments</p>}
//             className="flex flex-col gap-4 overflow-x-hidden overflow-y-scroll gap-1"
//             style={hiddenScrollbarStyles}
//           >
//             {comments.map((comment) => (
//               <div className="flex flex-col">
//                 <div
//                   key={comment.commentId}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex gap-2 items-center">
//                     <div className="avatar">
//                       <div className="w-8 rounded-full">
//                         <img src="/avatar.png" alt="Profile" />
//                       </div>
//                     </div>
//                     <div className="flex flex-col">
//                       <div className="flex items-center gap-1">
//                         <span className="font-bold">John Doe</span>
//                         <span className="text-gray-700 text-sm">@johndoe</span>
//                         <TimeAgo
//                           date={comment.createdAt}
//                           className={"text-gray-700 text-sm pl-1"}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex justify-end items-center gap-2">
//                     <button
//                       className="btn btn-primary btn-sm"
//                       onClick={() => handleLikeComment(comment.commentId)}
//                     >
//                       {likedComments.has(comment.id) ? (
//                         <FaHeart className="text-pink-500" />
//                       ) : (
//                         <FaRegHeart className="text-slate-500" />
//                       )}
//                     </button>
//                     <button
//                       className="btn btn-primary btn-sm"
//                       onClick={() => handleDeleteComment(comment.commentId)}
//                     >
//                       <FaTrash className="text-red-500" />
//                     </button>
//                   </div>
//                 </div>
//                 <div
//                   className="text-sm px-3"
//                   style={{ wordBreak: "break-word" }}
//                 >
//                   {comment.content}
//                 </div>
//               </div>
//             ))}
//           </InfiniteScroll>
//           <form
//             className="flex items-center mt-4 border-t border-gray-600 pt-3"
//             onSubmit={handleCommentSubmit}
//           >
//             <div className="flex items-center w-full rounded-lg overflow-hidden ">
//               <textarea
//                 className="textarea w-full h-20 text-md rounded-s-lg resize-none border border-gray-600 focus:border-gray-700 focus:outline-none"
//                 placeholder="Add a comment..."
//                 value={comment}
//                 onChange={handleCommentChange}
//               />
//               <button
//                 type="submit"
//                 className="btn w-20 btn-primary h-20 btn-sm text-white px-4"
//               >
//                 {loading ? "Posting..." : "Post"}
//               </button>
//             </div>
//           </form>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </div>
//       </div>
//       <form method="dialog" className="modal-backdrop">
//         <button className="outline-none" onClick={onClose}>
//           Close
//         </button>
//       </form>
//     </dialog>
//   );
// };

// export default CommentDialog;

// import { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosConfig";
// import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
// import InfiniteScroll from "react-infinite-scroll-component";
// import TimeAgo from "./TimeAgo";

// const CommentDialog = ({ isOpen, onClose, postId }) => {
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [likedComments, setLikedComments] = useState(new Set());
//   const [page, setPage] = useState(0);

//   useEffect(() => {
//     if (isOpen) {
//       fetchComments();
//     }
//   }, [isOpen]);

//   const fetchComments = async (pageNumber = 0) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get(
//         `/comment/${postId}?page=${pageNumber}`
//       );
//       setComments((prevComments) => [...prevComments, ...response.data]);
//       setHasMore(response.data.hasMore);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCommentChange = (e) => setComment(e.target.value);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(`/comment/${postId}`, {
//         content: comment,
//       });
//       setComments((prevComments) => [response.data, ...prevComments]);
//       setComment("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLikeComment = (commentId) => {
//     // Handle comment like/unlike logic here
//     console.log("like/unlike comment", commentId);
//   };

//   const handleDeleteComment = (commentId) => {
//     // Handle comment deletion logic here
//     console.log("delete comment", commentId);
//   };

//   const loadMoreComments = () => {
//     setPage((prevPage) => {
//       const nextPage = prevPage + 1;
//       fetchComments(nextPage);
//       return nextPage;
//     });
//   };

//   const hiddenScrollbarStyles = {
//     overflow: "scroll",
//     scrollbarWidth: "none", // For Firefox
//     msOverflowStyle: "none", // For Internet Explorer and Edge
//   };

//   return (
//     <dialog className="modal" open={isOpen}>
//       <div className="modal-box border rounded-lg shadow-md max-w-xl mx-auto p-6">
//         <h3 className="font-bold text-lg my-3">COMMENTS</h3>
//         <div className="flex flex-col gap-3 max-h-72 sm:max-h-80 md:max-h-96">
//           <InfiniteScroll
//             dataLength={comments.length}
//             next={loadMoreComments}
//             hasMore={hasMore}
//             loader={<h4>Loading...</h4>}
//             endMessage={<p className="text-center">No more comments</p>}
//             className="flex flex-col gap-3 overflow-y-scroll"
//             style={hiddenScrollbarStyles}
//           >
//             {comments.map((comment) => (
//               <div key={comment.commentId} className="flex flex-col gap-2 p-3 border-b border-gray-300">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="avatar">
//                       <div className="w-8 rounded-full">
//                         <img src="/avatar.png" alt="Profile" />
//                       </div>
//                     </div>
//                     <div>
//                       <span className="font-bold text-sm">John Doe</span>
//                       <span className="text-gray-600 text-xs pl-2">@johndoe</span>
//                       <TimeAgo
//                         date={comment.createdAt}
//                         className="text-gray-500 text-xs pl-2"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleLikeComment(comment.commentId)}
//                     >
//                       {likedComments.has(comment.commentId) ? (
//                         <FaHeart className="text-pink-500" />
//                       ) : (
//                         <FaRegHeart className="text-gray-500" />
//                       )}
//                     </button>
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleDeleteComment(comment.commentId)}
//                     >
//                       <FaTrash className="text-red-500" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-800" style={{ wordBreak: "break-word" }}>
//                   {comment.content}
//                 </div>
//               </div>
//             ))}
//           </InfiniteScroll>

//           {/* Comment form */}
//           <form
//             className="flex items-center mt-4 border-t border-gray-300 pt-3"
//             onSubmit={handleCommentSubmit}
//           >
//             <textarea
//               className="textarea w-full h-20 rounded-md resize-none border border-gray-300 focus:outline-none focus:border-gray-500 p-3"
//               placeholder="Add a comment..."
//               value={comment}
//               onChange={handleCommentChange}
//             />
//             <button
//               type="submit"
//               className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md"
//             >
//               {loading ? "Posting..." : "Post"}
//             </button>
//           </form>
//           {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//         </div>
//       </div>
//       <form method="dialog" className="modal-backdrop">
//         <button className="outline-none" onClick={onClose}>
//           Close
//         </button>
//       </form>
//     </dialog>
//   );
// };

// export default CommentDialog;

// import React, { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosConfig";
// import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
// import InfiniteScroll from "react-infinite-scroll-component";
// import TimeAgo from "./TimeAgo";

// const CommentDialog = ({ isOpen, onClose, postId }) => {
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   // const likedComments = useState([]);
//   const [page, setPage] = useState(0);

//   useEffect(() => {
//     if (isOpen) {
//       fetchComments();
//     }
//   }, [isOpen]);

//   const fetchComments = async (pageNumber = 0) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get(
//         `/comment/${postId}?page=${pageNumber}`
//       );
//       console.log(response.data);
//       setComments((prevComments) => [...prevComments, ...response.data]);
//       if(response.data.length==0){
//         console.log("No more comments to load");
//         setHasMore(false);
//       }else{
//         setHasMore(true);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCommentChange = (e) => setComment(e.target.value);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(`/comment/${postId}`, {
//         content: comment,
//       });
//       setComments((prevComments) => [response.data, ...prevComments]);
//       setComment("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLikeComment = (commentId) => {
//     // Handle comment like/unlike logic here
//     console.log("like/unlike comment", commentId);
//   };

//   const handleDeleteComment = (commentId) => {
//     // Handle comment deletion logic here
//     console.log("delete comment", commentId);
//   };

//   const loadMoreComments = () => {
//     setPage((prevPage) => {
//       console.log(prevPage + 1)
//       const nextPage = prevPage + 1;
//       fetchComments(nextPage);
//       return nextPage;
//     });
//   };

//   const hiddenScrollbarStyles = {
//     overflow: "scroll",
//     scrollbarWidth: "none",
//     "-ms-overflow-style": "none",
//     "scrollbar-width": "none",
//   };

//   return (
//     <dialog className="modal" open={isOpen}>
//       <div
//         className="modal-box border border-gray-500  rounded-lg max-w-md md:max-w-lg mx-auto flex flex-col"
//         style={{ maxHeight: "65dvh" }}
//       >
//         <h3 className="font-bold text-lg my-3">COMMENTS</h3>
//         <div className="flex-grow overflow-y-auto">
//           <InfiniteScroll
//             dataLength={comments.length}
//             next={loadMoreComments}
//             hasMore={hasMore}
//             loader={<h4>Loading...</h4>}
//             endMessage={<p className="text-center">No more comments</p>}
//             className="flex flex-col gap-3 overflow-y-scroll"
//             style={hiddenScrollbarStyles}
//           >
//             {comments.map((comment) => (
//               <div
//                 key={comment.commentId}
//                 className="flex flex-col gap-2 p-3 border-b border-gray-500"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="avatar">
//                       <div className="w-8 rounded-full">
//                         <img src="/avatar.png" alt="Profile" />
//                       </div>
//                     </div>
//                     <div>
//                       <span className="font-bold text-sm">John Doe</span>
//                       <span className="text-gray-600 text-xs pl-2">
//                         @johndoe
//                       </span>
//                       <TimeAgo
//                         date={comment.createdAt}
//                         className="text-gray-500 text-xs pl-2"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleLikeComment(comment.commentId)}
//                     >
//                       {/* {likedComments.has(comment.commentId) ? ( */}
//                         <FaHeart className="text-pink-500" />
//                       {/* ) : ( */}
//                         {/* <FaRegHeart className="text-gray-500" /> */}
//                       {/* )} */}
//                     </button>
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleDeleteComment(comment.commentId)}
//                     >
//                       <FaTrash className="text-red-500" />
//                     </button>
//                   </div>
//                 </div>
//                 <div
//                   className="text-sm text-gray-400 px-2 pt-1"
//                   style={{ wordBreak: "break-word" }}
//                 >
//                   {comment.content.split("\n").map((line, index) => (
//                     <React.Fragment key={index}>
//                       {line}
//                       <br />
//                     </React.Fragment>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </InfiniteScroll>
//         </div>
//         <form
//           className="flex items-center mt-4 border-t pt-3"
//           onSubmit={handleCommentSubmit}
//           style={{ position: "sticky", bottom: 0 }}
//         >
//           <textarea
//             className="textarea w-full h-20 rounded-md resize-none border focus:outline-none focus:border-gray-500 p-3 border border-gray-600 focus:border-gray-700"
//             placeholder="Add a comment..."
//             value={comment}
//             onChange={handleCommentChange}
//           />
//           <button
//             type="submit"
//             className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md"
//           >
//             {loading ? "Posting..." : "Post"}
//           </button>
//         </form>

//         {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//       </div>
//       <form method="dialog" className="modal-backdrop">
//         <button className="outline-none" onClick={onClose}>
//           Close
//         </button>
//       </form>
//     </dialog>
//   );
// };

// export default CommentDialog;

// import React, { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosConfig";
// import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
// import InfiniteScroll from "react-infinite-scroll-component";
// import TimeAgo from "./TimeAgo";

// const CommentDialog = ({ isOpen, onClose, postId }) => {
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(0);

//   useEffect(() => {
//     if (isOpen) {
//       setComments([]); // Reset comments when dialog opens
//       setPage(0); // Reset page to 0
//       setHasMore(true); // Reset hasMore to true
//       fetchComments(0); // Fetch the first page of comments
//     }
//   }, [isOpen]);

//   const fetchComments = async (pageNumber = 0) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get(
//         `/comment/${postId}?page=${pageNumber}`
//       );
//       console.log(response.data);
//       setComments((prevComments) => [...prevComments, ...response.data]);

//       if (response.data.length === 0) {
//         setHasMore(false); // No more comments to load
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCommentChange = (e) => setComment(e.target.value);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(`/comment/${postId}`, {
//         content: comment,
//       });
//       setComments((prevComments) => [response.data, ...prevComments]);
//       setComment("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLikeComment = (commentId) => {
//     console.log("like/unlike comment", commentId);
//   };

//   const handleDeleteComment = (commentId) => {
//     console.log("delete comment", commentId);
//   };

//   const loadMoreComments = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchComments(nextPage);
//   };

//   const hiddenScrollbarStyles = {
//     overflow: "scroll",
//     scrollbarWidth: "none",
//     "-ms-overflow-style": "none",
//     "scrollbar-width": "none",
//   };
//   return (
//     <dialog className="modal" open={isOpen}>
//       <div
//         className="modal-box border border-gray-500  rounded-lg max-w-md md:max-w-lg mx-auto flex flex-col"
//         style={{ maxHeight: "65dvh" }}
//       >
//         <h3 className="font-bold text-lg my-3">COMMENTS</h3>
//         <div className="flex-grow overflow-y-auto">
//           <InfiniteScroll
//             dataLength={comments.length}
//             next={loadMoreComments}
//             hasMore={hasMore}
//             loader={<h4>Loading...</h4>}
//             endMessage={<p className="text-center">No more comments</p>}
//             className="flex flex-col gap-3 overflow-y-scroll"
//             style={hiddenScrollbarStyles}
//           >
//             {comments.map((comment) => (
//               <div
//                 key={comment.commentId}
//                 className="flex flex-col gap-2 p-3 border-b border-gray-500"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="avatar">
//                       <div className="w-8 rounded-full">
//                         <img src="/avatar.png" alt="Profile" />
//                       </div>
//                     </div>
//                     <div>
//                       <span className="font-bold text-sm">John Doe</span>
//                       <span className="text-gray-600 text-xs pl-2">
//                         @johndoe
//                       </span>
//                       <TimeAgo
//                         date={comment.createdAt}
//                         className="text-gray-500 text-xs pl-2"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleLikeComment(comment.commentId)}
//                     >
//                       <FaHeart className="text-pink-500" />
//                     </button>
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleDeleteComment(comment.commentId)}
//                     >
//                       <FaTrash className="text-red-500" />
//                     </button>
//                   </div>
//                 </div>
//                 <div
//                   className="text-sm text-gray-400 px-2 pt-1"
//                   style={{ wordBreak: "break-word" }}
//                 >
//                   {comment.content.split("\n").map((line, index) => (
//                     <React.Fragment key={index}>
//                       {line}
//                       <br />
//                     </React.Fragment>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </InfiniteScroll>
//         </div>
//         <form
//           className="flex items-center mt-4 border-t pt-3"
//           onSubmit={handleCommentSubmit}
//           style={{ position: "sticky", bottom: 0 }}
//         >
//           <textarea
//             className="textarea w-full h-20 rounded-md resize-none border focus:outline-none focus:border-gray-500 p-3 border border-gray-600 focus:border-gray-700"
//             placeholder="Add a comment..."
//             value={comment}
//             onChange={handleCommentChange}
//           />
//           <button
//             type="submit"
//             className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md"
//           >
//             {loading ? "Posting..." : "Post"}
//           </button>
//         </form>
//         {hasMore}
//         {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//       </div>
//       <form method="dialog" className="modal-backdrop">
//         <button className="outline-none" onClick={onClose}>
//           Close
//         </button>
//       </form>
//     </dialog>
//   );
// };

// export default CommentDialog;

// import React, { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosConfig";
// import { FaHeart, FaTrash } from "react-icons/fa";
// import InfiniteScroll from "react-infinite-scroll-component";
// import TimeAgo from "./TimeAgo";

// const CommentDialog = ({ isOpen, onClose, postId }) => {
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(0);

//   useEffect(() => {
//     if (isOpen) {
//       setComments([]); // Reset comments when dialog opens
//       setPage(0); // Reset page to 0
//       setHasMore(true); // Reset hasMore to true
//     }
//   }, [isOpen]);

//   const fetchComments = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get(
//         `/comment/${postId}?page=${page}`
//       );
//       console.log(response.data);
//       setComments((prevComments) => [...prevComments, ...response.data]);
//       if (response.data.length == 0) {
//         setHasMore(false);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCommentChange = (e) => setComment(e.target.value);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(`/comment/${postId}`, {
//         content: comment,
//       });
//       setComments((prevComments) => [response.data, ...prevComments]);
//       setComment("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLikeComment = (commentId) => {
//     console.log("like/unlike comment", commentId);
//   };

//   const handleDeleteComment = (commentId) => {
//     console.log("delete comment", commentId);
//   };

//   const loadMoreComments = () => {
//     console.log(loading+"     "+hasMore)
//     if (loading || !hasMore) return; // Prevent further requests if already loading or no more comments
//     const nextPage = page + 1;
//     setPage(nextPage);
//   };

//   useEffect(()=>{
//     fetchComments();
//   },[page])

//   const hiddenScrollbarStyles = {
//     overflow: "scroll",
//     scrollbarWidth: "none",
//     "-ms-overflow-style": "none",
//     "scrollbar-width": "none",
//   };

//   return (
//     <dialog className="modal" open={isOpen}>
//       <div
//         className="modal-box border border-gray-500 rounded-lg max-w-md md:max-w-lg mx-auto flex flex-col"
//         style={{ maxHeight: "65dvh" }}
//       >
//         <h3 className="font-bold text-lg my-3">COMMENTS</h3>
//         <div className="flex-grow overflow-y-auto">
//           <InfiniteScroll
//             dataLength={comments.length}
//             next={loadMoreComments}
//             hasMore={hasMore}
//             loader={<h4>Loading...</h4>}
//             endMessage={<p className="text-center">No more comments</p>}
//             className="flex flex-col gap-3 overflow-y-scroll"
//             style={hiddenScrollbarStyles}
//           >
//             {comments.map((comment) => (
//               <div
//                 key={comment.commentId}
//                 className="flex flex-col gap-2 p-3 border-b border-gray-500"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="avatar">
//                       <div className="w-8 rounded-full">
//                         <img src="/avatar.png" alt="Profile" />
//                       </div>
//                     </div>
//                     <div>
//                       <span className="font-bold text-sm">John Doe</span>
//                       <span className="text-gray-600 text-xs pl-2">
//                         @johndoe
//                       </span>
//                       <TimeAgo
//                         date={comment.createdAt}
//                         className="text-gray-500 text-xs pl-2"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleLikeComment(comment.commentId)}
//                     >
//                       <FaHeart className="text-pink-500" />
//                     </button>
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => handleDeleteComment(comment.commentId)}
//                     >
//                       <FaTrash className="text-red-500" />
//                     </button>
//                   </div>
//                 </div>
//                 <div
//                   className="text-sm text-gray-400 px-2 pt-1"
//                   style={{ wordBreak: "break-word" }}
//                 >
//                   {comment.content.split("\n").map((line, index) => (
//                     <React.Fragment key={index}>
//                       {line}
//                       <br />
//                     </React.Fragment>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </InfiniteScroll>
//         </div>
//         <form
//           className="flex items-center mt-4 border-t pt-3"
//           onSubmit={handleCommentSubmit}
//           style={{ position: "sticky", bottom: 0 }}
//         >
//           <textarea
//             className="textarea w-full h-20 rounded-md resize-none border focus:outline-none focus:border-gray-500 p-3 border border-gray-600 focus:border-gray-700"
//             placeholder="Add a comment..."
//             value={comment}
//             onChange={handleCommentChange}
//           />
//           <button
//             type="submit"
//             className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md"
//           >
//             {loading ? "Posting..." : "Post"}
//           </button>
//         </form>
//         {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//       </div>
//       <form method="dialog" className="modal-backdrop">
//         <button className="outline-none" onClick={onClose}>
//           Close
//         </button>
//       </form>
//     </dialog>
//   );
// };

// export default CommentDialog;


// import React, { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosConfig";
// import { FaHeart, FaTrash } from "react-icons/fa";
// import InfiniteScroll from "react-infinite-scroll-component";
// import TimeAgo from "./TimeAgo";
// import { useSelector } from "react-redux";

// const CommentDialog = ({ isOpen, onClose, postId }) => {
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(0);
//   const authUser = useSelector((state) => state.auth.user);
//   const [isPosting, setIsPosting] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       setComments([]);
//       setPage(0);
//       setHasMore(true);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       console.log("call made");
//       try {
//         const response = await axiosInstance.get(
//           `/comment/${postId}?page=${page}`
//         );
//         console.log(response.data);
//         setComments((prevComments) => [...prevComments, ...response.data]);
//         if (response.data.length === 0) {
//           setHasMore(false);
//         }
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data || "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [page]);
//   const handleCommentChange = (e) => setComment(e.target.value);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     setIsPosting(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(`/comment/${postId}`, {
//         content: comment,
//       });
//       console.log(response.data);
//       const { id, createdAt, content, user } = response.data;
//       setComments((prevComments) => [
//         {
//           commentId: id,
//           content: content,
//           createdAt: createdAt,
//           likeCount: 0,
//           userFullName: user.fullname,
//           userID: user.id,
//           userName: user.username,
//           userProfilePicture: user.profilePictureUrl,
//         },
//         ...prevComments,
//       ]);
//       setComment("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   const handleLikeComment = (commentId) => {
//     console.log("like/unlike comment", commentId);
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       const response = await axiosInstance.delete(`/comment/${commentId}`);
//       console.log(response.data);

//       setComments(
//         comments.filter((comment) => comment.commentId !== commentId)
//       );
//     } catch (err) {
//       console.error("Failed to delete comment:", err);
//     }
//   };

//   const loadMoreComments = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   return (
//     <dialog className="modal" open={isOpen}>
//       <div
//         className="modal-box border border-gray-500 rounded-lg max-w-md md:max-w-lg mx-auto flex flex-col"
//         style={{ maxHeight: "75vh", display: "flex", flexDirection: "column" }}
//       >
//         <h3 className="font-bold text-lg my-3">COMMENTS</h3>

//         <div
//           id="scrollableDiv"
//           style={{ overflowY: "auto", flexGrow: 1, paddingBottom: "10px" }}
//         >
//           {comments.length === 0 && loading === false && (
//             <p className="text-center">No comments yet. 😀</p>
//           )}
//           {comments.length > 0 && (
//             <InfiniteScroll
//               dataLength={comments.length}
//               next={loadMoreComments}
//               hasMore={hasMore}
//               loader={<h4>Loading...</h4>}
//               endMessage={<p className="text-center">No more comments</p>}
//               scrollableTarget="scrollableDiv"
//             >
//               {comments.map((comment) => (
//                 <div
//                   key={comment.commentId}
//                   className="flex flex-col gap-2 p-3 border-b border-gray-500"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="avatar">
//                         <div className="w-8 rounded-full">
//                           <img
//                             src={
//                               comment.userProfilePicture
//                                 ? "http://localhost:8080" +
//                                   comment.userProfilePicture
//                                 : "/avatar.png"
//                             }
//                             alt="Profile"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex flex-col md:flex-row">
//                         <span className="font-bold text-sm">
//                           {comment.userFullName}
//                         </span>
//                         <span className="text-gray-600 text-sm pl-2">
//                           @{comment.userName}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex gap-4 items-center">
//                       <button
//                         className="hover:text-pink-500 focus:outline-none flex justify-center items-center gap-1"
//                         onClick={() => handleLikeComment(comment.commentId)}
//                       >
//                         <FaHeart className={isLiked ? "text-pink-500" : null} />
//                         <span>{likeCount}</span>
//                       </button>
//                       {authUser.id === comment.userID && (
//                         <button
//                           className="focus:outline-none"
//                           onClick={() => handleDeleteComment(comment.commentId)}
//                         >
//                           <FaTrash className="hover:text-red-500" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                   <TimeAgo
//                     date={comment.createdAt}
//                     className="text-gray-500 text-xs pl-2 md:pl-10"
//                   />
//                   <div
//                     className="text-sm text-gray-400 px-3 pt-1"
//                     style={{ wordBreak: "break-word" }}
//                   >
//                     {comment.content.split("\n").map((line, index) => (
//                       <React.Fragment key={index}>
//                         {line}
//                         <br />
//                       </React.Fragment>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </InfiniteScroll>
//           )}
//         </div>

//         <form
//           className="flex items-center mt-4 border-t pt-3"
//           onSubmit={handleCommentSubmit}
//         >
//           <textarea
//             className="textarea w-full h-20 rounded-md resize-none focus:outline-none p-3 border border-gray-600 focus:border-gray-700"
//             placeholder="Add a comment..."
//             value={comment}
//             onChange={handleCommentChange}
//           />
//           <button
//             type="submit"
//             className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md"
//           >
//             {isPosting ? "Posting..." : "Post"}
//           </button>
//         </form>
//         {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//       </div>
//       <form method="dialog" className="modal-backdrop">
//         <button className="outline-none" onClick={onClose}>
//           Close
//         </button>
//       </form>
//     </dialog>
//   );
// };

// export default CommentDialog;




// import React, { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosConfig";
// import { FaHeart, FaTrash } from "react-icons/fa";
// import InfiniteScroll from "react-infinite-scroll-component";
// import TimeAgo from "./TimeAgo";
// import { useSelector } from "react-redux";

// const CommentDialog = ({ isOpen, onClose, postId }) => {
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(0);
//   const authUser = useSelector((state) => state.auth.user);
//   const [isPosting, setIsPosting] = useState(false);

//   // New states for tracking likes
//   const [likedComments, setLikedComments] = useState({}); // To store like status

//   useEffect(() => {
//     if (isOpen) {
//       setComments([]);
//       setPage(0);
//       setHasMore(true);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       console.log("call made");
//       try {
//         const response = await axiosInstance.get(
//           `/comment/${postId}?page=${page}`
//         );
//         console.log(response.data);
//         setComments((prevComments) => [...prevComments, ...response.data]);
//         if (response.data.length === 0) {
//           setHasMore(false);
//         }
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data || "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [page]);

//   const handleCommentChange = (e) => setComment(e.target.value);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     setIsPosting(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(`/comment/${postId}`, {
//         content: comment,
//       });
//       console.log(response.data);
//       const { id, createdAt, content, user } = response.data;
//       setComments((prevComments) => [
//         {
//           commentId: id,
//           content: content,
//           createdAt: createdAt,
//           likeCount: 0,
//           userFullName: user.fullname,
//           userID: user.id,
//           userName: user.username,
//           userProfilePicture: user.profilePictureUrl,
//         },
//         ...prevComments,
//       ]);
//       setComment("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   const handleLikeComment = async (commentId, isLiked) => {
//     try {
//       if (isLiked) {
//         // Unlike the comment
//         const response=await axiosInstance.post(`/comment/unlike/${commentId}`);
//         console.log(response.data)
//         setLikedComments((prevLikes) => ({
//           ...prevLikes,
//           [commentId]: false,
//         }));
//       } else {
//         // Like the comment
//         const response=await axiosInstance.post(`/comment/like/${commentId}`);
//         console.log(response.data)
//         setLikedComments((prevLikes) => ({
//           ...prevLikes,
//           [commentId]: true,
//         }));
//       }
//     } catch (error) {
//       console.error("Error liking/unliking comment:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       const response = await axiosInstance.delete(`/comment/${commentId}`);
//       console.log(response.data);

//       setComments(comments.filter((comment) => comment.commentId !== commentId));
//     } catch (err) {
//       console.error("Failed to delete comment:", err);
//     }
//   };

//   const loadMoreComments = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   return (
//     <dialog className="modal" open={isOpen}>
//       <div
//         className="modal-box border border-gray-500 rounded-lg max-w-md md:max-w-lg mx-auto flex flex-col"
//         style={{ maxHeight: "75vh", display: "flex", flexDirection: "column" }}
//       >
//         <h3 className="font-bold text-lg my-3">COMMENTS</h3>

//         <div
//           id="scrollableDiv"
//           style={{ overflowY: "auto", flexGrow: 1, paddingBottom: "10px" }}
//         >
//           {comments.length === 0 && loading === false && (
//             <p className="text-center">No comments yet. 😀</p>
//           )}
//           {comments.length > 0 && (
//             <InfiniteScroll
//               dataLength={comments.length}
//               next={loadMoreComments}
//               hasMore={hasMore}
//               loader={<h4>Loading...</h4>}
//               endMessage={<p className="text-center">No more comments</p>}
//               scrollableTarget="scrollableDiv"
//             >
//               {comments.map((comment) => (
//                 <div
//                   key={comment.commentId}
//                   className="flex flex-col gap-2 p-3 border-b border-gray-500"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="avatar">
//                         <div className="w-8 rounded-full">
//                           <img
//                             src={
//                               comment.userProfilePicture
//                                 ? "http://localhost:8080" +
//                                   comment.userProfilePicture
//                                 : "/avatar.png"
//                             }
//                             alt="Profile"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex flex-col md:flex-row">
//                         <span className="font-bold text-sm">
//                           {comment.userFullName}
//                         </span>
//                         <span className="text-gray-600 text-sm pl-2">
//                           @{comment.userName}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex gap-4 items-center">
//                       <button
//                         className="hover:text-pink-500 focus:outline-none flex justify-center items-center gap-1"
//                         onClick={() =>
//                           handleLikeComment(
//                             comment.commentId,
//                             likedComments[comment.commentId]
//                           )
//                         }
//                       >
//                         <FaHeart
//                           className={
//                             likedComments[comment.commentId]
//                               ? "text-pink-500"
//                               : null
//                           }
//                         />
//                         <span>{comment.likeCount}</span>
//                       </button>
//                       {authUser.id === comment.userID && (
//                         <button
//                           className="focus:outline-none"
//                           onClick={() =>
//                             handleDeleteComment(comment.commentId)
//                           }
//                         >
//                           <FaTrash className="hover:text-red-500" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                   <TimeAgo
//                     date={comment.createdAt}
//                     className="text-gray-500 text-xs pl-2 md:pl-10"
//                   />
//                   <div
//                     className="text-sm text-gray-400 px-3 pt-1"
//                     style={{ wordBreak: "break-word" }}
//                   >
//                     {comment.content.split("\n").map((line, index) => (
//                       <React.Fragment key={index}>
//                         {line}
//                         <br />
//                       </React.Fragment>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </InfiniteScroll>
//           )}
//         </div>

//         <form
//           className="flex items-center mt-4 border-t pt-3"
//           onSubmit={handleCommentSubmit}
//         >
//           <textarea
//             className="textarea w-full h-20 rounded-md resize-none focus:outline-none p-3 border border-gray-600 focus:border-gray-700"
//             placeholder="Add a comment..."
//             value={comment}
//             onChange={handleCommentChange}
//           />
//           <button
//             type="submit"
//             className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md"
//           >
//             {isPosting ? "Posting..." : "Post"}
//           </button>
//         </form>
//         {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//       </div>
//       <form method="dialog" className="modal-backdrop">
//         <button className="outline-none" onClick={onClose}>
//           Close
//         </button>
//       </form>
//     </dialog>
//   );
// };

// export default CommentDialog;




// import React, { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosConfig";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { useSelector } from "react-redux";
// import Comment from "./Comment";

// const CommentDialog = ({ isOpen, onClose, postId }) => {
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(0);
//   const authUser = useSelector((state) => state.auth.user);
//   const [isPosting, setIsPosting] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       setComments([]);
//       setPage(0);
//       setHasMore(true);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axiosInstance.get(`/comment/${postId}?page=${page}`);
//         console.log(response.data);
//         setComments((prevComments) => [...prevComments, ...response.data]);
//         if (response.data.length === 0) {
//           setHasMore(false);
//         }
//       } catch (err) {
//         setError(err.response?.data || "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [page]);

//   const handleCommentChange = (e) => setComment(e.target.value);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     setIsPosting(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(`/comment/${postId}`, {
//         content: comment,
//       });
//       const { id, createdAt, content, user } = response.data;
//       setComments((prevComments) => [
//         {
//           commentId: id,
//           content,
//           createdAt,
//           likeCount: 0,
//           userFullName: user.fullname,
//           userID: user.id,
//           userName: user.username,
//           userProfilePicture: user.profilePictureUrl,
//         },
//         ...prevComments,
//       ]);
//       setComment("");
//     } catch (err) {
//       setError(err.response?.data || "An error occurred");
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   const loadMoreComments = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axiosInstance.delete(`/comment/${commentId}`);
//       setComments((prevComments) =>
//         prevComments.filter((comment) => comment.commentId !== commentId)
//       );
//     } catch (err) {
//       console.error("Failed to delete comment:", err);
//     }
//   };

//   const handleLikeComment = async (commentId, isLiked, likeCount) => {
//     try {
//        console.log(isLiked)
//       if (isLiked) {
//         await axiosInstance.post(`/comment/unlike/${commentId}`);
//       } else {
//         await axiosInstance.post(`/comment/like/${commentId}`);
//       }
//       setComments((prevComments) =>
//         prevComments.map((comment) =>
//           comment.commentId === commentId
//             ? { ...comment, likeCount: isLiked ? likeCount - 1 : likeCount + 1 }
//             : comment
//         )
//       );
//     } catch (error) {
//       console.error("Error liking/unliking comment:", error);
//     }
//   };

//   return (
//     <dialog className="modal" open={isOpen}>
//       <div className="modal-box border border-gray-500 rounded-lg max-w-md md:max-w-lg mx-auto flex flex-col" style={{ maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
//         <h3 className="font-bold text-lg my-3">COMMENTS</h3>
//         <div id="scrollableDiv" style={{ overflowY: "auto", flexGrow: 1, paddingBottom: "10px" }}>
//           {comments.length === 0 && !loading && <p className="text-center">No comments yet. 😀</p>}
//           {comments.length > 0 && (
//             <InfiniteScroll
//               dataLength={comments.length}
//               next={loadMoreComments}
//               hasMore={hasMore}
//               loader={<h4>Loading...</h4>}
//               endMessage={<p className="text-center">No more comments</p>}
//               scrollableTarget="scrollableDiv"
//             >
//               {comments.map((comment) => (
//                 <Comment
//                   key={comment.commentId}
//                   comment={comment}
//                   onDelete={handleDeleteComment}
//                   onLike={handleLikeComment}
//                   authUser={authUser}
//                 />
//               ))}
//             </InfiniteScroll>
//           )}
//         </div>

//         <form className="flex items-center mt-4 border-t pt-3" onSubmit={handleCommentSubmit}>
//           <textarea
//             className="textarea w-full h-20 rounded-md resize-none focus:outline-none p-3 border border-gray-600 focus:border-gray-700"
//             placeholder="Add a comment..."
//             value={comment}
//             onChange={handleCommentChange}
//           />
//           <button type="submit" className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md">
//             {isPosting ? "Posting..." : "Post"}
//           </button>
//         </form>
//         {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//       </div>
//       <form method="dialog" className="modal-backdrop">
//         <button className="outline-none" onClick={onClose}>
//           Close
//         </button>
//       </form>
//     </dialog>
//   );
// };

// export default CommentDialog;




import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import Comment from "./Comment";

const CommentDialog = ({ isOpen, onClose, postId }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const authUser = useSelector((state) => state.auth.user);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setComments([]);
      setPage(0);
      setHasMore(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/comment/${postId}?page=${page}`);
        setComments((prevComments) => [...prevComments, ...response.data]);
        if (response.data.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        setError(err.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`/comment/${postId}`, {
        content: comment,
      });
      const { id, createdAt, content, user } = response.data;
      setComments((prevComments) => [
        {
          commentId: id,
          content,
          createdAt,
          likeCount: 0,
          userFullName: user.fullname,
          userID: user.id,
          userName: user.username,
          userProfilePicture: user.profilePictureUrl,
        },
        ...prevComments,
      ]);
      setComment("");
    } catch (err) {
      setError(err.response?.data || "An error occurred");
    } finally {
      setIsPosting(false);
    }
  };

  const loadMoreComments = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <dialog className="modal" open={isOpen}>
      <div className="modal-box border border-gray-500 rounded-lg max-w-md md:max-w-lg mx-auto flex flex-col" style={{ maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
        <h3 className="font-bold text-lg my-3">COMMENTS</h3>
        <div id="scrollableDiv" style={{ overflowY: "auto", flexGrow: 1, paddingBottom: "10px" }}>
          {comments.length === 0 && !loading && <p className="text-center">No comments yet. 😀</p>}
          {comments.length > 0 && (
            <InfiniteScroll
              dataLength={comments.length}
              next={loadMoreComments}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={<p className="text-center">No more comments</p>}
              scrollableTarget="scrollableDiv"
            >
              {comments.map((comment) => (
                <Comment
                  key={comment.commentId}
                  comment={comment}
                  authUser={authUser}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>

        <form className="flex items-center mt-4 border-t pt-3" onSubmit={handleCommentSubmit}>
          <textarea
            className="textarea w-full h-20 rounded-md resize-none focus:outline-none p-3 border border-gray-600 focus:border-gray-700"
            placeholder="Add a comment..."
            value={comment}
            onChange={handleCommentChange}
          />
          <button type="submit" className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md">
            {isPosting ? "Posting..." : "Post"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none" onClick={onClose}>
          Close
        </button>
      </form>
    </dialog>
  );
};

export default CommentDialog;
