import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { FaHeart, FaTrash } from "react-icons/fa";
import axiosInstance from "../utils/axiosConfig";
import TimeAgo from "./TimeAgo";

const Comment = ({ comment, authUser, setCommentsCount, deleteComment }) => {
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
      setCommentsCount((prev) => prev - 1);
      deleteComment(comment.commentId);
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
            <span className="font-bold text-sm md:w-28 lg:w-36 truncate">
              {comment.userFullName}
            </span>
            <span className="text-gray-600 text-sm pl-2 md:w-28 lg:w-36 truncate">
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

// Add prop types validation
Comment.propTypes = {
  comment: PropTypes.shape({
    commentId: PropTypes.string.isRequired,
    userFullName: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userProfilePicture: PropTypes.string,
    likedFlag: PropTypes.bool.isRequired,
    likeCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
  }).isRequired,
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  setCommentsCount: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

export default Comment;
