import { useRef, useState, useEffect } from "react";
import axiosInstance from "../../services/axios.config.js";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { useSelector } from "react-redux";
import ReelUploadModal from "../reel/ReelUploadModel.jsx";
import { PostCreatedToast as DisplayPostCreatedToast } from "../providers/ToastProvider.jsx";

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
    setIsPending(true);
    setIsError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("content", text);
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

      DisplayPostCreatedToast();

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
      );
    }

    if (file.type.startsWith("video/")) {
      return (
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
      );
    }
    return null;
  };

  const user = useSelector((state) => state.user.profile);

  return (
    <div className="flex items-start gap-2 sm:gap-3 bg-white dark:bg-black shadow-md mt-4 mb-3 p-3 sm:p-4 rounded-lg w-full max-w-xl">
      <div className="rounded-full w-10 overflow-hidden">
        <img
          alt="postImg"
          src={user.profilePictureUrl}
          className="w-full h-full object-cover"
        />
      </div>
      <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit}>
        <textarea
          className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-2 sm:p-3 border rounded-md text-xs sm:text-lg focus:outline-none resize-none"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="w-full text-red-700 text-sm">
          {validationError && (
            <>
              <p>{validationError}</p>
            </>
          )}
        </div>
        <div className="w-full text-2xl text-gray-500">
          {renderFilePreview()}
        </div>
        <div className="flex flex-col gap-2">
          {isPending && (
            <div className="bg-gray-200 rounded-full w-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-3 sm:gap-2">
              <ImageRoundedIcon
                sx={{ fontSize: { xs: 25, sm: 30, md: 31 } }}
                className="w-8 sm:w-7 h-10 sm:h-7 text-gray-600 cursor-pointer"
                onClick={() => {
                  fileRef.current.accept = "image/*";
                  fileRef.current.click();
                }}
              />
              <VideocamRoundedIcon
                sx={{ fontSize: { xs: 35, sm: 39, md: 40 } }}
                className="text-gray-600 cursor-pointer"
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

            <div className="flex gap-2">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-6 py-2 rounded-full text-white whitespace-nowrap focus:outline-none text-xs sm:text-sm md:text-lg duration-300"
                onClick={() => setIsReelModalOpen(true)}
              >
                Upload Reel
              </button>

              <button
                type="submit"
                className={`px-3 sm:px-6 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition duration-300 ease-in-out text-xs sm:text-sm md:text-lg ${
                  isPending ? "opacity-50" : ""
                }`}
                disabled={isPending}
              >
                {isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
        {isError && (
          <div className="mt-2 text-red-500 text-sm">{isError.message}</div>
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
