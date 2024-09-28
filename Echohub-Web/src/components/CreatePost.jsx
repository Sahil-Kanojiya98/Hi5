import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import { CiImageOn, CiVideoOn } from "react-icons/ci";
import axiosInstance from "../utils/axiosConfig";

const CreatePost = () => {
  const authUser = useSelector((state) => state.auth.user);

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const fileRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    return () => {
      if (fileURL) {
        URL.revokeObjectURL(fileURL);
      }
    };
  }, [fileURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setIsError(null);

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
      });
      console.log("Post created:", response.data);
      console.log("updated user");
      setText("");
      setFile(null);
      setFileURL(null);
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
    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    }
  };

  const renderFilePreview = () => {
    if (!file || !fileURL) return null;

    if (file.type.startsWith("image/")) {
      return (
        <div className="relative mx-auto" style={{ maxWidth: "650px" }}>
          <IoClose
            className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
            onClick={() => {
              setFile(null);
              setFileURL(null);
              fileRef.current.value = null;
            }}
          />
          <img
            src={fileURL}
            className="w-full mx-auto h-auto object-contain rounded"
            style={{ maxHeight: "calc(65dvh)" }}
            alt="Preview"
          />
        </div>
      );
    }
    if (file.type.startsWith("video/")) {
      return (
        <div className="relative mx-auto" style={{ maxWidth: "650px" }}>
          <IoCloseSharp
            className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
            onClick={() => {
              setFile(null);
              setFileURL(null);
              fileRef.current.value = null;
            }}
          />
          <video
            src={fileURL}
            controls
            className="w-full mx-auto h-auto object-contain rounded"
            style={{ maxHeight: "calc(65dvh)" }}
            controlsList="nodownload"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            alt="postImg"
            src={
              authUser?.profilePictureUrl
                ? "http://localhost:8080" + authUser.profilePictureUrl
                : "/avatar.png"
            }
          />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {renderFilePreview()}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-2 md:gap-5 items-center justify-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => {
                fileRef.current.accept = "image/*";
                fileRef.current.click();
              }}
            />
            <CiVideoOn
              className="fill-primary w-6 h-6 cursor-pointer"
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
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">{isError.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
