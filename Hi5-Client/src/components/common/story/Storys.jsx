import {
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Stories = () => {
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const userStorys = [
    {
      isImage: true,
      media: "https://picsum.photos/id/1/200/300",
    },
    {
      isImage: true,
      media: "https://picsum.photos/id/2/200/300",
    },
    {
      isImage: true,
      media: "https://picsum.photos/id/3/200/300",
    },
    {
      isImage: true,
      media: "https://picsum.photos/id/4/200/300",
    },
    {
      isImage: false,
      media: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
    setCurrentImageIndex(0);
  };

  const handleCreateStoryModelOpen = () => {
    setIsCreateStoryModalOpen(true);
  };

  const handleCreateStoryModelClose = () => {
    setIsCreateStoryModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex === userStorys.length - 1) {
        handleModalClose();
      }
      return prevIndex < userStorys.length - 1 ? prevIndex + 1 : prevIndex;
    });
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
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

  const [storyPreview, setStoryPreview] = useState(null);
  const [isImage, setIsImage] = useState(true);

  const handleStoryFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isImageFile = file.type.startsWith("image/");
      setIsImage(isImageFile);
      const fileURL = URL.createObjectURL(file);
      setStoryPreview(fileURL);
    }
  };

  const handleCreateStorySubmit = (e) => {
    e.preventDefault();

    if (!storyPreview) {
      alert("Please upload a file to create a story!");
      return;
    }

    console.log({
      file: storyPreview,
    });

    alert("Story created successfully!");
    handleCreateStoryModelClose(); // Close modal
  };

  return (
    <>
      <div className="flex gap-4 bg-white shadow-md p-4 rounded-md w-full overflow-x-auto hide-scrollbar">
        <div className="flex flex-col items-center text-center">
          <div
            className="flex justify-center items-center border-2 border-blue-500 rounded-full w-16 h-16 overflow-hidden"
            onClick={handleCreateStoryModelOpen}
          >
            <FaCamera className="text-2xl text-blue-500" />
          </div>
          <p className="mt-2 w-20 text-gray-700 text-sm truncate">Your Name</p>
        </div>

        {stories.map((story) => (
          <Story
            key={story.id}
            story={story}
            onClickHandler={handleStoryClick}
          />
        ))}
      </div>

      {/* Modal for Viewing Story Images */}
      {isModalOpen && selectedStory && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 transition-all">
          {/* Close Button */}
          <button
            onClick={handleModalClose}
            className="top-4 right-4 z-10 fixed bg-gray-500 p-2 rounded-full text-white"
            aria-label="Close Modal"
          >
            <FaTimes className="text-2xl" />
          </button>

          <div className="relative flex flex-col justify-center items-center bg-white shadow-lg rounded-md w-full max-w-md h-screen">
            <div className="top-7 sm:top-0 left-0 absolute flex gap-1 px-4 pt-2 w-full">
              {userStorys.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-md transition-all ${
                    index <= currentImageIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            {userStorys[currentImageIndex]?.isImage ? (
              <img
                src={userStorys[currentImageIndex]?.media}
                alt={`Story image ${currentImageIndex + 1}`}
                className="mb-4 rounded-md w-full object-contain"
              />
            ) : (
              <video
                src={userStorys[currentImageIndex]?.media}
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
                    className="flex-grow bg-transparent opacity-100 px-4 py-2 rounded-lg w-full text-white focus:outline-none placeholder-gray-400"
                  />

                  <button
                    onClick={() => alert("Send clicked!")}
                    className="flex items-center bg-transparent hover:bg-blue-500 hover:bg-opacity-70 ml-2 px-4 py-2 rounded-lg text-white hover:text-white transition-all"
                  >
                    <FaPaperPlane />
                  </button>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => alert("Like clicked!")}
                    className="flex items-center bg-transparent hover:bg-red-500 hover:bg-opacity-70 p-3 rounded-lg text-white text-xl hover:text-white transition-all"
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={previousImage}
              className="top-1/2 left-2 absolute bg-gray-400 hover:bg-gray-700 opacity-50 shadow-lg p-3 rounded-full text-white transform -translate-y-1/2"
              aria-label="Previous Story"
            >
              <FaChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={nextImage}
              className="top-1/2 right-2 absolute bg-gray-400 hover:bg-gray-700 opacity-50 shadow-lg p-3 rounded-full text-white transform -translate-y-1/2"
              aria-label="Next Story"
            >
              <FaChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      )}

      {isCreateStoryModalOpen && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 transition-all">
          <div className="relative bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
            {/* Close Button */}
            <button
              onClick={handleCreateStoryModelClose}
              className="top-4 right-4 absolute bg-gray-500 p-2 rounded-full text-white"
              aria-label="Close Modal"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Modal Header */}
            <h2 className="mb-4 font-bold text-gray-800 text-xl">
              Create Your Story
            </h2>

            {/* Story Input */}
            <form onSubmit={handleCreateStorySubmit}>
              {/* File Upload */}
              <div className="mb-4">
                <label
                  htmlFor="story-file"
                  className="block mb-2 font-medium text-gray-600 text-sm"
                >
                  Upload an Image or Video
                </label>
                <input
                  type="file"
                  id="story-file"
                  accept="image/*,video/*"
                  className="border-gray-300 p-2 border rounded-lg w-full cursor-pointer"
                  onChange={handleStoryFileChange}
                />
              </div>

              {/* File Preview */}
              {storyPreview && (
                <div className="mb-4">
                  {isImage ? (
                    <img
                      src={storyPreview}
                      alt="Story Preview"
                      className="rounded-lg w-full object-cover"
                    />
                  ) : (
                    <video
                      src={storyPreview}
                      controls
                      className="rounded-lg w-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg w-full text-white transition-all"
              >
                Post Story
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

function Story({ story, onClickHandler }) {
  return (
    <div
      className="flex flex-col items-center text-center cursor-pointer"
      onClick={() => onClickHandler(story)}
    >
      <div className="border-2 border-blue-500 rounded-full w-16 h-16 overflow-hidden">
        <img
          src={story.profileImage}
          alt={`${story.username}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-2 w-20 text-gray-700 text-sm truncate">
        {story.username}
      </p>
    </div>
  );
}

Story.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    profileImage: PropTypes.string.isRequired,
  }).isRequired,
  onClickHandler: PropTypes.func.isRequired,
};

const stories = [
  {
    id: 1,
    username: "sahilkanojiya_sureshbhai",
    profileImage: "/profileImage/default.png",
  },
  {
    id: 2,
    username: "user2",
    profileImage: "/profileImage/default.png",
  },
  {
    id: 3,
    username: "user3",
    profileImage: "/profileImage/default.png",
  },
];

export default Stories;
