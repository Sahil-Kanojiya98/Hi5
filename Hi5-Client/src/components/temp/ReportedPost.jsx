import PropTypes from "prop-types";
import TimeAgo from "./TimeAgo";
import { Block, CommentOutlined, CommentsDisabled, DeleteOutlineOutlined, FavoriteBorderSharp, ReportGmailerrorred } from "@mui/icons-material";
import { useState } from "react";
import ReportDetailsModel from "./ReportDetailsModel";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { banUserAccount, deleteEntity, unbanUserAccount } from "../../services/api";
import toast from "react-hot-toast";
import BanConfirmationModal from "./BanConfirmationModal";
import UnbanConfirmationModal from "./UnbanConfirmationModal";


const ReportedPost = ({ post, removePost, updateBanUntill }) => {

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
            await deleteEntity(post.id, "POST");
            console.log("Post deleted: " + post.id);
            removePost(post.id);
        } catch (error) {
            console.error("Error deleting post: ", error);
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    const isBanned = new Date(post?.banUntil) > new Date();

    const getRemainingBanDays = () => {
        const banUntilDate = new Date(post?.banUntil);
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
            await banUserAccount(post?.userId, new Date(date).toISOString());
            console.log("Account ban: " + post?.userId);
            updateBanUntill(post.id, new Date(date).toISOString())
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
            await unbanUserAccount(post?.userId);
            console.log("Account Unban: " + post?.userId);
            updateBanUntill(post.userId, new Date(new Date(post?.banUntil) - 1).toISOString())
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
                <button
                    className="flex items-center space-x-1 hover:text-red-500 hover:scale-110 transition duration-200 transform"
                    onClick={openDeleteModal}
                >
                    <DeleteOutlineOutlined className="text-gray-600 hover:text-red-500 cursor-pointer" />
                </button>
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

            <div className="flex flex-col justify-between items-center text-gray-500">
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
                                {post.commentsCount}
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

                {!isBanned ? (
                    <div className="flex justify-end items-center w-full">
                        <button
                            onClick={openBanModel}
                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 shadow-md px-2 min-[410px]:px-4 py-2 rounded-full font-medium text-white text-sm hover:scale-105 transition-all duration-300 transform"
                        >
                            <Block className="w-5 h-5" />
                            <span className="hidden md:inline">Ban</span>
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
                            <span className="hidden md:inline">Unban</span>
                        </button>
                    </div>
                )}

            </div>
            {
                isReportDetailsOpen && <ReportDetailsModel isOpen={isReportDetailsOpen} onClose={closeReportDetailsModel} type="POST" relevantId={post.id} />
            }
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                closeModal={closeDeleteModal}
                confirmDelete={confirmDelete}
                isDeleting={isDeleting}
                type="POST"
            />
            {
                isBanned && (
                    <UnbanConfirmationModal
                        isOpen={isUnbanModalOpen}
                        closeModal={closeUnbanModal}
                        confirmUnban={confirmUnban}
                        isUnbanning={isUnbanning}
                    />
                )
            }
            {
                !isBanned && (
                    <BanConfirmationModal
                        isOpen={isBanModalOpen}
                        closeModal={closeBanModal}
                        confirmBan={confirmBan}
                        isBanning={isBanning}
                    />
                )
            }
        </div>
    )
}

ReportedPost.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        profilePictureUrl: PropTypes.string,
        fullname: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        content: PropTypes.string,
        imageUrl: PropTypes.string,
        videoUrl: PropTypes.string,
        likesCount: PropTypes.number.isRequired,
        commentsCount: PropTypes.number.isRequired,
        totalReportsCount: PropTypes.number.isRequired,
        isCommentsDisabled: PropTypes.bool,
        banUntil: PropTypes.string.isRequired,
    }).isRequired,
    removePost: PropTypes.func.isRequired,
    updateBanUntill: PropTypes.func.isRequired,
};

export default ReportedPost