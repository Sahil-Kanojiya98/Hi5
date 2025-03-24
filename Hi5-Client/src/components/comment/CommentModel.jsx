import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios.config";
import { makeComment } from "../../services/api";
import Comment from "./Comment";


const CommentModel = ({
  isOpen,
  onClose,
  type,
  relevantId,
  updateCommentCount,
  commentCount,
  isMyProfileEntity = false,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    try {
      setIsPosting(true);
      const data = await makeComment({
        relevantId,
        content: newComment,
        type,
      });
      updateCommentCount((prev) => prev + 1);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setNewComment("");
      setIsPosting(false);
    }
  };

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get("/comment", {
        params: {
          type,
          relevantId,
          page,
          size: 10,
        },
      });
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setComments((prevPosts) => [...prevPosts, ...response.data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setComments([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, [type, relevantId, commentCount]);

  useEffect(() => {
    fetchComments();
  }, [page, type, relevantId, commentCount]);

  const loadMoreComments = () => {
    console.log("load more posts");
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const removeComment = (commentId) => {
    updateCommentCount((prev) => prev - 1);
    setComments((prevComments) => {
      console.log(prevComments);
      const newPosts = prevComments.filter((post) => post.id !== commentId);
      console.log(newPosts);
      return newPosts;
    });
  };

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMoreComments]);

  if (!isOpen) return null;

  return (
    <div
      className="z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white dark:bg-black shadow-lg p-4 border border-gray-500 rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition duration-200"
          >
            <CloseRoundedIcon
              sx={{
                fontSize: { xs: 25, sm: 28, md: 30 },
              }}
            />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto hide-scrollbar">
          {!isLoading && comments.length > 0 && (
            <>
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  removeComment={removeComment}
                  isMyProfileEntity={isMyProfileEntity}
                />
              ))}
              {!isLoading && error === null && (
                <div
                  ref={loaderRef}
                  className="flex justify-center items-center h-11"
                ></div>
              )}
              {!isLoading && error !== null && (
                <div
                  ref={loaderRef}
                  className="flex justify-center items-center h-16 text-white dark:text-black"
                >
                  Something error occured.
                </div>
              )}
            </>
          )}
        </div>

        {error && <p className="font-semibold text-red-500 text-sm">{error}</p>}
        <div className="flex items-center space-x-2 pt-4 border-gray-200 dark:border-gray-700 border-t">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write a comment..."
            className="bg-white dark:bg-black p-2 border dark:border-gray-500 rounded-lg outline-none w-full"
            disabled={isPosting}
          />
          <button
            onClick={handlePostComment}
            className="bg-blue-500 px-4 py-2 rounded-lg text-white"
            disabled={isPosting}
          >
            {isPosting ? "Posting.." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

CommentModel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  relevantId: PropTypes.string.isRequired,
  updateCommentCount: PropTypes.func.isRequired,
  commentCount: PropTypes.number.isRequired,
  isMyProfileEntity: PropTypes.bool.isRequired,
};

export default CommentModel;
