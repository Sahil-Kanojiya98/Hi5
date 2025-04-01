import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios.config";
import TimeAgo from "./TimeAgo";
import { CommentOutlined, CommentsDisabled, FavoriteBorderSharp, ReportGmailerrorred } from "@mui/icons-material";

const ReelModeration = () => {

    const [reels, setReels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [error, setError] = useState(null);

    const fetchReels = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/moderate/content/reel", {
                params: {
                    page,
                    size: 10,
                },
            });
            console.log(response.data);
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setReels((prevReels) => [...prevReels, ...response.data]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [page])

    useEffect(() => {
        setReels([]);
        setPage(0);
        setHasMore(true);
        setError(null);
        setIsLoading(true);
    }, []);

    useEffect(() => {
        fetchReels();
    }, [page, fetchReels]);

    const loadMoreReels = useCallback(() => {
        if (!isLoading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isLoading, hasMore])

    const loaderRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreReels();
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
    }, [loadMoreReels]);

    return (
        <>
            <div className="pt-2 overflow-y-auto hide-scrollbar">
                {!isLoading && reels.length > 0 && (
                    <>
                        {reels.map((reel) => (
                            <div className="bg-gray-100 dark:bg-gray-900 shadow-md mx-auto mb-6 p-3 sm:p-4 rounded-lg w-full max-w-xl"
                                key={reel.id}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={reel.profilePictureUrl}
                                            alt={`${reel.fullname}'s profile`}
                                            className="rounded-full w-10 h-10 object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-md sm:text-lg">{reel.fullname}</p>
                                            <p className="flex sm:flex-row flex-col items-start sm:items-center space-x-1 text-gray-500 text-sm whitespace-nowrap">
                                                <span>@{reel.username}</span>
                                                <span className="hidden sm:block">•</span>
                                                <TimeAgo
                                                    date={reel.createdAt}
                                                    className="pt-1 sm:pt-0 font-medium sm:text-md text-xs whitespace-nowrap"
                                                />
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                {reel?.videoUrl && (
                                    <div className="mb-4 w-full h-full">
                                        <video
                                            src={reel?.videoUrl}
                                            controls
                                            className="rounded-md w-full h-auto max-h-[65dvh] object-contain"
                                        />
                                    </div>
                                )}

                                <div className="mb-4 w-full">
                                    <p className="px-2 w-full text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words whitespace-pre-wrap">
                                        {reel.description}
                                    </p>
                                </div>


                                <div className="flex justify-between items-center text-gray-500">
                                    <div className="flex items-center space-x-5 ml-2 w-full">
                                        <button
                                            className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                                        >
                                            <FavoriteBorderSharp className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />

                                            <span className="font-medium group-hover:text-red-500 text-sm">
                                                {reel.likesCount}
                                            </span>
                                        </button>
                                        {reel?.isCommentsDisabled === true ? (
                                            <button className="flex items-center space-x-2 cursor-not-allowed">
                                                <CommentsDisabled
                                                    sx={{
                                                        fontSize: { xs: 21, sm: 23, md: 25 },
                                                    }}
                                                    className="w-5 sm:w-6 h-5 sm:h-6"
                                                />
                                                <span className="font-medium text-xs sm:text-sm">0</span>
                                            </button>
                                        ) : (
                                            <button
                                                className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                                            >
                                                <CommentOutlined className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                                                <span className="font-medium group-hover:text-blue-500 text-sm">
                                                    {reel.commentCount}
                                                </span>
                                            </button>
                                        )}

                                        <button
                                            className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                                        >
                                            <ReportGmailerrorred className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                                            <span className="font-medium group-hover:text-red-500 text-sm">
                                                {reel.totalReportsCount}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && error === null && (
                            <div
                                ref={loaderRef}
                                className="flex justify-center items-center h-11"
                            >
                                <span className="text-gray-500">Loading more reels...</span>
                            </div>
                        )}

                        {!isLoading && error === null && (
                            <div
                                ref={loaderRef}
                                className="flex justify-center items-center h-11"
                            >
                                <span className="text-gray-500">No more reels available.</span>
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

export default ReelModeration;