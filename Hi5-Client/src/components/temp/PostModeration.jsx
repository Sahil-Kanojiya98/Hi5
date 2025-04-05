import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios.config";
import ReportedPost from "./ReportedPost";

const PostModeration = () => {

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/moderate/content/post", {
                params: {
                    page,
                    size: 10,
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
    }, [page])

    useEffect(() => {
        setPosts([]);
        setPage(0);
        setHasMore(true);
        setError(null);
        setIsLoading(true);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [page, fetchPosts]);

    const loadMorePosts = useCallback(() => {
        if (!isLoading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isLoading, hasMore])

    const loaderRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMorePosts();
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
    }, [loadMorePosts]);

    const removePost = (postId) => {
        setPosts((prevPosts) => {
            console.log(prevPosts);
            const newPosts = prevPosts.filter((post) => post.id !== postId);
            console.log(newPosts);
            return newPosts;
        });
    };

    const updateBanUntill = (userId, banUntil) => {
        setPosts((prevPosts) => {
            console.log(prevPosts)
            const newPosts = prevPosts.map((post) =>
                post.userId === userId ? { ...post, banUntil } : post
            )
            console.log(newPosts);
            return newPosts;
        });
    };

    return (
        <>
            <div className="pt-2 w-full overflow-y-auto hide-scrollbar">
                {!isLoading && posts.length > 0 && (
                    <>
                        {posts.map((post) => (
                            <ReportedPost
                                key={post.id}
                                post={post}
                                removePost={removePost}
                                updateBanUntill={updateBanUntill}
                            />
                        ))}
                        {isLoading && error === null && (
                            <div
                                ref={loaderRef}
                                className="flex justify-center items-center h-11"
                            >
                                <span className="text-gray-500">Loading more posts...</span>
                            </div>
                        )}
                        {!isLoading && error === null && (
                            <div
                                ref={loaderRef}
                                className="flex justify-center items-center h-11"
                            >
                                <span className="text-gray-500">No more posts available.</span>
                            </div>
                        )}
                        {!isLoading && error !== null && (
                            <div
                                ref={loaderRef}
                                className="flex justify-center items-center h-16 text-red-500"
                            >
                                Something went wrong. Please try again.
                            </div>
                        )}
                    </>
                )}
            </div>

            {error && <p className="font-semibold text-red-500 text-sm">{error}</p>}
        </>
    )
}

export default PostModeration;