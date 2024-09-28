import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axiosInstance from "../utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import Comment from "./Comment";

const CommentDialog = ({ isOpen, onClose, postId, setCommentsCount }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const authUser = useSelector((state) => state.auth.user);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setComments([]);
      setPage(0);
      setHasMore(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `/comment/${postId}?page=${page}`
        );
        console.log(response);
        setComments((prevComments) => [...prevComments, ...response.data]);
        if (response.data.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        setError(err.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, postId]);

  const deleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.commentId !== commentId)
    );
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`/comment/${postId}`, {
        content: comment,
      });
      const { id, createdAt, content, user } = response.data;
      setComments((prevComments) => [
        {
          commentId: id,
          content,
          createdAt,
          likeCount: 0,
          userFullName: user.fullname,
          userID: user.id,
          userName: user.username,
          userProfilePicture: user.profilePictureUrl,
        },
        ...prevComments,
      ]);
      setComment("");
      setCommentsCount((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data || "An error occurred");
    } finally {
      setIsPosting(false);
    }
  };

  const loadMoreComments = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <dialog className="modal" open={isOpen}>
      <div
        className="modal-box border border-gray-500 rounded-lg max-w-md md:max-w-lg mx-auto flex flex-col"
        style={{ maxHeight: "75vh", display: "flex", flexDirection: "column" }}
      >
        <h3 className="font-bold text-lg my-3">COMMENTS</h3>
        <div
          id="scrollableDiv"
          style={{ overflowY: "auto", flexGrow: 1, paddingBottom: "10px" }}
        >
          {comments.length === 0 && !loading && (
            <p className="text-center">No comments yet. 😀</p>
          )}
          {comments.length > 0 && (
            <InfiniteScroll
              dataLength={comments.length}
              next={loadMoreComments}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={<p className="text-center">No more comments</p>}
              scrollableTarget="scrollableDiv"
            >
              {comments.map((comment) => (
                <Comment
                  key={comment.commentId}
                  comment={comment}
                  authUser={authUser}
                  setCommentsCount={setCommentsCount}
                  deleteComment={deleteComment}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
        <form
          className="flex items-center mt-4 border-t pt-3"
          onSubmit={handleCommentSubmit}
        >
          <textarea
            className="textarea w-full h-20 rounded-md resize-none focus:outline-none p-3 border border-gray-600 focus:border-gray-700"
            placeholder="Add a comment..."
            value={comment}
            onChange={handleCommentChange}
          />
          <button
            type="submit"
            className="ml-2 btn btn-primary text-white px-4 py-2 h-20 rounded-md"
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none" onClick={onClose}>
          Close
        </button>
      </form>
    </dialog>
  );
};

CommentDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setCommentsCount: PropTypes.func.isRequired,
};

export default CommentDialog;
