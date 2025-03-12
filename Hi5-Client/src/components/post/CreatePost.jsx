import { useRef, useState, useEffect } from "react";
import axiosInstance from "../../services/axios.config.js";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { useSelector } from "react-redux";
import ReelUploadModal from "../reel/ReelUploadModel.jsx";
import { PostCreatedToast as displayPostCreatedToast } from "../providers/ToastProvider.jsx";
import { Link } from "react-router-dom";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const fileRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState(null);

  const [isReelModalOpen, setIsReelModalOpen] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);
  const [disableComments, setDisableComments] = useState(false);

  useEffect(() => {
    return () => {
      if (fileURL) {
        URL.revokeObjectURL(fileURL);
      }
    };
  }, [fileURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationError) {
      return;
    }

    if (file === null && !text.trim()) {
      return;
    }

    setIsPending(true);
    setIsError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("content", text);
    formData.append("isPrivate", isPrivate);
    formData.append("isCommentsDisabled", disableComments);
    if (file) {
      if (file.type.startsWith("image/")) {
        formData.append("image", file);
      } else if (file.type.startsWith("video/")) {
        formData.append("video", file);
      }
    }

    try {
      const response = await axiosInstance.post("/post", formData, {
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
      console.log("Post created:", response.data);
      setText("");
      setFile(null);
      setFileURL(null);

      setIsPrivate(false);
      setDisableComments(false);

      displayPostCreatedToast();

      fileRef.current.value = null;
    } catch (error) {
      setIsError(error);
      console.error("Error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileType = selectedFile.type;
    const fileSize = selectedFile.size;

    // image size should not bigger then the 20MB
    if (fileType.startsWith("image/") && fileSize > 20 * 1024 * 1024) {
      setValidationError(
        "The selected image exceeds the maximum file size of 20MB."
      );
    } else {
      setValidationError(null);
    }

    // video size should not be bigger then 1GB
    if (fileType.startsWith("video/") && fileSize > 1024 * 1024 * 1024) {
      setValidationError(
        "The selected video exceeds the maximum file size of 1GB."
      );
    } else {
      setValidationError(null);
    }

    // video should not be bigger then 5 minutes
    if (fileType.startsWith("video/")) {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.src = URL.createObjectURL(selectedFile);
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 5 * 60) {
          setValidationError(
            "The selected video exceeds the maximum length of 5 minutes."
          );
        }
      };
    } else {
      setValidationError(null);
    }

    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    }
  };

  const renderFilePreview = () => {
    if (!file || !fileURL) return null;
    if (validationError) return null;

    if (file.type.startsWith("image/")) {
      return (
        <div className="w-full text-gray-500 text-lg">
          <div className="relative mx-auto w-full">
            <CloseRoundedIcon
              className="top-0 right-0 z-10 absolute rounded-full w-6 h-6 cursor-pointer"
              onClick={() => {
                setFile(null);
                setFileURL(null);
                fileRef.current.value = null;
              }}
            />
            <img
              src={fileURL}
              className="mx-auto rounded-lg w-full h-auto max-h-[calc(100vh-250px)] object-contain"
              alt="Preview"
            />
          </div>
        </div>
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <div className="w-full text-gray-500 text-lg">
          <div className="relative mx-auto w-full">
            <CloseRoundedIcon
              sx={{
                fontSize: { xs: 25, sm: 28, md: 30 },
              }}
              className="top-0 right-0 z-10 absolute rounded-full cursor-pointer"
              onClick={() => {
                setFile(null);
                setFileURL(null);
                fileRef.current.value = null;
              }}
            />
            <video
              src={fileURL}
              controls
              className="mx-auto rounded-lg w-full h-auto max-h-[calc(100vh-250px)] object-contain"
              controlsList="nodownload"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const user = useSelector((state) => state.user.profile);

  return (
    <div className="flex items-start gap-3 bg-white dark:bg-black shadow-lg mt-4 mb-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-xl">
      <Link
        to={`/profile/${user?.id}`}
        className="flex-shrink-0 shadow-md mt-2 rounded-full w-10 h-10 overflow-hidden cursor-pointer"
      >
        <img
          alt="Profile"
          src={user?.profilePictureUrl}
          className="w-full h-full object-cover aspect-square"
          loading="lazy"
        />
      </Link>

      <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit}>
        <textarea
          className="bg-gray-100 dark:bg-gray-900 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none w-full min-h-[85px] text-sm resize-none"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {validationError && (
          <p className="text-red-500 text-sm">{validationError}</p>
        )}

        {renderFilePreview()}

        <div className="flex flex-wrap items-center gap-4 bg-gray-100 dark:bg-gray-900 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          <div
            className="flex items-center gap-2 font-medium text-sm transition-all duration-300 cursor-pointer"
            onClick={() => setIsPrivate(!isPrivate)}
          >
            {isPrivate ? (
              <CheckBox
                fontSize="medium"
                className={`${
                  isPrivate
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            ) : (
              <CheckBoxOutlineBlank
                fontSize="medium"
                className={`${
                  isPrivate
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            )}
            <span className="select-none">Private Post</span>
          </div>

          <div
            className="flex items-center gap-2 font-medium text-sm transition-all duration-300 cursor-pointer"
            onClick={() => setDisableComments(!disableComments)}
          >
            {disableComments ? (
              <CheckBox
                fontSize="medium"
                className={`${
                  disableComments
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            ) : (
              <CheckBoxOutlineBlank
                fontSize="medium"
                className={`${
                  disableComments
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            )}
            <span className="select-none">Disable Comments</span>
          </div>
        </div>

        {isPending && (
          <div className="relative bg-gray-300 rounded-full w-full h-2">
            <div
              className="top-0 left-0 absolute bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-1">
          <div className="flex items-center gap-1 sm:gap-3">
            <ImageRoundedIcon
              sx={{ fontSize: 30 }}
              className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
              onClick={() => {
                fileRef.current.accept = "image/*";
                fileRef.current.click();
              }}
            />
            <VideocamRoundedIcon
              sx={{ fontSize: 35 }}
              className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
              onClick={() => {
                fileRef.current.accept = "video/*";
                fileRef.current.click();
              }}
            />
          </div>

          <input
            type="file"
            accept="image/*,video/*"
            hidden
            ref={fileRef}
            onChange={handleFileChange}
          />

          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 shadow-md px-2 sm:px-3 py-2 rounded-md focus:outline-none text-white sm:text-md text-sm whitespace-nowrap transition-all duration-300"
              onClick={() => setIsReelModalOpen(true)}
            >
              Upload Reel
            </button>

            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 shadow-md px-2 sm:px-3 py-2 rounded-md focus:outline-none text-white sm:text-md text-sm whitespace-nowrap transition-all duration-300 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPending}
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
        {isError && (
          <p className="mt-2 text-red-500 text-sm">{isError.message}</p>
        )}
      </form>

      <ReelUploadModal
        isOpen={isReelModalOpen}
        onClose={() => setIsReelModalOpen(false)}
      />
    </div>
  );
};

export default CreatePost;
