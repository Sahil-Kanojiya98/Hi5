import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import TimeAgo from "../temp/TimeAgo";
import {
  FavoriteSharp as LikedIcon,
  FavoriteBorderSharp as UnlikedIcon,
  Report as ReportedIcon,
  ReportGmailerrorred as ReportIcon,
  DeleteOutlineOutlined as DeleteIcon,
} from "@mui/icons-material";
import {
  deleteComment,
  likeEntity,
  reportEntity,
  unlikeEntity,
} from "../../services/api";
import DeleteConfirmationModal from "../temp/DeleteConfirmationModal";
import ReportConfirmationModal from "../temp/ReportConfirmationModal";

const Comment = ({ comment, removeComment }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      console.log("comment deleted: " + comment.id);
      removeComment(comment.id);
    } catch (error) {
      console.error("Error deleting post: ", error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [isLiked, setIsLiked] = useState(comment.likeStatus === "LIKED");

  const likeClickHandler = async () => {
    if (isLiked) {
      unlikeEntity({
        relevantId: comment.id,
        type: "COMMENT",
      });
      setLikesCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      console.log("unliked" + comment.id);
    } else {
      likeEntity({
        relevantId: comment.id,
        type: "COMMENT",
      });
      setLikesCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      console.log("liked" + comment.id);
    }
  };

  const [isReported, setIsReported] = useState(
    comment.reportStatus === "REPORTED"
  );
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModal] = useState(false);
  const openReportModal = () => setIsReportModal(true);
  const closeReportModal = () => setIsReportModal(false);
  const confirmReport = async (reportReason) => {
    setIsReporting(true);
    try {
      await reportEntity({
        relevantId: comment.id,
        reason: reportReason,
        type: "COMMENT",
      });
      console.log(
        "Comment reported: " + comment.id + "  reason: " + reportReason
      );
      // removePost(post.id);
    } catch (error) {
      console.error("Error reporting comment: ", error);
    } finally {
      setIsReporting(false);
      setIsReported(true);
      closeReportModal();
    }
  };

  const user = useSelector((state) => state.user.profile);
  const isMyComment = comment.userId === user.id;

  return (
    <div className="flex flex-col justify-between items-start mb-6 p-3 border-gray-200 border-b">
      <div className="flex items-center space-x-4">
        <img
          src={comment.profilePictureUrl}
          alt={`${comment.fullname}'s profile`}
          className="border border-gray-300 rounded-full w-12 h-12 object-cover"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-lg">{comment.fullname}</p>
          <p className="flex items-center space-x-1 text-gray-500 text-sm">
            <span>@{comment.username}</span>
            <span className="hidden sm:inline">•</span>
            <TimeAgo
              date={comment.createdAt}
              className="font-medium text-xs sm:text-sm"
            />
          </p>
        </div>
      </div>

      <div className="px-3 py-2 text-gray-800 leading-relaxed">
        {comment.content}
      </div>

      <div className="flex items-center space-x-3 sm:space-x-5">
        <button
          className="group flex items-center space-x-2 hover:scale-105 transition duration-200"
          onClick={likeClickHandler}
        >
          {isLiked ? (
            <LikedIcon className="w-5 h-5 text-red-600 transition-colors duration-200" />
          ) : (
            <UnlikedIcon className="group-hover:text-red-600 w-5 h-5 text-gray-500 transition-colors duration-200" />
          )}
          <span className="group-hover:text-red-500 font-medium text-sm">
            {likesCount}
          </span>
        </button>

        {isMyComment && (
          <button
            className="flex items-center hover:text-red-500 hover:scale-105 transition duration-200"
            onClick={openDeleteModal}
          >
            <DeleteIcon className="text-gray-600 hover:text-red-500 cursor-pointer" />
          </button>
        )}

        {!isMyComment &&
          (isReported ? (
            <ReportedIcon
              className="text-red-500 transition duration-200 cursor-not-allowed transform"
              title="This comment has already been reported"
            />
          ) : (
            <ReportIcon
              className="text-gray-600 hover:text-red-500 hover:scale-105 transition duration-200 cursor-pointer transform"
              onClick={openReportModal}
              title="Report this comment"
            />
          ))}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="COMMENT"
      />
      <ReportConfirmationModal
        isOpen={isReportModalOpen}
        closeModal={closeReportModal}
        reportPost={confirmReport}
        isReporting={isReporting}
        type="COMMENT"
      />
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    likeStatus: PropTypes.string,
    reportStatus: PropTypes.string,
  }).isRequired,
  removeComment: PropTypes.func.isRequired,
};

export default Comment;
