import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  follow,
  getSharedPost,
  getSharedPostWithoutAuth,
  getSharedReel,
  getSharedReelWithoutAuth,
  likeEntity,
  reportEntity,
  save,
  unfollow,
  unlikeEntity,
  unsave,
} from "../services/api";
import {
  BookmarkBorderOutlined,
  BookmarkSharp,
  CheckCircle,
  CommentOutlined,
  CommentsDisabled,
  DarkMode,
  FavoriteBorderSharp,
  FavoriteSharp,
  HourglassEmpty,
  LightMode,
  PersonAdd,
  Report,
  ReportGmailerrorred,
  ShareSharp,
  VolumeOffOutlined,
  VolumeUpOutlined,
} from "@mui/icons-material";
import logo from "../assets/images/logo/hi5.svg";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import TimeAgo from "../components/temp/TimeAgo";
import ReportConfirmationModal from "../components/temp/ReportConfirmationModal";
import CommentModel from "../components/comment/CommentModel";

const SharedMediaPage = () => {
  const { entity, entityId } = useParams();

  const [entityData, setEntityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const user = useSelector((state) => state.user.profile);

  useEffect(() => {
    const fetchEntity = async () => {
      if (!entityId || entityId.trim() === "") {
        setError("Invalid ID provided.");
        setIsLoading(false);
        return;
      }
      if (entity === "post") {
        try {
          setIsLoading(true);
          if (isAuthenticated) {
            const response = await getSharedPost(entityId);
            setEntityData(response.data);
            setData(response.data);
          } else {
            const response = await getSharedPostWithoutAuth(entityId);
            setEntityData(response.data);
            setData(response.data);
          }
        } catch (err) {
          if (err?.response?.data?.statusCode === 400) {
            console.log("error set");
            setError(err?.response?.data?.message);
          } else {
            setError("Failed to load post. Please try again later.");
          }
        } finally {
          setIsLoading(false);
        }
      } else if (entity === "reel") {
        try {
          setIsLoading(true);
          if (isAuthenticated) {
            const response = await getSharedReel(entityId);
            setEntityData(response.data);
            setData(response.data);
          } else {
            const response = await getSharedReelWithoutAuth(entityId);
            setEntityData(response.data);
            setData(response.data);
          }
        } catch (err) {
          console.log(err);
          setError("Failed to load post. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Invalid entity type.");
        setIsLoading(false);
        return;
      }
    };
    if (!isInitializing) {
      fetchEntity();
    }
  }, [entity, entityId, isAuthenticated, isInitializing]);

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const changeThemeClickHandler = () => {
    dispatch(toggleTheme());
  };

  const [isMyEntity, setIsMyEntity] = useState(entityData?.userId === user?.id);

  const navigate = useNavigate();
  const setData = useCallback(
    (data) => {
      setEntityData(data);
      setIsMyEntity(data?.userId === user?.id);
      setIsReported(data?.reportStatus === "REPORTED");
      setIsLiked(data?.likeStatus === "LIKED");
      setLikesCount(data?.likesCount);
      setCommentCount(data?.commentsCount);
      setIsSaved(data?.saveStatus === "SAVED");
      if (data?.followStatus) {
        setFollowStatus(data?.followStatus);
      }
    },
    [user]
  );

  const [commentCount, setCommentCount] = useState(entityData?.commentsCount);
  const [isCommentModelOpen, setIsCommentModelOpen] = useState(false);
  const openCommentModel = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsCommentModelOpen(true);
  };
  const closeCommentModel = () => {
    setIsCommentModelOpen(false);
  };

  const [isReported, setIsReported] = useState(
    entityData?.reportStatus === "REPORTED"
  );
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModal] = useState(false);
  const openReportModal = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsReportModal(true);
  };
  const closeReportModal = () => setIsReportModal(false);
  const confirmReport = useCallback(
    async (reportReason) => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      setIsReporting(true);
      try {
        await reportEntity({
          relevantId: entityData?.id,
          reason: reportReason,
          type: entity.toUpperCase(),
        });
        console.log(
          "Entity reported: " + entityData?.id + "  reason: " + reportReason
        );
      } catch (error) {
        console.error("Error reporting post: ", error);
      } finally {
        setIsReporting(false);
        setIsReported(true);
        closeReportModal();
      }
    },
    [isAuthenticated, navigate, entityData, entity, closeReportModal]
  );

  const [isLiked, setIsLiked] = useState(entityData?.likeStatus === "LIKED");
  const [likesCount, setLikesCount] = useState(entityData?.likesCount);
  const likeClickHandler = useCallback(async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const id = entityData?.id;
    if (isLiked) {
      unlikeEntity({
        relevantId: id,
        type: entity.toUpperCase(),
      });
      setLikesCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      console.log("unliked " + id);
    } else {
      likeEntity({
        relevantId: id,
        type: entity.toUpperCase(),
      });
      setLikesCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      console.log("liked " + id);
    }
  }, [isAuthenticated, navigate, isLiked, entityData, entity]);

  const [isSaved, setIsSaved] = useState(entityData?.saveStatus === "SAVED");
  const saveClickHandler = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const id = entityData?.id;
    if (isSaved) {
      unsave({
        relevantId: id,
        type: entity.toUpperCase(),
      });
      setIsSaved(false);
      console.log("unsaved " + id);
    } else {
      save({
        relevantId: id,
        type: entity.toUpperCase(),
      });
      setIsSaved(true);
      console.log("saved " + id);
    }
  }, [isAuthenticated, navigate, isSaved, entityData, entity]);

  const shareClickHandler = () => {
    if (navigator?.share) {
      navigator
        .share({
          title: "Check out this post!",
          text: "This is an interesting post I found.",
          url: `http://localhost:3000/share/${entity}/${entityId}`,
        })
        .then(() => console.log("Share successful"))
        .catch((error) => console.error("Share failed:", error));
    } else {
      alert("Web Share API not supported in this browser.");
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

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

  const [followStatus, setFollowStatus] = useState(entityData?.followStatus);

  const followStatusClickHandler = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (followStatus === "FOLLOWED") {
      try {
        const response = await unfollow(entityData?.userId);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === "NOT_FOLLOWED") {
      try {
        const response = await follow(entityData?.userId);
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

  if (isInitializing) {
    return null;
  }

  return (
    <>
      <header className="bg-white dark:bg-black shadow-md p-4">
        <div className="flex justify-between items-center mx-auto container">
          <Link to="/" className="flex justify-center items-center gap-3">
            <img src={logo} alt="Hi5 Logo" className="w-10" />
            <p className="hidden md:hidden sm:block lg:block font-lobster text-4xl">
              Hi5
            </p>
          </Link>
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex justify-center items-center gap-2 sm:gap-3">
              {!isAuthenticated && (
                <>
                  <Link to="/login">
                    <button className="bg-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 dark:bg-gray-800 shadow-md px-2 sm:px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition">
                      Login
                    </button>
                  </Link>

                  <Link to="/signup">
                    <button className="bg-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 dark:bg-gray-800 shadow-md px-2 sm:px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition">
                      SignUp
                    </button>
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={changeThemeClickHandler}
              className="flex justify-center items-center bg-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 dark:bg-gray-800 shadow-md rounded-full w-10 h-10 text-gray-600 dark:text-gray-300 transition"
            >
              {theme === "dark" ? (
                <LightMode className="w-5 h-5 text-yellow-500" />
              ) : (
                <DarkMode className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {isAuthenticated && (
              <div className="flex justify-center items-center lg:gap-2">
                <Link to={isAuthenticated ? `/profile/${user.id}` : "/login"}>
                  <img
                    src={user.profilePictureUrl}
                    alt={`${user.username}'s profile image`}
                    className="rounded-full w-8 lg:w-10 h-8 lg:h-10"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex justify-center items-center space-x-2 pt-5 min-h-[calc(100dvh-80px)]">
        {isLoading && (
          <>
            <div className="border-4 border-t-transparent border-blue-500 rounded-full w-5 h-5 animate-spin"></div>
            <p className="font-semibold text-blue-600 text-lg">
              {entity === "post" && "Loading post, please wait..."}
              {entity === "reel" && "Loading reel, please wait..."}
            </p>
          </>
        )}
        {error && (
          <div className="shadow-xl px-5 py-2 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}
        {!isLoading && !error && entity == "post" && entityData && (
          <>
            <div className="bg-white dark:bg-black shadow-md mx-auto mb-6 p-3 sm:p-4 rounded-lg w-full max-w-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <Link
                    to={
                      isAuthenticated
                        ? `/profile/${entityData.userId}`
                        : "/login"
                    }
                  >
                    <img
                      src={entityData.profilePictureUrl}
                      alt={`${entityData.fullname}'s profile`}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p className="font-semibold text-md sm:text-lg">
                      {entityData.fullname}
                    </p>
                    <p className="flex sm:flex-row flex-col items-start sm:items-center space-x-1 text-gray-500 text-sm whitespace-nowrap">
                      <span>@{entityData.username}</span>
                      <span className="hidden sm:block">•</span>
                      <TimeAgo
                        date={entityData.createdAt}
                        className="pt-1 sm:pt-0 font-medium sm:text-md text-xs whitespace-nowrap"
                      />
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {!isMyEntity &&
                    (isReported ? (
                      <Report
                        className="text-red-500 transition duration-200 cursor-not-allowed transform"
                        title="This post has already been reported"
                      />
                    ) : (
                      <ReportGmailerrorred
                        className="text-gray-600 hover:text-red-500 hover:scale-110 transition duration-200 cursor-pointer transform"
                        onClick={openReportModal}
                        title="Report this post"
                      />
                    ))}

                  {isSaved ? (
                    <BookmarkSharp
                      className="text-yellow-600 hover:scale-110 transition duration-200 cursor-pointer transform"
                      onClick={saveClickHandler}
                      title="Unsave this post"
                    />
                  ) : (
                    <BookmarkBorderOutlined
                      className="text-gray-600 hover:text-yellow-600 hover:scale-110 transition duration-200 cursor-pointer transform"
                      onClick={saveClickHandler}
                      title="Save this post"
                    />
                  )}
                </div>
              </div>

              <div className="mb-4 w-full">
                <p className="px-2 w-full text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words whitespace-pre-wrap">
                  {entityData.content}
                </p>
              </div>

              {entityData.imageUrl && (
                <div className="mb-4 w-full h-full">
                  <img
                    src={entityData.imageUrl}
                    alt="Post content"
                    className="rounded-md w-full h-auto max-h-[90dvh] object-contain"
                  />
                </div>
              )}
              {entityData.videoUrl && (
                <div className="mb-4 w-full h-full">
                  <video
                    src={entityData.videoUrl}
                    controls
                    className="rounded-md w-full h-auto max-h-[90dvh] object-contain"
                  />
                </div>
              )}

              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center space-x-5 ml-2">
                  <button
                    className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                    onClick={likeClickHandler}
                  >
                    {isLiked ? (
                      <FavoriteSharp className="w-5 h-5 text-red-600 transition-colors duration-200" />
                    ) : (
                      <FavoriteBorderSharp className="group-hover:text-red-600 w-5 h-5 text-gray-500 transition-colors duration-200" />
                    )}
                    <span className="group-hover:text-red-500 font-medium text-sm">
                      {likesCount}
                    </span>
                  </button>

                  {entityData?.isCommentsDisabled === true ? (
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
                    <button className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform">
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

                  <button
                    className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                    onClick={shareClickHandler}
                  >
                    <ShareSharp className="group-hover:text-green-500 w-5 h-5 text-gray-500 transition-colors duration-200" />
                    <span className="group-hover:text-green-500 text-xs">
                      Share
                    </span>
                  </button>
                </div>
              </div>

              <ReportConfirmationModal
                isOpen={isReportModalOpen}
                closeModal={closeReportModal}
                report={confirmReport}
                isReporting={isReporting}
                type={entity.toUpperCase()}
              />
              {isAuthenticated && entityData?.isCommentsDisabled !== true && (
                <>
                  <CommentModel
                    isOpen={isCommentModelOpen}
                    onClose={closeCommentModel}
                    type={entity.toUpperCase()}
                    relevantId={entityId}
                    updateCommentCount={setCommentCount}
                    commentCount={commentCount}
                  />
                </>
              )}
            </div>
          </>
        )}
        {!isLoading && !error && entity == "reel" && (
          <>
            <div
              id="video-container"
              className="bg-white dark:bg-black w-full max-w-md h-[87dvh] md:h-screen overflow-scroll snap-mandatory snap-y hide-scrollbar"
            >
              <div className="relative w-full h-full snap-start">
                <div className="top-0 left-1/2 z-10 absolute flex justify-center items-center bg-white/15 dark:bg-black/20 mt-6 sm:mt-4 md:mt-2 lg:mt-4 mb-3 p-2 px-4 sm:px-5 md:px-6 lg:px-7 rounded-lg w-full text-black dark:text-white text-xs -translate-x-1/2 transform">
                  <p className="font-bold text-lg text-center">Reels</p>
                </div>

                <video
                  className="w-full h-full object-cover"
                  poster={entityData.thumbnailUrl}
                  src={entityData.videoUrl}
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  onClick={handleClick}
                />

                <div
                  className="right-14 bottom-40 absolute flex flex-col justify-center items-center bg-black dark:bg-white textfrom-white bg-opacity-15 p-2 rounded-full text-white cursor-pointer"
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
                    <span className="font-medium text-xs sm:text-sm">
                      {likesCount}
                    </span>
                  </button>

                  {entityData?.isCommentsDisabled === true ? (
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

                  {!isMyEntity &&
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
                    <div className="flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4">
                      <Link
                        to={
                          isAuthenticated
                            ? `/profile/${entityData.userId}`
                            : "/login"
                        }
                        className="flex-shrink-0 w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14"
                      >
                        <img
                          src={entityData.profilePictureUrl}
                          alt={`${entityData.username}'s profile image`}
                          className="shadow-md border-2 border-gray-800 dark:border-gray-200 rounded-full w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="flex flex-col text-black dark:text-white">
                        <span className="font-semibold text-sm sm:text-lg md:text-lg truncate">
                          {entityData.fullname}
                        </span>
                        <span className="flex sm:flex-row flex-col flex-wrap gap-1 text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">
                          <span>@{entityData.username}</span>
                          <TimeAgo date={entityData.createdAt} />
                        </span>
                      </div>
                    </div>

                    {!isMyEntity && (
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

                  <div className="pt-2 w-full">
                    <p
                      className={`w-full text-black dark:text-white text-xs sm:text-sm ${
                        expanded ? "" : "line-clamp-1"
                      }`}
                    >
                      {entityData.description}
                    </p>
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="float-end mt-1 text-blue-500 text-xs sm:text-sm"
                    >
                      {expanded ? "See Less" : "See More"}
                    </button>
                  </div>
                </div>

                <ReportConfirmationModal
                  isOpen={isReportModalOpen}
                  closeModal={closeReportModal}
                  report={confirmReport}
                  isReporting={isReporting}
                  type={entity.toUpperCase()}
                />

                {isAuthenticated && entityData?.isCommentsDisabled !== true && (
                  <>
                    <CommentModel
                      isOpen={isCommentModelOpen}
                      onClose={closeCommentModel}
                      type={entity.toUpperCase()}
                      relevantId={entityId}
                      updateCommentCount={setCommentCount}
                      commentCount={commentCount}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SharedMediaPage;
