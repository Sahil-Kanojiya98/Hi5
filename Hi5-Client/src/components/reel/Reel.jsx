import {
  PersonAdd,
  CheckCircle,
  HourglassEmpty,
  DeleteOutlineOutlined,
  ArrowBackSharp,
  AddCircleOutlineOutlined,
  ReportGmailerrorred,
  Report,
  BookmarkBorderOutlined,
  BookmarkSharp,
  ShareSharp,
  CommentOutlined,
  CommentsDisabled,
  FavoriteBorderSharp,
  FavoriteSharp,
  VolumeOffOutlined,
  VolumeUpOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import TimeAgo from "../temp/TimeAgo";
import DeleteConfirmationModal from "../temp/DeleteConfirmationModal";
import ReportConfirmationModal from "../temp/ReportConfirmationModal";
import {
  deleteReel,
  follow,
  likeEntity,
  reportEntity,
  save,
  unfollow,
  unlikeEntity,
  unsave,
} from "../../services/api";
import CommentModel from "../comment/CommentModel";
import { useSelector } from "react-redux";
import ViewLikedUsersModel from "../temp/ViewLikedUsersModel";

const Reel = ({
  reel,
  handleBackClick,
  createReelModelOpenHandler,
  isMuted,
  toggleMute,
  removeReel,
  isMyProfileReels,
  showBackButton,
  showCreateReelButton,
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

  const followStatusClickHandler = async () => {
    console.log(followStatus);
    if (followStatus === "FOLLOWED") {
      try {
        const response = await unfollow(reel.userId);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === "NOT_FOLLOWED") {
      try {
        const response = await follow(reel.userId);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === "REQUEST_SENT") {
      console.log("already request sent");
    } else {
      console.log("Invalid Status");
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

  const [isViewLikedUsersModelOpen, setIsViewLikedUsersModelOpen] =
    useState(false);
  const viewLikedUsersButtonClickHandler = () => {
    setIsViewLikedUsersModelOpen(true);
  };
  const closeViewLikedUsersModal = () => {
    setIsViewLikedUsersModelOpen(false);
  };

  return (
    <div className="relative flex w-full h-full snap-start">
      {/* <div className="top-0 left-1/2 z-10 absolute flex justify-between items-center bg-white/15 dark:bg-black/20 mt-6 sm:mt-4 md:mt-2 lg:mt-4 mb-3 p-2 px-4 sm:px-5 md:px-6 lg:px-7 rounded-lg w-full text-black dark:text-white text-xs -translate-x-1/2 transform">
      
        {showBackButton && (
          <span onClick={handleBackClick} className="mx-2 p-2 cursor-pointer">
            <ArrowBackSharp
              sx={{
                fontSize: { xs: 23, sm: 25, md: 27 },
              }}
            />
          </span>
        )}

        <h3 className="font-bold text-lg select-none">Reels</h3>

        {showCreateReelButton && (
          <span
            className="mx-2 p-2 text-black dark:text-white cursor-pointer"
            onClick={createReelModelOpenHandler}
          >
            <AddCircleOutlineOutlined
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
            <DeleteOutlineOutlined />
          </button>
        )}
      </div> */}

      <div className="top-0 left-1/2 z-10 absolute flex justify-between items-center bg-white/15 dark:bg-black/20 mt-6 sm:mt-4 md:mt-2 lg:mt-4 mb-3 p-2 px-4 sm:px-5 md:px-6 lg:px-7 rounded-lg w-full text-black dark:text-white text-xs -translate-x-1/2 transform">
        <div className="flex items-center w-1/3">
          {showBackButton && (
            <span onClick={handleBackClick} className="mx-2 p-2 cursor-pointer">
              <ArrowBackSharp sx={{ fontSize: { xs: 23, sm: 25, md: 27 } }} />
            </span>
          )}
        </div>

        <div className="flex justify-center w-1/3">
          <h3 className="font-bold text-lg select-none">Reels</h3>
        </div>

        <div className="flex justify-end space-x-2 w-1/3">
          {showCreateReelButton && (
            <span
              className="mx-2 p-2 text-black dark:text-white cursor-pointer"
              onClick={createReelModelOpenHandler}
            >
              <AddCircleOutlineOutlined
                sx={{ fontSize: { xs: 23, sm: 25, md: 27 } }}
              />
            </span>
          )}
          {isMyProfileReels && (
            <button
              className="flex items-center space-x-1 text-black hover:text-red-500 dark:text-white hover:scale-110 transition duration-200 cursor-pointer transform"
              onClick={openDeleteModal}
            >
              <DeleteOutlineOutlined />
            </button>
          )}
        </div>
      </div>

      <video
        className="flex-1 w-full object-cover"
        src={reel.videoUrl}
        // muted={isMuted}
        autoPlay
        ref={videoRef}
        loop
        onClick={handleClick}
      />
      <div
        className="right-14 bottom-40 absolute flex flex-col justify-center items-center bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-20 p-2 rounded-full text-white cursor-pointer textfrom-white"
        onClick={toggleMute}
      >
        {isMuted ? (
          <VolumeOffOutlined
            sx={{
              fontSize: { xs: 21, sm: 23, md: 25 },
            }}
          />
        ) : (
          <VolumeUpOutlined
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
            <FavoriteSharp
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 text-red-600 transition-colors duration-200"
            />
          ) : (
            <FavoriteBorderSharp
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 hover:text-red-600 transition-colors duration-200"
            />
          )}
          <span className="font-medium text-xs sm:text-sm">{likesCount}</span>
        </button>

        {isMyProfileReels && (
          <button
            className="group relative flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
            onClick={viewLikedUsersButtonClickHandler}
          >
            <PersonOutline className="w-5 h-5 group-hover:text-blue-600 scale-110 transition-colors duration-200" />
            <span className="-top-8 -left-9 absolute bg-gray-800 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs whitespace-nowrap transition -translate-x-1/2 duration-200">
              View Liked Users
            </span>
          </button>
        )}

        {reel?.isCommentsDisabled === true ? (
          <button className="flex flex-col items-center space-y-1 cursor-not-allowed">
            <CommentsDisabled
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6"
            />
            <span className="font-medium text-xs sm:text-sm">0</span>
          </button>
        ) : (
          <button className="group flex flex-col items-center space-y-2 hover:scale-110 transition duration-200 transform">
            <CommentOutlined
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 hover:text-blue-500 transition-colors duration-200"
              onClick={openCommentModel}
            />
            <span className="font-medium text-xs sm:text-sm">
              {commentCount}
            </span>
          </button>
        )}

        {reel?.isPrivate === false && (
          <button
            className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
            onClick={shareClickHandler}
          >
            <ShareSharp
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 hover:text-green-500 transition-colors duration-200"
            />
          </button>
        )}
        <button
          className="group flex flex-col items-center space-y-2 hover:scale-110 transition duration-200 transform"
          onClick={saveClickHandler}
        >
          {isSaved ? (
            <BookmarkSharp
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600 transition-colors duration-200"
            />
          ) : (
            <BookmarkBorderOutlined
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="w-5 sm:w-6 h-5 sm:h-6 hover:text-yellow-600 transition-colors duration-200"
            />
          )}
        </button>

        {!isMyReel &&
          (isReported ? (
            <Report
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="text-red-500 transition duration-200 cursor-not-allowed transform"
              title="This post has already been reported"
            />
          ) : (
            <ReportGmailerrorred
              sx={{
                fontSize: { xs: 21, sm: 23, md: 25 },
              }}
              className="hover:text-red-500 hover:scale-110 transition duration-200 cursor-pointer transform"
              onClick={openReportModal}
              title="Report this post"
            />
          ))}
      </div>
      <div className="bottom-8 left-1/2 z-10 absolute flex flex-col justify-between items-center bg-white/15 dark:bg-black/20 p-2 px-3 sm:px-5 md:px-6 lg:px-7 rounded-lg w-full text-white dark:text-black text-xs -translate-x-1/2 transform">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-x-1 sm:gap-x-2 md:gap-x-3">
            <Link
              to={`/profile/${reel.userId}`}
              className="flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12"
            >
              <img
                src={reel.profilePictureUrl}
                alt={`${reel.username}'s profile image`}
                className="rounded-full w-full h-full object-cover"
              />
            </Link>
            <div className="flex flex-col text-black dark:text-white">
              <span className="font-semibold text-sm sm:text-lg md:text-lg truncate">
                {reel.fullname}
              </span>
              <span className="flex sm:flex-row flex-col flex-wrap gap-1 text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">
                <span>@{reel.username}</span>
                <TimeAgo date={reel.createdAt} />
              </span>
            </div>
          </div>

          {/* Follow/Unfollow Button */}
          {!isMyReel && (
            <button
              onClick={followStatusClickHandler}
              className={`flex items-center gap-2 min-[410px]:px-4  px-2 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md
                  ${
                    followStatus === "FOLLOWED"
                      ? "bg-green-500 hover:bg-green-600"
                      : ""
                  }
                  ${
                    followStatus === "NOT_FOLLOWED"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : ""
                  }
                  ${
                    followStatus === "REQUEST_SENT"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : ""
                  }
              `}
            >
              {followStatus === "FOLLOWED" && (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="hidden md:inline">Following</span>
                </>
              )}
              {followStatus === "NOT_FOLLOWED" && (
                <>
                  <PersonAdd className="w-5 h-5 text-white" />
                  <span className="hidden md:inline">Follow</span>
                </>
              )}
              {followStatus === "REQUEST_SENT" && (
                <>
                  <HourglassEmpty className="w-5 h-5 text-white" />
                  <span className="hidden md:inline">Requested</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Description Section */}
        <div className="pt-2 w-full">
          <p
            className={`w-full text-black dark:text-white text-xs sm:text-sm ${
              expanded ? "" : "line-clamp-1"
            }`}
          >
            {reel.description}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="float-end mt-1 text-blue-500 text-xs sm:text-sm"
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
        type="REEL"
      />
      <ReportConfirmationModal
        isOpen={isReportModalOpen}
        closeModal={closeReportModal}
        report={confirmReport}
        isReporting={isReporting}
        type="REEL"
      />

      {isMyProfileReels && (
        <ViewLikedUsersModel
          isOpen={isViewLikedUsersModelOpen}
          closeModal={closeViewLikedUsersModal}
          relevantId={reel?.id}
          type="REEL"
        />
      )}

      {reel?.isCommentsDisabled !== true && (
        <CommentModel
          isOpen={isCommentModelOpen}
          onClose={closeCommentModel}
          type={"REEL"}
          relevantId={reel.id}
          updateCommentCount={setCommentCount}
          commentCount={commentCount}
          isMyProfileEntity={isMyProfileReels}
        />
      )}
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
    likeStatus: PropTypes.string.isRequired,
    reportStatus: PropTypes.string.isRequired,
    saveStatus: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    followStatus: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    isCommentsDisabled: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
  }),
  handleBackClick: PropTypes.func.isRequired,
  createReelModelOpenHandler: PropTypes.func.isRequired,
  isMuted: PropTypes.bool.isRequired,
  toggleMute: PropTypes.func.isRequired,
  authUserId: PropTypes.string.isRequired,
  removeReel: PropTypes.func.isRequired,
  isMyProfileReels: PropTypes.bool.isRequired,
  showBackButton: PropTypes.bool.isRequired,
  showCreateReelButton: PropTypes.bool.isRequired,
};

export default Reel;
