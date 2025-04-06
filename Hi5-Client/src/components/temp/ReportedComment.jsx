import PropTypes from "prop-types";
import TimeAgo from "./TimeAgo";
import { Block, CommentOutlined, CommentsDisabled, DeleteOutlineOutlined, FavoriteBorderSharp, ReportGmailerrorred } from "@mui/icons-material";
import { useState } from "react";
import ReportDetailsModel from "./ReportDetailsModel";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { banUserAccount, deleteEntity, unbanUserAccount } from "../../services/api";
import UnbanConfirmationModal from "./UnbanConfirmationModal";
import BanConfirmationModal from "./BanConfirmationModal";
import toast from "react-hot-toast";


const ReportedComment = ({ comment, removeComment, updateBanUntill }) => {

    const [isReportDetailsOpen, setIsReportDetailsOpen] = useState(false);
    const openReportDetailsModel = () => setIsReportDetailsOpen(true);
    const closeReportDetailsModel = () => setIsReportDetailsOpen(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteEntity(comment.id, "COMMENT");
            console.log("comment deleted: " + comment.id);
            removeComment(comment.id);
        } catch (error) {
            console.error("Error deleting comment: ", error);
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    const isBanned = new Date(comment?.banUntil) > new Date();

    const getRemainingBanDays = () => {
        const banUntilDate = new Date(comment?.banUntil);
        const currentDate = new Date();
        const remainingTime = banUntilDate - currentDate;
        const remainingDays = Math.ceil(remainingTime / (1000 * 3600 * 24));
        return remainingDays > 0 ? remainingDays : 0;
    };

    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [isBanning, setIsBanning] = useState(false);
    const openBanModel = () => setIsBanModalOpen(true);
    const closeBanModal = () => setIsBanModalOpen(false);
    const confirmBan = async (date) => {
        const selectedDate = new Date(date);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            toast.error("The ban date cannot be in the past. Please choose a future date.");
            return;
        }
        setIsBanning(true);
        try {
            await banUserAccount(comment?.userId, new Date(date).toISOString());
            console.log("Account ban: " + comment?.userId);
            updateBanUntill(comment.userId, selectedDate.toISOString())
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            }
            console.error("Error ban : ", error);
        } finally {
            setIsBanning(false);
            closeBanModal();
        }
    };

    const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
    const [isUnbanning, setIsUnbanning] = useState(false);
    const openUnbanModel = () => setIsUnbanModalOpen(true);
    const closeUnbanModal = () => setIsUnbanModalOpen(false);
    const confirmUnban = async () => {
        setIsUnbanning(true);
        try {
            await unbanUserAccount(comment?.userId);
            console.log("Account Unban: " + comment?.userId);
            updateBanUntill(comment.userId, new Date(new Date() - 1).toISOString())
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            }
            console.error("Error ban : ", error);
        } finally {
            setIsUnbanning(false);
            closeUnbanModal();
        }
    };


    return (
        <>
            <div className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-900 shadow-md mx-auto mb-6 p-3 sm:p-4 rounded-lg w-full max-w-xl">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                            <img
                                src={comment.profilePictureUrl}
                                alt={`${comment.fullname}'s profile`}
                                className="rounded-full w-10 h-10 object-cover"
                            />
                            <div className="flex flex-col">
                                <p className="font-semibold text-md sm:text-lg">{comment.fullname}</p>
                                <p className="flex sm:flex-row flex-col items-start sm:items-center space-x-1 text-gray-500 text-sm whitespace-nowrap">
                                    <span>@{comment.username}</span>
                                    <span className="hidden sm:block">•</span>
                                    <TimeAgo
                                        date={comment.createdAt}
                                        className="pt-1 sm:pt-0 font-medium sm:text-md text-xs whitespace-nowrap"
                                    />
                                </p>
                            </div>
                        </div>
                        <button
                            className="flex items-center space-x-1 hover:text-red-500 hover:scale-110 transition duration-200 transform"
                            onClick={openDeleteModal}
                        >
                            <DeleteOutlineOutlined className="text-gray-600 hover:text-red-500 cursor-pointer" />
                        </button>
                    </div>
                    <div className="mb-4 w-full">
                        <p className="px-2 w-full text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    </div>

                    <div className="flex flex-col justify-between items-center gap-2 text-gray-500">
                        <div className="flex items-center space-x-5 ml-2 w-full">
                            <button
                                className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                            >
                                <FavoriteBorderSharp className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />

                                <span className="font-medium group-hover:text-red-500 text-sm">
                                    {comment.likesCount}
                                </span>
                            </button>

                            <button
                                className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                                onClick={openReportDetailsModel}
                            >
                                <ReportGmailerrorred className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                                <span className="font-medium group-hover:text-red-500 text-sm">
                                    {comment.totalReportsCount}
                                </span>
                            </button>
                        </div>

                        {!isBanned ? (
                            <div className="flex justify-end items-center w-full">
                                <button
                                    onClick={openBanModel}
                                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 shadow-md px-2 min-[410px]:px-4 py-2 rounded-full font-medium text-white text-sm hover:scale-105 transition-all duration-300 transform"
                                >
                                    <Block className="w-5 h-5" />
                                    <span className="inline">Ban</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center w-full">
                                <p className="mt-1 text-gray-500 text-sm whitespace-nowrap">
                                    {getRemainingBanDays()} days remaining.
                                </p>
                                <button
                                    onClick={openUnbanModel}
                                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 shadow-md px-2 min-[410px]:px-4 py-2 rounded-full font-medium text-white text-sm hover:scale-105 transition-all duration-300 transform"
                                >
                                    <Block className="w-5 h-5" />
                                    <span className="inline">Unban</span>
                                </button>
                            </div>
                        )}


                    </div>
                </div>

                <div className="flex justify-center bg-gray-200 dark:bg-gray-800 shadow-md mx-auto p-1 sm:p-2 rounded-lg w-full text-gray-600 dark:text-gray-400">
                    {comment?.postResponse && <p>Post</p>}
                    {comment?.reelResponse && <p>Reel</p>}
                </div>

                {/* post and reel */}
                <div>
                    {comment?.postResponse && (
                        <div className="bg-gray-200 dark:bg-gray-800 shadow-md mx-auto p-1 sm:p-2 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={comment.postResponse.profilePictureUrl}
                                        alt={`${comment.postResponse.fullname}'s profile`}
                                        className="rounded-full w-10 h-10 object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-md sm:text-lg">{comment.postResponse.fullname}</p>
                                        <p className="flex sm:flex-row flex-col items-start sm:items-center space-x-1 text-gray-500 text-sm whitespace-nowrap">
                                            <span>@{comment.postResponse.username}</span>
                                            <span className="hidden sm:block">•</span>
                                            <TimeAgo
                                                date={comment.postResponse.createdAt}
                                                className="pt-1 sm:pt-0 font-medium sm:text-md text-xs whitespace-nowrap"
                                            />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4 w-full">
                                <p className="px-2 w-full text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words whitespace-pre-wrap">
                                    {comment.postResponse.content}
                                </p>
                            </div>
                            {comment.postResponse.imageUrl && (
                                <div className="mb-4 w-full h-full">
                                    <img
                                        src={comment.postResponse.imageUrl}
                                        alt="Post content"
                                        className="rounded-md w-full h-auto max-h-[90dvh] object-contain"
                                    />
                                </div>
                            )}
                            {comment.postResponse.videoUrl && (
                                <div className="mb-4 w-full h-full">
                                    <video
                                        src={comment.postResponse.videoUrl}
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
                                            {comment.postResponse.likesCount}
                                        </span>
                                    </button>
                                    {comment.postResponse?.isCommentsDisabled === true ? (
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
                                                {comment.postResponse.commentsCount}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {comment?.reelResponse && (
                        <div className="bg-gray-200 dark:bg-gray-800 shadow-md mx-auto p-1 sm:p-2 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={comment.reelResponse.profilePictureUrl}
                                        alt={`${comment.reelResponse.fullname}'s profile`}
                                        className="rounded-full w-10 h-10 object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-md sm:text-lg">{comment.reelResponse.fullname}</p>
                                        <p className="flex sm:flex-row flex-col items-start sm:items-center space-x-1 text-gray-500 text-sm whitespace-nowrap">
                                            <span>@{comment.reelResponse.username}</span>
                                            <span className="hidden sm:block">•</span>
                                            <TimeAgo
                                                date={comment.reelResponse.createdAt}
                                                className="pt-1 sm:pt-0 font-medium sm:text-md text-xs whitespace-nowrap"
                                            />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {comment.reelResponse?.videoUrl && (
                                <div className="mb-4 w-full h-full">
                                    <video
                                        src={comment.reelResponse?.videoUrl}
                                        controls
                                        className="rounded-md w-full h-auto max-h-[65dvh] object-contain"
                                    />
                                </div>
                            )}
                            <div className="mb-4 w-full">
                                <p className="px-2 w-full text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words whitespace-pre-wrap">
                                    {comment.reelResponse.description}
                                </p>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <div className="flex items-center space-x-5 ml-2 w-full">
                                    <button
                                        className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                                    >
                                        <FavoriteBorderSharp className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />

                                        <span className="font-medium group-hover:text-red-500 text-sm">
                                            {comment.reelResponse.likesCount}
                                        </span>
                                    </button>
                                    {comment.reelResponse?.isCommentsDisabled === true ? (
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
                                                {comment.reelResponse.commentsCount}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {isReportDetailsOpen && (
                    <ReportDetailsModel
                        isOpen={isReportDetailsOpen}
                        onClose={closeReportDetailsModel}
                        type="COMMENT"
                        relevantId={comment.id}
                    />
                )}
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    closeModal={closeDeleteModal}
                    confirmDelete={confirmDelete}
                    isDeleting={isDeleting}
                    type="COMMENT"
                />
                {isBanned && (
                    <UnbanConfirmationModal
                        isOpen={isUnbanModalOpen}
                        closeModal={closeUnbanModal}
                        confirmUnban={confirmUnban}
                        isUnbanning={isUnbanning}
                    />
                )}
                {!isBanned && (
                    <BanConfirmationModal
                        isOpen={isBanModalOpen}
                        closeModal={closeBanModal}
                        confirmBan={confirmBan}
                        isBanning={isBanning}
                    />
                )}
            </div>
        </>
    )
}

ReportedComment.propTypes = {
    comment: PropTypes.shape({
        id: PropTypes.string.isRequired,
        commentId: PropTypes.string.isRequired,
        relevantId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        fullname: PropTypes.string.isRequired,
        profilePictureUrl: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        likesCount: PropTypes.number.isRequired,
        postResponse: PropTypes.shape({
            id: PropTypes.string.isRequired,
            postId: PropTypes.string.isRequired,
            userId: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            imageUrl: PropTypes.string,
            videoUrl: PropTypes.string,
            createdAt: PropTypes.string.isRequired,
            likesCount: PropTypes.number.isRequired,
            commentsCount: PropTypes.number.isRequired,
            isPrivate: PropTypes.bool,
            isCommentsDisabled: PropTypes.bool,
            username: PropTypes.string.isRequired,
            fullname: PropTypes.string.isRequired,
            profilePictureUrl: PropTypes.string.isRequired,
        }),
        reelResponse: PropTypes.shape({
            id: PropTypes.string.isRequired,
            reelId: PropTypes.string.isRequired,
            userId: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            videoUrl: PropTypes.string,
            createdAt: PropTypes.string.isRequired,
            likesCount: PropTypes.number.isRequired,
            commentsCount: PropTypes.number.isRequired,
            isPrivate: PropTypes.bool,
            isCommentsDisabled: PropTypes.bool,
            username: PropTypes.string.isRequired,
            fullname: PropTypes.string.isRequired,
            profilePictureUrl: PropTypes.string.isRequired,
        }),
        totalReportsCount: PropTypes.number.isRequired,
        banUntil: PropTypes.string.isRequired,
    }).isRequired,
    removeComment: PropTypes.func.isRequired,
    updateBanUntill: PropTypes.func.isRequired,
};

export default ReportedComment;