import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import PostSkeleton from "./skeletons/PostSkeleton";
import axiosInstance from "../utils/axiosConfig";

const Posts = ({ feedType, userId, isMyPost, reduceCount }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

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
    console.log("removign post");
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    reduceCount();
  };

  return (
    <div>
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
              key={post.id}
              post={post}
              isMyPost={isMyPost}
              removePost={removePost}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Posts;