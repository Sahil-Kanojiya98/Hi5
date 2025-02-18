import ReelUploadModal from "./ReelUploadModel";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios.config";
import { useNavigate } from "react-router-dom";
import Reel from "./Reel";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const Reels = ({ feedType, userId = "", isMyProfileReels = false }) => {
  const user = useSelector((state) => state.user.profile);

  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const getReelEndpoint = () => {
    switch ({ feedType, userId }) {
      case "Random":
        return `/reel`;
      default:
        return `/reel`;
    }
  };

  const fetchReels = async () => {
    try {
      const endpoint = getReelEndpoint();
      const response = await axiosInstance.get(endpoint);
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setReels((prevReels) => [...prevReels, ...response.data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setReels([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, [feedType, userId]);

  useEffect(() => {
    fetchReels();
  }, [page, feedType, userId]);

  const loadMoreReels = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreReels();
        }
      },
      { threshold: 0 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMoreReels]);

  const removeReel = (reelId) => {
    setReels((prevReels) => {
      console.log(prevReels);
      const newReels = prevReels.filter((post) => post.id !== reelId);
      console.log(newReels);
      return newReels;
    });
  };

  const navigate = useNavigate();
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    console.log(isMuted);
  };

  const [isReelCreateModelOpen, setIsReelCreateModelOpen] = useState(false);

  const createReelModelOpenHandler = () => {
    setIsReelCreateModelOpen(true);
  };

  return (
    <>
      <div
        id="video-container"
        className="bg-white dark:bg-black mt-14 md:mt-0 w-full max-w-md h-[87dvh] md:h-screen overflow-scroll snap-mandatory snap-y hide-scrollbar"
      >
        {!isLoading && reels.length > 0 && (
          <>
            {reels.map((reel) => (
              <Reel
                key={reel.id}
                reel={reel}
                handleBackClick={handleBackClick}
                createReelModelOpenHandler={createReelModelOpenHandler}
                isMuted={isMuted}
                toggleMute={toggleMute}
                authUserId={user.id}
                removeReel={removeReel}
                isMyProfileReels={isMyProfileReels}
              />
            ))}
            {!isLoading && error === null && (
              <div
                ref={loaderRef}
                className="flex justify-center items-center h-16 text-white"
              >
                Loading more...
              </div>
            )}
            {!isLoading && error !== null && (
              <div
                ref={loaderRef}
                className="flex justify-center items-center h-16 text-white"
              >
                Something error occured.
              </div>
            )}
          </>
        )}
      </div>
      <ReelUploadModal
        isOpen={isReelCreateModelOpen}
        onClose={() => {
          setIsReelCreateModelOpen(false);
        }}
      />
    </>
  );
};

Reels.propTypes = {
  feedType: PropTypes.string.isRequired,
  userId: PropTypes.string,
  isMyProfileReels: PropTypes.bool,
};

export default Reels;
