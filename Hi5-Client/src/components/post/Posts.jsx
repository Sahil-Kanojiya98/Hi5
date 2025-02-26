import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect, useState } from "react";
import Post from "./Post";
import PropTypes from "prop-types";
import axiosInstance from "../../services/axios.config";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

const Posts = ({ feedType, userId = "", isMyProfilePosts = false }) => {
  const user = useSelector((state) => state.user.profile);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `/post`;
      // case "following":
      //   return `/post/following?page=${page}`;
      // case "posts":
      //   return `/post/user/${userId}?page=${page}`;
      // case "saved":
      //   return `/post/saved?pageNo=${page}&pageSize=10`;
      default:
        return `/post`;
    }
  };

  const fetchPosts = async () => {
    try {
      const endpoint = getPostEndpoint();
      const response = await axiosInstance.get(endpoint, {
        params: {
          size: 5,
        },
      });
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

  const removePost = (postId) => {
    setPosts((prevPosts) => {
      console.log(prevPosts);
      const newPosts = prevPosts.filter((post) => post.id !== postId);
      console.log(newPosts);
      return newPosts;
    });
  };

  return (
    <>
      <div className="mt-3 w-full">
        {isLoading && posts.length === 0 && (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}

        {error && <p className="my-4 text-red-500 text-center">{error}</p>}

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
                key={post.id}
                post={post}
                authUserId={user.id}
                removePost={removePost}
                isMyProfilePosts={isMyProfilePosts}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
};

Posts.propTypes = {
  feedType: PropTypes.string.isRequired,
  userId: PropTypes.string,
  isMyProfilePosts: PropTypes.bool,
};

export default Posts;
