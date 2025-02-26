import PropTypes from "prop-types";
import {
  ChevronLeft,
  ChevronRight,
  Favorite,
  Send,
  Close,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

const Story = ({ story }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStoryClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === story.data.length - 1) {
        handleModalClose();
        setCurrentIndex(0);
      }
      return prevIndex < story.data.length - 1 ? prevIndex + 1 : prevIndex;
    });
  };

  const previousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleModalClose();
      }
    };
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  useEffect(() => {
    let timer;
    if (isModalOpen) {
      timer = setInterval(nextImage, 5000);
    }
    return () => clearInterval(timer);
  }, [isModalOpen]);

  return (
    <>
      <div
        className="flex flex-col items-center text-center cursor-pointer"
        onClick={handleStoryClick}
      >
        <div className="border-2 border-blue-500 rounded-full w-16 h-16 overflow-hidden">
          <img
            src={story.profilePictureUrl}
            alt={`${story.fullname}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-2 w-20 text-gray-700 text-sm truncate">
          {story.fullname}
        </p>
      </div>
      {isModalOpen && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 transition-all">
          <button
            onClick={handleModalClose}
            className="top-4 right-4 z-10 fixed bg-gray-500 p-2 rounded-full text-white"
          >
            <Close className="text-2xl" />
          </button>

          <div className="relative flex flex-col justify-center items-center bg-white shadow-lg rounded-md w-full max-w-md h-screen">
            <div className="top-7 sm:top-0 left-0 absolute flex gap-1 px-4 pt-2 w-full">
              {story.data.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-md transition-all ${
                    index <= currentIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            {story.data[currentIndex]?.isImage ? (
              <img
                src={story.data[currentIndex]?.media}
                alt={`Story image ${currentIndex + 1}`}
                className="mb-4 rounded-md w-full object-contain"
              />
            ) : (
              <video
                src={story.data[currentIndex]?.media}
                autoPlay
                className="mb-4 rounded-md w-full object-contain"
              />
            )}

            <div className="bottom-8 absolute px-4 py-2 w-full">
              <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 shadow-lg px-2 py-2 rounded-xl">
                <div className="flex items-center bg-gray-600 bg-opacity-80 px-4 py-2 rounded-xl w-full sm:max-w-md h-12">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    className="flex-grow bg-transparent opacity-100 px-4 py-2 rounded-lg focus:outline-none w-full text-white placeholder-gray-400"
                  />

                  <button
                    onClick={() => alert("Send clicked!")}
                    className="flex items-center bg-transparent hover:bg-blue-500 hover:bg-opacity-70 ml-2 px-4 py-2 rounded-lg text-white hover:text-white transition-all"
                  >
                    <Send />
                  </button>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => alert("Like clicked!")}
                    className="flex items-center bg-transparent hover:bg-red-500 hover:bg-opacity-70 p-3 rounded-lg text-white hover:text-white text-xl transition-all"
                  >
                    <Favorite />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={previousImage}
              className="top-1/2 left-2 absolute bg-gray-400 hover:bg-gray-700 opacity-50 shadow-lg p-3 rounded-full text-white -translate-y-1/2 transform"
              aria-label="Previous Story"
            >
              <ChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={nextImage}
              className="top-1/2 right-2 absolute bg-gray-400 hover:bg-gray-700 opacity-50 shadow-lg p-3 rounded-full text-white -translate-y-1/2 transform"
              aria-label="Next Story"
            >
              <ChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

Story.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        isImage: PropTypes.bool.isRequired,
        media: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Story;
