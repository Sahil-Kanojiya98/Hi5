import { useState } from "react";
import axiosInstance from "../utils/axiosConfig";

const CommentDialog = ({ isOpen, onClose }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/comments", { text: comment });
      console.log(response.data);
      setComment("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const hiddenScrollbarStyles = {
    overflow: "scroll",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "scrollbar-width": "none",
  };

  const items = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  return (
    <dialog className="modal" open={isOpen}>
      <div className="modal-box border rounded-md border-gray-700 shadow-md">
        <h3 className="font-bold text-lg my-3">COMMENTS</h3>
        <div className="flex flex-col gap-3 max-h-72 sm:max-h-80 md:max-h-96">
          <div
            className="flex flex-col gap-4 overflow-x-hidden overflow-y-scroll gap-1"
            style={hiddenScrollbarStyles}
          >
            {items.map((item) => (
              <div key="comment1" className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src="/avatar.png" alt="Profile" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">John Doe</span>
                      <span className="text-gray-700 text-sm">@johndoe</span>
                    </div>
                    <div className="text-sm">This is a great post! 👍</div>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <button className="btn btn-primary btn-sm">Like</button>
                  <button className="btn btn-primary btn-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
          <form
            className="flex items-center mt-4 border-t border-gray-600 pt-3"
            onSubmit={handleCommentSubmit}
          >
            <div className="flex items-center w-full rounded-lg overflow-hidden ">
              <textarea
                className="textarea w-full h-20 text-md rounded-s-lg resize-none border border-gray-600 focus:border-gray-700 focus:outline-none"
                placeholder="Add a comment..."
                value={comment}
                onChange={handleCommentChange}
              />
              <button
                type="submit"
                className="btn w-20 btn-primary h-20 btn-sm text-white px-4"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none" onClick={onClose}>
          Close
        </button>
      </form>
    </dialog>
  );
};

export default CommentDialog;