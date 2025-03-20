import PropTypes from "prop-types";
import { useState } from "react";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import ShareSharpIcon from "@mui/icons-material/ShareSharp";
import BookmarkSharpIcon from "@mui/icons-material/BookmarkSharp";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ReportIcon from "@mui/icons-material/Report";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteConfirmationModal from "../temp/DeleteConfirmationModal";
import ReportConfirmationModal from "../temp/ReportConfirmationModal";
import TimeAgo from "../temp/TimeAgo";
import CommentModel from "../comment/CommentModel";
import {
  deletePost,
  likeEntity,
  reportEntity,
  save,
  unlikeEntity,
  unsave,
} from "../../services/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CommentsDisabled, PersonOutline } from "@mui/icons-material";
import ViewLikedUsersModel from "../temp/ViewLikedUsersModel";

const Post = ({ post, removePost, isMyProfilePosts }) => {
  const user = useSelector((state) => state.user.profile);
  const isMyPost = post.userId === user.id;
  console.log(post.userId + "   " + user.id);

  const [isCommentModelOpen, setIsCommentModelOpen] = useState(false);
  const openCommentModel = () => {
    setIsCommentModelOpen(true);
  };
  const closeCommentModel = () => {
    setIsCommentModelOpen(false);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      console.log("Post deleted: " + post.id);
      removePost(post.id);
    } catch (error) {
      console.error("Error deleting post: ", error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const [isReported, setIsReported] = useState(
    post.reportStatus === "REPORTED"
  );
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModal] = useState(false);
  const openReportModal = () => setIsReportModal(true);
  const closeReportModal = () => setIsReportModal(false);
  const confirmReport = async (reportReason) => {
    setIsReporting(true);
    try {
      await reportEntity({
        relevantId: post.id,
        reason: reportReason,
        type: "POST",
      });
      console.log("Post reported: " + post.id + "  reason: " + reportReason);
      // removePost(post.id);
    } catch (error) {
      console.error("Error reporting post: ", error);
    } finally {
      setIsReporting(false);
      setIsReported(true);
      closeReportModal();
    }
  };

  const [isLiked, setIsLiked] = useState(post.likeStatus === "LIKED");
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const likeClickHandler = async () => {
    if (isLiked) {
      unlikeEntity({
        relevantId: post.id,
        type: "POST",
      });
      setLikesCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      console.log("unliked" + post.id);
    } else {
      likeEntity({
        relevantId: post.id,
        type: "POST",
      });
      setLikesCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      console.log("liked" + post.id);
    }
  };

  const [commentCount, setCommentCount] = useState(post.commentsCount);

  const [isSaved, setIsSaved] = useState(post.saveStatus === "SAVED");
  const saveClickHandler = () => {
    if (isSaved) {
      unsave({
        relevantId: post.id,
        type: "POST",
      });
      setIsSaved(false);
      console.log("unsaved" + post.id);
    } else {
      save({
        relevantId: post.id,
        type: "POST",
      });
      setIsSaved(true);
      console.log("saved" + post.id);
    }
  };

  const shareClickHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post!",
          text: "This is an interesting post I found.",
          url: "http://localhost:3000/share/post/" + post.id,
        })
        .then(() => console.log("Share successful"))
        .catch((error) => console.error("Share failed:", error));
    } else {
      alert("Web Share API not supported in this browser.");
    }
  };

  const [isViewLikedUsersModelOpen, setIsViewLikedUsersModelOpen] =
    useState(false);
  const viewLikedUsersButtonClickHandler = () => {
    setIsViewLikedUsersModelOpen(true);
  };
  const closeViewLikedUsersModal = () => {
    setIsViewLikedUsersModelOpen(false);
  };

  return (
    <div className="bg-white dark:bg-black shadow-md mx-auto mb-6 p-3 sm:p-4 rounded-lg w-full max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.userId}`}>
            <img
              src={post.profilePictureUrl}
              alt={`${post.fullname}'s profile`}
              className="rounded-full w-10 h-10 object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <p className="font-semibold text-md sm:text-lg">{post.fullname}</p>
            <p className="flex sm:flex-row flex-col items-start sm:items-center space-x-1 text-gray-500 text-sm whitespace-nowrap">
              <span>@{post.username}</span>
              <span className="hidden sm:block">•</span>
              <TimeAgo
                date={post.createdAt}
                className="pt-1 sm:pt-0 font-medium sm:text-md text-xs whitespace-nowrap"
              />
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isMyProfilePosts && (
            <button
              className="flex items-center space-x-1 hover:text-red-500 hover:scale-110 transition duration-200 transform"
              onClick={openDeleteModal}
            >
              <DeleteOutlineOutlinedIcon className="text-gray-600 hover:text-red-500 cursor-pointer" />
            </button>
          )}

          {!isMyPost &&
            (isReported ? (
              <ReportIcon
                className="text-red-500 transition duration-200 cursor-not-allowed transform"
                title="This post has already been reported"
              />
            ) : (
              <ReportGmailerrorredIcon
                className="text-gray-600 hover:text-red-500 hover:scale-110 transition duration-200 cursor-pointer transform"
                onClick={openReportModal}
                title="Report this post"
              />
            ))}

          {isSaved ? (
            <BookmarkSharpIcon
              className="text-yellow-600 hover:scale-110 transition duration-200 cursor-pointer transform"
              onClick={saveClickHandler}
              title="Unsave this post"
            />
          ) : (
            <BookmarkBorderOutlinedIcon
              className="text-gray-600 hover:text-yellow-600 hover:scale-110 transition duration-200 cursor-pointer transform"
              onClick={saveClickHandler}
              title="Save this post"
            />
          )}
        </div>
      </div>

      <div className="mb-4 w-full">
        <p className="px-2 w-full text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {post.imageUrl && (
        <div className="mb-4 w-full h-full">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="rounded-md w-full h-auto max-h-[90dvh] object-contain"
          />
        </div>
      )}
      {post.videoUrl && (
        <div className="mb-4 w-full h-full">
          <video
            src={post.videoUrl}
            controls
            className="rounded-md w-full h-auto max-h-[90dvh] object-contain"
          />
        </div>
      )}

      <div className="flex justify-between items-center text-gray-500">
        <div className="flex items-center space-x-5 ml-2 w-full">
          <button
            className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
            onClick={likeClickHandler}
          >
            {isLiked ? (
              <FavoriteSharpIcon className="w-5 h-5 text-red-600 transition-colors duration-200" />
            ) : (
              <FavoriteBorderSharpIcon className="group-hover:text-red-600 w-5 h-5 text-gray-500 transition-colors duration-200" />
            )}
            <span className="group-hover:text-red-500 font-medium text-sm">
              {likesCount}
            </span>
          </button>

          {isMyProfilePosts && (
            <button
              className="group relative flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
              onClick={viewLikedUsersButtonClickHandler}
            >
              <PersonOutline className="group-hover:text-blue-600 w-5 h-5 scale-110 transition-colors duration-200" />
              <span className="-top-8 left-1/2 absolute bg-gray-800 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs whitespace-nowrap transition -translate-x-1/2 duration-200">
                View Liked Users
              </span>
            </button>
          )}

          {post?.isCommentsDisabled === true ? (
            <button className="flex items-center space-x-2 cursor-not-allowed">
              <CommentsDisabled
                sx={{
                  fontSize: { xs: 21, sm: 23, md: 25 },
                }}
                className="w-5 sm:w-6 h-5 sm:h-6"
              />
              <span className="font-medium text-xs sm:text-sm">0</span>
            </button>
          ) : (
            <button
              className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
              onClick={openCommentModel}
            >
              <CommentOutlinedIcon className="group-hover:text-blue-500 w-5 h-5 text-gray-500 transition-colors duration-200" />
              <span className="group-hover:text-blue-500 font-medium text-sm">
                {commentCount}
              </span>
            </button>
          )}

          {post?.isPrivate === false && (
            <button
              className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
              onClick={shareClickHandler}
            >
              <ShareSharpIcon className="group-hover:text-green-500 w-5 h-5 text-gray-500 transition-colors duration-200" />
              <span className="group-hover:text-green-500 text-xs">Share</span>
            </button>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="POST"
      />
      <ReportConfirmationModal
        isOpen={isReportModalOpen}
        closeModal={closeReportModal}
        report={confirmReport}
        isReporting={isReporting}
        type="POST"
      />
      {isMyProfilePosts && (
        <ViewLikedUsersModel
          isOpen={isViewLikedUsersModelOpen}
          closeModal={closeViewLikedUsersModal}
          relevantId={post?.id}
          type="POST"
        />
      )}

      {post?.isCommentsDisabled !== true && (
        <CommentModel
          isOpen={isCommentModelOpen}
          onClose={closeCommentModel}
          type={"POST"}
          relevantId={post.id}
          updateCommentCount={setCommentCount}
          commentCount={commentCount}
        />
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    videoUrl: PropTypes.string,
    likeStatus: PropTypes.string.isRequired,
    reportStatus: PropTypes.string.isRequired,
    saveStatus: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    commentsCount: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    isCommentsDisabled: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  removePost: PropTypes.func.isRequired,
  isMyProfilePosts: PropTypes.bool.isRequired,
};

export default Post;
