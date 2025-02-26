import { useCallback, useEffect, useState } from "react";
import Story from "./Story";
import {
  CameraAlt,
  ChevronLeft,
  ChevronRight,
  Favorite,
  Close,
  DeleteOutline,
} from "@mui/icons-material";
import DeleteConfirmationModal from "../../temp/DeleteConfirmationModal";
import axiosInstance from "../../../services/axios.config";
import { deleteStory, getMyStorys } from "../../../services/api";
import { StoryCreatedToast as displayStoryCreatedToast } from "../../providers/ToastProvider.jsx";
import MyStorySkeleton from "../../skeletons/MyStorySkeleton.jsx";

const Stories = () => {
  const uStorys = [
    {
      id: 1,
      fullname: "Raju Shrinivasa",
      profilePictureUrl: "/resource/user/profileImage/default.png",
      data: [
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
      ],
    },
    {
      id: 2,
      fullname: "shree hari",
      profilePictureUrl: "/resource/user/profileImage/default.png",
      data: [
        {
          isImage: true,
          media: "https://picsum.photos/id/1/200/300",
        },
        {
          isImage: false,
          media: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
      ],
    },
    {
      id: 3,
      fullname: "Hello World",
      profilePictureUrl: "/resource/user/profileImage/default.png",
      data: [
        {
          isImage: true,
          media: "https://picsum.photos/id/1/200/300",
        },
      ],
    },
  ];

  const [myStorys, setMyStorys] = useState([
    {
      newStoryModel: true,
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await getMyStorys();
      setMyStorys([
        ...response.data,
        {
          newStoryModel: true,
        },
      ]);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const [userStorys, setUserStorys] = useState(uStorys);

  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleCreateStoryModelOpen = () => {
    setCurrentIndex(0);
    setIsPending(false);
    setIsError(null);
    setIsCreateStoryModalOpen(true);
  };
  const handleCreateStoryModelClose = useCallback(() => {
    setCurrentIndex(0);
    setIsCreateStoryModalOpen(false);
  }, [setCurrentIndex, setIsCreateStoryModalOpen]);

  // const nextImage = () => {
  //   setCurrentIndex((prevIndex) => {
  //     if (prevIndex === myStorys.length - 1) {
  //       handleCreateStoryModelClose();
  //       setCurrentIndex(0);
  //     }
  //     return prevIndex < myStorys.length - 1 ? prevIndex + 1 : prevIndex;
  //   });
  // };

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === myStorys.length - 1) {
        handleCreateStoryModelClose();
        setCurrentIndex(0);
      }
      return prevIndex < myStorys.length - 1 ? prevIndex + 1 : prevIndex;
    });
  }, [myStorys.length, handleCreateStoryModelClose]);

  const previousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCreateStoryModelClose();
      }
    };
    if (isCreateStoryModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isCreateStoryModalOpen, handleCreateStoryModelClose]);

  useEffect(() => {
    let timer;
    if (isCreateStoryModalOpen) {
      timer = setInterval(() => {
        if (currentIndex < myStorys.length - 1) {
          nextImage();
        }
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isCreateStoryModalOpen, nextImage, myStorys, currentIndex]);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const objectUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleCreateStory = async () => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    if (file) {
      if (file.type.startsWith("image/")) {
        formData.append("image", file);
      } else if (file.type.startsWith("video/")) {
        formData.append("video", file);
      }
    }
    try {
      const response = await axiosInstance.post("/story", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      console.log("Story created:", response.data);
      setFile(null);
      setPreviewUrl("");
      handleCreateStoryModelClose();
      setIsLoading(true);
      fetchStories();
      displayStoryCreatedToast();
    } catch (error) {
      setIsError(error);
      console.error("Error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStory(myStorys[currentIndex].id);
      console.log("Story deleted");
      setCurrentIndex(0);
      handleCreateStoryModelClose();
    } catch (error) {
      console.error("Error deleting story: ", error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  return (
    <>
      <div className="flex gap-4 bg-white shadow-md p-4 rounded-md w-full max-w-xl overflow-x-auto hide-scrollbar">
        {isLoading ? (
          <MyStorySkeleton />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div
              className="flex justify-center items-center border-2 border-blue-500 rounded-full w-16 h-16 overflow-hidden"
              onClick={handleCreateStoryModelOpen}
            >
              <CameraAlt className="text-blue-500 text-2xl" />
            </div>
            <p className="mt-2 w-20 text-gray-700 text-sm truncate">My Story</p>
          </div>
        )}

        {userStorys.map((story) => (
          <Story key={story.id} story={story} />
        ))}
      </div>

      {isCreateStoryModalOpen && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 transition-all">
          <button
            onClick={handleCreateStoryModelClose}
            className="top-4 right-4 z-10 fixed bg-gray-500 p-2 rounded-full text-white"
          >
            <Close className="text-2xl" />
          </button>

          <div className="relative flex flex-col justify-center items-center bg-white shadow-lg rounded-md w-full max-w-md h-screen">
            <div className="top-7 sm:top-0 left-0 absolute flex gap-1 px-4 pt-2 w-full">
              {myStorys.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-md transition-all ${
                    index <= currentIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            {currentIndex < myStorys.length - 1 && (
              <button
                className="top-6 right-1 absolute flex items-center space-x-1 px-4 pt-2 hover:text-red-500 hover:scale-110 transition duration-200 transform"
                onClick={openDeleteModal}
              >
                <DeleteOutline
                  sx={{
                    fontSize: { xs: 25, sm: 28, md: 30 },
                  }}
                  className="text-gray-600 hover:text-red-500 cursor-pointer"
                />
              </button>
            )}

            {currentIndex < myStorys.length - 1 &&
              (myStorys[currentIndex]?.imageUrl ? (
                <img
                  src={myStorys[currentIndex]?.imageUrl}
                  alt={`Story image ${currentIndex + 1}`}
                  className="mb-4 rounded-md w-full object-contain"
                />
              ) : (
                <video
                  src={myStorys[currentIndex]?.videoUrl}
                  autoPlay
                  className="mb-4 rounded-md w-full object-contain"
                />
              ))}

            {currentIndex === myStorys.length - 1 && (
              <>
                {file === null && <p>no file is selected</p>}
                {file?.type?.startsWith("image/") && (
                  <img
                    src={previewUrl}
                    alt={`Story image ${currentIndex + 1}`}
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
                  {currentIndex < myStorys.length - 1 && (
                    <button
                      onClick={() => alert("Like clicked!")}
                      className="flex items-center gap-2 bg-transparent hover:bg-red-500 hover:bg-opacity-70 p-3 rounded-lg text-white hover:text-white text-xl transition-all"
                    >
                      <Favorite />
                      <span>{myStorys[currentIndex]?.likeCount}</span>
                    </button>
                  )}
                  {currentIndex === myStorys.length - 1 && (
                    <>
                      <label className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 p-3 rounded-lg text-white transition-all cursor-pointer">
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
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 p-3 rounded-lg text-white transition-all cursor-pointer"
                      >
                        Create Story
                      </button>
                    </>
                  )}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default Stories;
