import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../services/axios.config";
import { ReelCreatedToast as displayReelCreatedToast } from "../providers/ToastProvider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

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

  const [isPrivate, setIsPrivate] = useState(false);
  const [disableComments, setDisableComments] = useState(false);

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
    formData.append("isPrivate", isPrivate);
    formData.append("isCommentsDisabled", disableComments);
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

      displayReelCreatedToast();

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

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      clearAll();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white shadow-lg p-4 px-5 rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Upload Reel</h2>
          <button
            onClick={() => {
              clearAll();
              onClose();
            }}
            className="text-gray-500 hover:text-red-500 transition duration-200"
          >
            <CloseRoundedIcon
              sx={{
                fontSize: { xs: 25, sm: 28, md: 30 },
              }}
            />
          </button>
        </div>

        <div className="max-h-[70dvh] overflow-y-auto hide-scrollbar">
          {validationError && (
            <div className="text-red-600 text-sm">{validationError}</div>
          )}
          {uploadError && (
            <div className="text-red-600 text-sm">{uploadError}</div>
          )}

          <div>
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
                  className="rounded-lg w-full max-h-[50dvh] object-contain"
                  controls
                  src={preview}
                />
              </div>
            ) : (
              <span className="pl-2 text-gray-600">No video selected</span>
            )}
          </div>

          <div>
            <span>Thumbnail:</span>
            {thumbnail ? (
              <div className="flex justify-center p-2 w-full">
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail Preview"
                  className="rounded-lg w-full max-h-[50dvh] object-contain"
                />
              </div>
            ) : (
              <span className="pl-2 text-gray-600">No thumbnail selected</span>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div
                className="flex flex-grow justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm p-3 border dark:border-gray-800 rounded-md transition duration-200 cursor-pointer"
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
                className="flex flex-grow justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm p-3 border dark:border-gray-800 rounded-md transition duration-200 cursor-pointer"
                onClick={() => thumbnailInputRef.current.click()}
              >
                <span className="font-semibold">Select Thumbnail</span>
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
            </div>

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
                <span className="select-none">Private Reel</span>
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

            <textarea
              disabled={isLoading}
              className="bg-gray-100 dark:bg-gray-900 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none w-full min-h-[85px] text-sm resize-none"
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
    </div>
  );
};

ReelUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReelUploadModal;
