import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import PostSkeleton from "./skeletons/PostSkeleton";
import axiosInstance from "../utils/axiosConfig";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Posts = ({ feedType, userId = null, isMyPost = false, reduceCount }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const authUser = useSelector((state) => state.auth.user);

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `post/all?page=${page}`;
      case "following":
        return `/post/following?page=${page}`;
      case "posts":
        return `/post/user/${userId}?page=${page}`;
      case "saved":
        return `/user/saved-posts?page=${page}`;
      default:
        return `/post/all?page=${page}`;
    }
  };

  const fetchPosts = async () => {
    try {
      const endpoint = getPostEndpoint();
      const response = await axiosInstance.get(endpoint);
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, [feedType, userId]);

  useEffect(() => {
    fetchPosts();
  }, [page, feedType, userId]);

  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const removePost = (id) => {
    console.log("removing post");
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    reduceCount();
  };

  return (
    <div className="mt-3">
      {isLoading && posts.length === 0 && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {error && <p className="text-center my-4 text-red-500">{error}</p>}
      {!isLoading && posts.length === 0 && (
        <p className="text-center">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && posts.length > 0 && (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          }
          endMessage={<p className="text-center">No more posts</p>}
        >
          {posts.map((post) => (
            <Post
              authUserId={authUser.id}
              key={post.id}
              post={post}
              isMyPost={isMyPost}
              removePost={removePost}
              authUser={authUser}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

Posts.propTypes = {
  feedType: PropTypes.string.isRequired,
  userId: PropTypes.string,
  isMyPost: PropTypes.bool,
  reduceCount: PropTypes.func,
};

export default Posts;
