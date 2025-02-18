import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../services/axios.config";
import { ReelCreatedToast as DisplayReelCreatedToast } from "../providers/ToastProvider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ReelUploadModal = ({ isOpen, onClose }) => {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleFileChange = (event, isVideo = false) => {
    const file = event.target.files[0];
    if (!file) return;

    setValidationError("");
    setUploadError("");

    const isValidVideo = isVideo && file.type.startsWith("video/");
    const isValidImage = !isVideo && file.type.startsWith("image/");

    if (isValidVideo && file.size > 1024 * 1024 * 1024) {
      setValidationError(
        "The selected video exceeds the maximum file size of 1GB."
      );
      return;
    }

    if (isValidImage && file.size > 20 * 1024 * 1024) {
      setValidationError(
        "The selected image exceeds the maximum file size of 20MB."
      );
      return;
    }

    if (isVideo) {
      setVideo(file);
      const videoURL = URL.createObjectURL(file);
      setPreview(videoURL);
      setDuration(null);
      generateThumbnail(file);
    } else {
      setThumbnail(file);
    }
  };

  const generateThumbnail = (file) => {
    const videoElement = document.createElement("video");
    const videoURL = URL.createObjectURL(file);
    videoElement.src = videoURL;
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      const videoDuration = Math.round(videoElement.duration);
      if (videoDuration > 5 * 60) {
        setValidationError(
          "The selected video exceeds the maximum length of 5 minutes."
        );
        setVideo(null);
        setPreview(null);
        setDuration(null);
        URL.revokeObjectURL(videoURL);
        return;
      }
      setDuration(videoDuration);
      videoElement.currentTime = 1;
    };

    videoElement.oncanplay = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 200;
      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbFile = new File([blob], "thumbnail.jpg", {
              type: "image/jpeg",
            });
            setThumbnail(thumbFile);
          }
          URL.revokeObjectURL(videoURL);
        },
        "image/jpeg",
        0.95
      );
    };

    videoElement.onerror = () => {
      setValidationError("Failed to load video for processing.");
    };
  };

  const handleUpload = async () => {
    setValidationError("");
    setUploadError("");

    if (validationError) return;
    if (!video) {
      setValidationError("Please select a video to upload the reel!");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("video", video);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      const response = await axiosInstance.post("/reel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      });
      console.log("Reel created:", response.data);

      DisplayReelCreatedToast();

      clearAll();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred during the upload. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const clearAll = () => {
    setVideo(null);
    setPreview(null);
    setThumbnail(null);
    setDuration(null);
    setValidationError("");
    setUploadProgress(0);
    setUploadError("");
    setDescription("");
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-900 dark:outline-2 shadow-xl p-6 rounded-lg w-full max-w-xl max-h-[80vh] text-gray-800 dark:text-white animate-fadeIn overflow-y-auto hide-scrollbar dark:outline-white">
        <button
          type="button"
          className="top-3 right-3 absolute text-gray-600 hover:text-gray-800 dark:text-gray-300"
          onClick={() => {
            clearAll();
            onClose();
          }}
          aria-label="Close modal"
        >
          <CloseRoundedIcon
            sx={{
              fontSize: { xs: 25, sm: 28, md: 30 },
            }}
          />
        </button>

        <h2 className="mb-4 font-semibold text-center text-xl">Upload Reel</h2>

        {validationError && (
          <div className="text-red-600 text-sm">{validationError}</div>
        )}
        {uploadError && (
          <div className="text-red-600 text-sm">{uploadError}</div>
        )}

        <span>Video:</span>
        {preview ? (
          <div className="relative mx-auto p-2 w-full">
            <button type="button" onClick={clearAll}>
              <CloseRoundedIcon
                sx={{
                  fontSize: { xs: 25, sm: 28, md: 30 },
                }}
                className="top-1 right-1 absolute bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 dark:bg-gray-700 p-1 rounded-full cursor-pointer"
              />
            </button>
            <video
              ref={videoRef}
              className="rounded-lg w-full h-full object-contain"
              controls
              src={preview}
            />
          </div>
        ) : (
          <div className="text-gray-600">No video selected</div>
        )}

        <span>Thumbnail:</span>
        {thumbnail ? (
          <div className="flex justify-center p-2">
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="Thumbnail Preview"
              className="rounded-lg w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="text-gray-600">No thumbnail selected</div>
        )}

        <div className="flex flex-col gap-4 mt-2">
          <div
            className="flex justify-center items-center dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm p-3 border rounded-md transition duration-200 cursor-pointer"
            onClick={() => videoInputRef.current.click()}
          >
            <span className="font-semibold">Select Video</span>
            <input
              disabled={isLoading}
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={(e) => handleFileChange(e, true)}
              className="hidden"
              aria-label="Select a video file"
            />
          </div>

          <div
            className="flex justify-center items-center dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm p-3 border rounded-md transition duration-200 cursor-pointer"
            onClick={() => thumbnailInputRef.current.click()}
          >
            <span className="font-semibold">Select Thumbnail (optional)</span>
            <input
              disabled={isLoading}
              type="file"
              accept="image/*"
              ref={thumbnailInputRef}
              onChange={(e) => handleFileChange(e)}
              className="hidden"
              aria-label="Select an image file for the thumbnail"
            />
          </div>

          <textarea
            disabled={isLoading}
            className="dark:border-gray-800 p-3 border rounded-md dark:focus:ring-gray-800 w-full min-h-16 transition resize-none focus:outline-none dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 duration-200"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="bg-gray-200 mb-4 rounded-full w-full h-2.5">
              <div
                className="bg-blue-600 rounded-full h-2.5"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isLoading}
            className={`py-2 rounded-lg w-full text-white ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } transition duration-200`}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

ReelUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReelUploadModal;
