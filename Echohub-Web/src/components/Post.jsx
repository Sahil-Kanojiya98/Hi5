import {
  FaRegComment,
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import TimeAgo from "./TimeAgo";
import axiosInstance from "../utils/axiosConfig";
import CommentDialog from "./CommentDialog";
import { remove } from "lodash";

const Post = ({ post , isMyPost , removePost }) => {
  console.log(post);
  console.log("isMyPost"+isMyPost)

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  const openCommentDialog = () => {
    setIsCommentDialogOpen(true);
  };

  const closeCommentDialog = () => {
    setIsCommentDialogOpen(false);
  };

  const handleLikePost = useCallback(async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const endpoint = isLiked
        ? `/post/unlike/${post.id}`
        : `/post/like/${post.id}`;

      const response = await axiosInstance.post(endpoint);
      console.log(response.data);
      setIsLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    } finally {
      setIsLiking(false);
    }
  }, [isLiked, isLiking, post.id]);

  const handleSavePost = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const endpoint = isSaved
        ? `/user/saved-posts/${post.id}`
        : `/user/saved-posts/${post.id}`;

      const method = isSaved ? "delete" : "post";
      const response = await axiosInstance[method](endpoint);
      console.log(response.data);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaved, isSaving, post.id]);

  const handleDeletePost = async () => {
    if (isDeleting) return;
    console.log("deleting post");
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/post/${post.id}`);
      console.log("Post deleted:", response.data);
      removePost(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar">
        <Link
          to={`/profile/${post.userID}`}
          className="w-8 h-8 rounded-full overflow-hidden"
        >
          <img
            src={
              post.profilePictureUrl
                ? `http://localhost:8080${post.profilePictureUrl}`
                : "/avatar.png"
            }
            alt="Profile"
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1 ml-3 float-end">
        <div className="flex gap-2 justify-between">
          <Link to={`/profile/${post.userID}`} className="font-bold">
            {post.fullname}
          </Link>
          {isMyPost && (
            <span>
              {!isDeleting ? (
                <FaTrash
                  onClick={handleDeletePost}
                  className="cursor-pointer hover:text-red-500"
                />
              ) : (
                <LoadingSpinner size="sm" width="20px" height="20px" />
              )}
            </span>
          )}
        </div>
        <span className="text-gray-700 flex gap-1 text-sm mt-1">
          <Link to={`/profile/${post.userID}`}>@{post.username}</Link>
          <span>·</span>
          <TimeAgo date={post.createdAt} />
        </span>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span className="mt-4 mb-2">
            {post.content.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </span>
          {(post.imageUrl || post.videoUrl) && (
            <div className="relative mx-auto" style={{ maxWidth: "650px" }}>
              {post.imageUrl && (
                <img
                  src={`http://localhost:8080${post.imageUrl}`}
                  className="w-full mx-auto h-auto"
                  style={{ maxHeight: "calc(65dvh)" }}
                  alt="Preview"
                />
              )}
              {post.videoUrl && (
                <video
                  src={`http://localhost:8080${post.videoUrl}`}
                  controls
                  className="w-full mx-auto h-auto object-contain rounded"
                  style={{ maxHeight: "calc(65dvh)" }}
                  controlsList="nodownload"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-3 mx-7">
          <div
            onClick={handleLikePost}
            className="flex justify-center items-center gap-1 group w-12"
          >
            {isLiking ? (
              <LoadingSpinner size="sm" width="20px" height="20px" />
            ) : isLiked ? (
              <FaHeart className="w-4 h-4 text-pink-500 group-hover:text-pink-600" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-slate-500 group-hover:text-pink-600" />
            )}
            <span
              className={`text-sm ${
                isLiked ? "text-pink-500" : "text-slate-500"
              } group-hover:text-pink-600 `}
            >
              {likesCount}
            </span>
          </div>
          <div
            className="flex justify-center items-center gap-1 group w-12"
            onClick={openCommentDialog}
          >
            <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
            <span className="text-sm text-slate-500 group-hover:text-blue-500">
              {commentsCount}
            </span>
          </div>
          {isCommentDialogOpen && (
            <CommentDialog postId={post.id} onClose={closeCommentDialog} isOpen={isCommentDialogOpen} />
          )}
          <div
            onClick={handleSavePost}
            className="flex justify-center items-center gap-1 w-12"
          >
            {isSaving ? (
              <LoadingSpinner size="sm" width="20px" height="20px" />
            ) : isSaved ? (
              <FaBookmark className="w-4 h-4 text-yellow-500 hover:text-yellow-600" />
            ) : (
              <FaRegBookmark className="w-4 h-4 text-gray-500 hover:text-yellow-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
