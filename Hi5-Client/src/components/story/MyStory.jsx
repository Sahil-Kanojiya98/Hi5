import { DeleteOutline, Favorite, Visibility } from "@mui/icons-material"
import PropTypes from "prop-types";
import { useState } from "react";
import StoryViewUsersModal from "./StoryViewUsersModal";

const MyStory = ({ index, currentIndex, story, myStorys, openDeleteModal, file, previewUrl, isPending, uploadProgress, isError, handleFileChange, handleCreateStory, setIsAnyModelIsOpen }) => {

  const [isLikedUsersModalOpen, setIsLikedUsersModalOpen] = useState(false);
  const openLikedUsersModal = () => {
    setIsAnyModelIsOpen(true);
    setIsLikedUsersModalOpen(true);
  }
  const closeLikedUsersModal = () => {
    setIsAnyModelIsOpen(false);
    setIsLikedUsersModalOpen(false);
  }
  const [isViewedUsersModalOpen, setIsViewedUsersModalOpen] = useState(false);
  const openViewedUsersModal = () => {
    setIsAnyModelIsOpen(true);
    setIsViewedUsersModalOpen(true);
  }
  const closeViewedUsersModal = () => {
    setIsAnyModelIsOpen(false);
    setIsViewedUsersModalOpen(false);
  }

  return (
    <div className={`relative ${index === currentIndex ? "block" : "hidden"} w-full h-full flex justify-center items-center`}>

      <div className="top-7 sm:top-0 left-0 absolute flex gap-1 px-4 pt-2 w-full">
        {myStorys.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-md transition-all ${index <= currentIndex ? "bg-blue-500" : "bg-gray-300"}`}
          ></div>
        ))}
      </div>

      {currentIndex < myStorys.length - 1 && (
        <button
          className="top-16 sm:top-6 right-1 z-50 absolute flex items-center space-x-1 px-4 pt-2 hover:text-red-500 hover:scale-110 transition duration-200 transform"
          onClick={openDeleteModal}
        >
          <DeleteOutline
            sx={{ fontSize: { xs: 25, sm: 28, md: 30 } }}
            className="text-gray-600 hover:text-red-500 cursor-pointer"
          />
        </button>
      )}

      {!story?.newStoryModel ? (
        story?.imageUrl ? (
          <img
            src={story.imageUrl}
            alt={`Story image ${index + 1}`}
            className="mb-4 rounded-md w-full object-contain"
          />
        ) : (
          <video
            src={story.videoUrl}
            autoPlay
            className="mb-4 rounded-md w-full object-contain"
          />
        )
      ) : (
        <>
          {file === null && <p className="text-center">No file is selected</p>}
          {file?.type?.startsWith("image/") && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mb-4 rounded-md w-full object-contain"
            />
          )}
          {file?.type?.startsWith("video/") && (
            <video
              src={previewUrl}
              autoPlay
              className="mb-4 rounded-md w-full object-contain"
            />
          )}
        </>
      )}

      <div className="bottom-8 absolute px-4 py-2 w-full">
        <div className="flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 shadow-lg py-2 rounded-xl">

          {isPending && (
            <div className="px-2 pb-3 w-full">
              <div className="bg-gray-200 rounded-full w-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {isError && (
            <div className="px-2 pb-3 w-full">
              <div className="mt-2 text-red-500 text-sm text-center">
                {isError?.message}
              </div>
            </div>
          )}

          <div className="flex justify-center items-center space-x-2">
            {!story.newStoryModel ? (
              <>
                <div className="flex items-center gap-1 bg-gray-700 bg-opacity-60 hover:shadow-md px-3 py-2 rounded-lg text-white hover:scale-105 transition cursor-pointer transform" onClick={openLikedUsersModal}>
                  <Favorite className="text-red-500" />
                  <span className="text-sm">{story.likeCount}</span>
                </div>

                <div className="flex items-center gap-1 bg-gray-700 bg-opacity-60 hover:shadow-md px-3 py-2 rounded-lg text-white hover:scale-105 transition cursor-pointer transform" onClick={openViewedUsersModal}>
                  <Visibility className="text-blue-400" />
                  <span className="text-sm">{story.viewCount}</span>
                </div>
              </>
            ) : (
              <>
                <label className="flex items-center gap-1 bg-gray-700 bg-opacity-60 hover:shadow-md px-3 py-2 rounded-lg text-white hover:scale-105 transition cursor-pointer transform">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                  <span>Upload</span>
                </label>
                <button
                  onClick={handleCreateStory}
                  className="flex items-center gap-1 bg-gray-700 bg-opacity-60 hover:shadow-md px-3 py-2 rounded-lg text-white hover:scale-105 transition cursor-pointer transform"
                >
                  Create Story
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {isLikedUsersModalOpen && (
        <StoryViewUsersModal
          isOpen={isLikedUsersModalOpen}
          closeModal={closeLikedUsersModal}
          storyId={story.id}
          type="STORY_LIKES"
        />
      )}
      {isViewedUsersModalOpen && (
        <StoryViewUsersModal
          isOpen={isViewedUsersModalOpen}
          closeModal={closeViewedUsersModal}
          storyId={story.id}
          type="STORY_VIEWS"
        />
      )}
    </div>
  )
}

MyStory.propTypes = {
  index: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired,
  story: PropTypes.shape({
    id: PropTypes.string.isRequired,
    newStoryModel: PropTypes.bool,
    imageUrl: PropTypes.string,
    videoUrl: PropTypes.string,
    likeCount: PropTypes.number,
    viewCount: PropTypes.number,
  }).isRequired,
  myStorys: PropTypes.arrayOf(PropTypes.object).isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  file: PropTypes.object,
  previewUrl: PropTypes.string,
  isPending: PropTypes.bool,
  uploadProgress: PropTypes.number,
  isError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      message: PropTypes.string,
    }),
  ]),
  handleFileChange: PropTypes.func?.isRequired,
  handleCreateStory: PropTypes.func?.isRequired,
  setIsAnyModelIsOpen: PropTypes.func?.isRequired,
};

export default MyStory