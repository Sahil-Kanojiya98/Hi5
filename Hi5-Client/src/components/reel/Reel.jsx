import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import ShareSharpIcon from "@mui/icons-material/ShareSharp";
import BookmarkSharpIcon from "@mui/icons-material/BookmarkSharp";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ReportIcon from "@mui/icons-material/Report";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import TimeAgo from "../temp/TimeAgo";
import DeleteConfirmationModal from "../temp/DeleteConfirmationModal";
import ReportConfirmationModal from "../temp/ReportConfirmationModal";
import {
  deleteReel,
  likeEntity,
  reportEntity,
  save,
  unlikeEntity,
  unsave,
} from "../../services/api";
import CommentModel from "../comment/CommentModel";
import { useSelector } from "react-redux";

const Reel = ({
  reel,
  handleBackClick,
  createReelModelOpenHandler,
  isMuted,
  toggleMute,
  removeReel,
  isMyProfileReels,
}) => {
  const user = useSelector((state) => state.user.profile);
  const isMyReel = reel.userId === user.id;

  const [isCommentModelOpen, setIsCommentModelOpen] = useState(false);
  const openCommentModel = () => {
    setIsCommentModelOpen(true);
  };
  const closeCommentModel = () => {
    setIsCommentModelOpen(false);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = isMuted;
    }
  }, [isMuted]);

  const [followStatus, setFollowStatus] = useState(reel.followStatus);
  const followUnfollowClick = () => {
    if (followStatus === "FOLLOW") {
      console.log(followStatus);
    } else if (followStatus === "UNFOLLOW") {
      console.log(followStatus);
    } else {
      console.log(followStatus);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReel(reel.id);
      console.log("Reel deleted: " + reel.id);
      removeReel(reel.id);
    } catch (error) {
      console.error("Error deleting reel: ", error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const [isReported, setIsReported] = useState(
    reel.reportStatus === "REPORTED"
  );
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModal] = useState(false);
  const openReportModal = () => setIsReportModal(true);
  const closeReportModal = () => setIsReportModal(false);
  const confirmReport = async (reportReason) => {
    setIsReporting(true);
    try {
      await reportEntity({
        relevantId: reel.id,
        reason: reportReason,
        type: "REEL",
      });
      console.log("Reel reported: " + reel.id + "  reason: " + reportReason);
      // removePost(post.id);
    } catch (error) {
      console.error("Error reporting reel: ", error);
    } finally {
      setIsReporting(false);
      setIsReported(true);
      closeReportModal();
    }
  };

  const [isLiked, setIsLiked] = useState(reel.likeStatus === "LIKED");
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const likeClickHandler = async () => {
    if (isLiked) {
      unlikeEntity({
        relevantId: reel.id,
        type: "REEL",
      });
      setLikesCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      console.log("unliked" + reel.id);
    } else {
      likeEntity({
        relevantId: reel.id,
        type: "REEL",
      });
      setLikesCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      console.log("liked" + reel.id);
    }
  };

  const [commentCount, setCommentCount] = useState(reel.commentsCount);

  const [isSaved, setIsSaved] = useState(reel.saveStatus === "SAVED");
  const saveClickHandler = () => {
    if (isSaved) {
      unsave({
        relevantId: reel.id,
        type: "REEL",
      });
      setIsSaved(false);
      console.log("unsaved" + reel.id);
    } else {
      save({
        relevantId: reel.id,
        type: "REEL",
      });
      setIsSaved(true);
      console.log("saved" + reel.id);
    }
  };

  const shareClickHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post!",
          text: "This is an interesting post I found.",
          url: "http://localhost:3000/share/reel/" + reel.id,
        })
        .then(() => console.log("Share successful"))
        .catch((error) => console.error("Share failed:", error));
    } else {
      alert("Web Share API not supported in this browser.");
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleVisibilityChange = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoElement.play();
          setIsPlaying(true);
        } else {
          videoElement.pause();
          setIsPlaying(false);
        }
      });
    };
    const observer = new IntersectionObserver(handleVisibilityChange, {
      threshold: 0.7,
    });
    if (videoElement) {
      observer.observe(videoElement);
    }
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  const handleClick = () => {
    const videoElement = videoRef.current;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative w-full h-full snap-start">
      <div className="top-0 left-1/2 z-10 absolute flex justify-between items-center mt-6 sm:mt-4 md:mt-2 lg:mt-4 mb-3 px-4 sm:px-5 md:px-6 lg:px-7 w-full text-black dark:text-white -translate-x-1/2 transform">
        <span onClick={handleBackClick} className="mx-2 p-2 cursor-pointer">
          <ArrowBackSharpIcon
            sx={{
              fontSize: { xs: 23, sm: 25, md: 27 },
            }}
          />
        </span>

        <h3 className="font-bold text-lg">Reels</h3>

        {!isMyProfileReels && (
          <span
            className="mx-2 p-2 text-black dark:text-white cursor-pointer"
            onClick={createReelModelOpenHandler}
          >
            <AddCircleOutlineOutlinedIcon
              sx={{
                fontSize: { xs: 23, sm: 25, md: 27 },
              }}
            />
          </span>
        )}
        {isMyProfileReels && (
          <button
            className="flex items-center space-x-1 text-black hover:text-red-500 dark:text-white hover:scale-110 transition duration-200 cursor-pointer transform"
            onClick={openDeleteModal}
          >
            <DeleteOutlineOutlinedIcon />
          </button>
        )}
      </div>

      <video
        className="w-full h-full object-cover"
        poster={reel.thumbnailUrl}
        src={reel.videoUrl}
        // muted={isMuted}
        autoPlay
        ref={videoRef}
        loop
        onClick={handleClick}
      />

      <div
        className="right-14 bottom-40 absolute flex flex-col justify-center items-center bg-black dark:bg-white textfrom-white bg-opacity-15 p-2 rounded-full text-white cursor-pointer"
        onClick={toggleMute}
      >
        {isMuted ? (
          <VolumeOffOutlinedIcon
            sx={{
              fontSize: { xs: 21, sm: 23, md: 25 },
            }}
          />
        ) : (
          <VolumeUpOutlinedIcon
            sx={{
              fontSize: { xs: 21, sm: 23, md: 25 },
            }}
          />
        )}
      </div>

      <div className="top-1/2 right-4 sm:right-5 absolute flex flex-col items-center sm:gap-2 md:gap-3 lg:gap-4 space-y-6 text-white -translate-y-1/2 transform">
        <button
          className="group flex flex-col items-center space-y-2 hover:scale-110 transition duration-200 transform"
          onClick={likeClickHandler}
        >
          {isLiked ? (
            <FavoriteSharpIcon
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 text-red-600 transition-colors duration-200"
            />
          ) : (
            <FavoriteBorderSharpIcon
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 hover:text-red-600 transition-colors duration-200"
            />
          )}
          <span className="font-medium text-xs sm:text-sm">{likesCount}</span>
        </button>
        <button className="group flex flex-col items-center space-y-2 hover:scale-110 transition duration-200 transform">
          <CommentOutlinedIcon
            sx={{
              fontSize: { xs: 21, sm: 23, md: 25 },
            }}
            className="w-5 sm:w-6 h-5 sm:h-6 hover:text-blue-500 transition-colors duration-200"
            onClick={openCommentModel}
          />
          <span className="font-medium text-xs sm:text-sm">{commentCount}</span>
        </button>
        <button
          className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
          onClick={shareClickHandler}
        >
          <ShareSharpIcon
            sx={{
              fontSize: { xs: 21, sm: 23, md: 25 },
            }}
            className="w-5 sm:w-6 h-5 sm:h-6 hover:text-green-500 transition-colors duration-200"
          />
        </button>
        <button
          className="group flex flex-col items-center space-y-2 hover:scale-110 transition duration-200 transform"
          onClick={saveClickHandler}
        >
          {isSaved ? (
            <BookmarkSharpIcon
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600 transition-colors duration-200"
            />
          ) : (
            <BookmarkBorderOutlinedIcon
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 hover:text-yellow-600 transition-colors duration-200"
            />
          )}
        </button>

        {!isMyReel &&
          (isReported ? (
            <ReportIcon
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="text-red-500 transition duration-200 cursor-not-allowed transform"
              title="This post has already been reported"
            />
          ) : (
            <ReportGmailerrorredIcon
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="hover:text-red-500 hover:scale-110 transition duration-200 cursor-pointer transform"
              onClick={openReportModal}
              title="Report this post"
            />
          ))}
      </div>

      <div className="bottom-8 left-1/2 z-10 absolute flex flex-col justify-between items-center bg-white/10 dark:bg-black/20 shadow-lg backdrop-blur-sm p-2 px-4 sm:px-5 md:px-6 lg:px-7 rounded-lg w-full text-white dark:text-black text-xs -translate-x-1/2 transform">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 md:gap-x-4">
            <Link to={`/profile/${reel.userId}`}>
              <img
                src={reel.profilePictureUrl}
                alt={`${reel.username}'s profile image`}
                className="shadow-md border-2 border-gray-800 dark:border-gray-200 rounded-full w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 hover:scale-110 transition-transform duration-300"
              />
            </Link>
            <div className="flex flex-col text-black dark:text-white">
              <span className="w-full font-semibold text-sm sm:text-lg md:text-lg truncate">
                {reel.fullname}
              </span>
              <span className="flex sm:flex-row flex-col gap-1 sm:gap-2 md:gap-4 lg:gap-6 w-full text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">
                <span>@{reel.username}</span>
                <TimeAgo date={reel.createdAt} />
              </span>
            </div>
          </div>

          {!isMyReel && (
            <button
              disabled={followStatus === "REQUEST_SENT"}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition duration-300
                shadow-md ${
                  followStatus === "REQUEST_SENT"
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              onClick={followUnfollowClick}
            >
              {followStatus === "FOLLOW"
                ? "Unfollow"
                : followStatus === "REQUEST_SENT"
                ? "Request Sent"
                : "Follow"}
            </button>
          )}
        </div>
        <div className="pt-2 w-full">
          <p
            className={`w-full text-black dark:text-white text-xs ${
              expanded ? "" : "line-clamp-1"
            }`}
          >
            {reel.description}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="float-end mt-1 text-blue-500 text-xs"
          >
            {expanded ? "See Less" : "See More"}
          </button>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />

      <ReportConfirmationModal
        isOpen={isReportModalOpen}
        closeModal={closeReportModal}
        reportPost={confirmReport}
        isReporting={isReporting}
      />

      <CommentModel
        isOpen={isCommentModelOpen}
        onClose={closeCommentModel}
        type={"REEL"}
        relevantId={reel.id}
        updateCommentCount={setCommentCount}
        commentCount={commentCount}
      />
    </div>
  );
};

Reel.propTypes = {
  reel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    videoUrl: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    likeStatus: PropTypes.string.isRequired,
    reportStatus: PropTypes.string.isRequired,
    saveStatus: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    followStatus: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  handleBackClick: PropTypes.func.isRequired,
  createReelModelOpenHandler: PropTypes.func.isRequired,
  isMuted: PropTypes.bool.isRequired,
  toggleMute: PropTypes.func.isRequired,
  authUserId: PropTypes.string.isRequired,
  removeReel: PropTypes.func.isRequired,
  isMyProfileReels: PropTypes.bool.isRequired,
};

export default Reel;
