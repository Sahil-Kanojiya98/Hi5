import PropTypes from "prop-types";
import TimeAgo from "./TimeAgo";
import { CommentOutlined, CommentsDisabled, FavoriteBorderSharp, ReportGmailerrorred } from "@mui/icons-material";
import { useState } from "react";
import ReportDetailsModel from "./ReportDetailsModel";


const ReportedPost = ({ post }) => {

    const [isReportDetailsOpen, setIsReportDetailsOpen] = useState(false);
    const openReportDetailsModel = () => setIsReportDetailsOpen(true);
    const closeReportDetailsModel = () => setIsReportDetailsOpen(false);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 shadow-md mx-auto mb-6 p-3 sm:p-4 rounded-lg w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={post.profilePictureUrl}
                        alt={`${post.fullname}'s profile`}
                        className="rounded-full w-10 h-10 object-cover"
                    />
                    <div className="flex flex-col">
                        <p className="font-semibold text-md sm:text-lg">{post.fullname}</p>
                        <p className="flex sm:flex-row flex-col items-start sm:items-center space-x-1 text-gray-500 text-sm whitespace-nowrap">
                            <span>@{post.username}</span>
                            <span className="hidden sm:block">•</span>
                            <TimeAgo
                                date={post.createdAt}
                                className="pt-1 sm:pt-0 font-medium sm:text-md text-xs whitespace-nowrap"
                            />
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-4 w-full">
                <p className="px-2 w-full text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words whitespace-pre-wrap">
                    {post.content}
                </p>
            </div>

            {post.imageUrl && (
                <div className="mb-4 w-full h-full">
                    <img
                        src={post.imageUrl}
                        alt="Post content"
                        className="rounded-md w-full h-auto max-h-[90dvh] object-contain"
                    />
                </div>
            )}
            {post.videoUrl && (
                <div className="mb-4 w-full h-full">
                    <video
                        src={post.videoUrl}
                        controls
                        className="rounded-md w-full h-auto max-h-[90dvh] object-contain"
                    />
                </div>
            )}

            <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center space-x-5 ml-2 w-full">
                    <button
                        className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                    >
                        <FavoriteBorderSharp className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />

                        <span className="font-medium group-hover:text-red-500 text-sm">
                            {post.likesCount}
                        </span>
                    </button>
                    {post?.isCommentsDisabled === true ? (
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
                                {post.commentCount}
                            </span>
                        </button>
                    )}

                    <button
                        className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                        onClick={openReportDetailsModel}
                    >
                        <ReportGmailerrorred className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                        <span className="font-medium group-hover:text-red-500 text-sm">
                            {post.totalReportsCount}
                        </span>
                    </button>
                </div>
            </div>
            <ReportDetailsModel isOpen={isReportDetailsOpen} onClose={closeReportDetailsModel} type="POST" relevantId={post.id} />
        </div>
    )
}

export default ReportedPost

ReportedPost.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string.isRequired,
        profilePictureUrl: PropTypes.string,
        fullname: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        content: PropTypes.string,
        imageUrl: PropTypes.string,
        videoUrl: PropTypes.string,
        likesCount: PropTypes.number.isRequired,
        commentCount: PropTypes.number.isRequired,
        totalReportsCount: PropTypes.number.isRequired,
        isCommentsDisabled: PropTypes.bool,
    }).isRequired,
};
