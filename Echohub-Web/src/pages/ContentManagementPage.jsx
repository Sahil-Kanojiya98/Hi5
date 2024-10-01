import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TimeAgo from "../components/TimeAgo";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

function ContentManagementPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/report?page=${page}`);
      console.log(response);
      const newPosts = response.data;
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching reported posts:", error);
    }
  },[page]);

  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/admin/post/${postId}`);
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post?.postResponse?.id !== postId)
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="p-4">
      {
        posts.length === 0 && (
          <div className="flex flex-col justify-center items-center pt-3">
            <p className="text-gray-400 text-sm">No reported posts found</p>
          </div>
        )
      }

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={""}
        endMessage={
          posts.length > 0 && (
            <p style={{ textAlign: "center" }}>No more posts to display</p>
          )
        }
      >
        <div className="reported-posts-list">
          {posts.map((post, index) => (
            <div
              key={index}
              className="reported-post-card border-b border-gray-700 p-4"
            >
              <div className="flex gap-3 items-start">
                <div className="avatar">
                  <Link
                    to={`/profile/${post?.postResponse?.userID}`}
                    className="w-8 h-8 rounded-full overflow-hidden"
                  >
                    <img
                      src={
                        post.postResponse?.profilePictureUrl
                          ? `http://localhost:8080${post?.postResponse?.profilePictureUrl}`
                          : "/avatar.png"
                      }
                      alt="Profile"
                    />
                  </Link>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/profile/${post?.postResponse?.userID}`}
                      className="font-bold"
                    >
                      {post?.postResponse?.fullname}
                    </Link>
                    <span className="text-gray-500 text-sm">
                      <TimeAgo date={post?.postResponse?.createdAt} />
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    @{post?.postResponse?.username}
                  </span>
                  {post?.postResponse?.imageUrl && (
                    <div className="mt-3 w-full flex justify-center items-center">
                      <img
                        className="max-h-[65dvh] rounded"
                        src={`http://localhost:8080${post?.postResponse?.imageUrl}`}
                        alt="Post Content"
                      />
                    </div>
                  )}
                  {post?.postResponse?.content && (
                    <p className="mt-2 text-sm text-gray-300">
                      {post?.postResponse?.content}
                    </p>
                  )}
                  <div className="mt-2">
                    <p className="text-gray-400 text-sm">
                      Reported {post?.reportCount} time(s)
                    </p>
                  </div>
                  <button
                    onClick={() => deletePost(post?.postResponse?.id)}
                    className="text-sm bg-red-500 hover:bg-red-700 inline-block py-2 mt-4 rounded-lg"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default ContentManagementPage;
