import { useState } from "react";
import TimeAgo from "./TimeAgo";
import { CommentOutlined, CommentsDisabled, DeleteOutlineOutlined, FavoriteBorderSharp, ReportGmailerrorred } from "@mui/icons-material";
import ReportDetailsModel from "./ReportDetailsModel";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import PropTypes from "prop-types";
import { deleteEntity } from "../../services/api";


const ReportedReel = ({ reel, removeReel }) => {

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
            await deleteEntity(reel.id, "REEL");
            console.log("Reel deleted: " + reel.id);
            removeReel(reel.id);
        } catch (error) {
            console.error("Error deleting reel: ", error);
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 shadow-md mx-auto mb-6 p-3 sm:p-4 rounded-lg w-full max-w-xl">
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
                <button
                    className="flex items-center space-x-1 hover:text-red-500 hover:scale-110 transition duration-200 transform"
                    onClick={openDeleteModal}
                >
                    <DeleteOutlineOutlined className="text-gray-600 hover:text-red-500 cursor-pointer" />
                </button>
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
                                {reel.commentsCount}
                            </span>
                        </button>
                    )}

                    <button
                        className="group flex items-center space-x-2 hover:scale-110 transition duration-200 transform"
                        onClick={openReportDetailsModel}
                    >
                        <ReportGmailerrorred className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                        <span className="font-medium group-hover:text-red-500 text-sm">
                            {reel.totalReportsCount}
                        </span>
                    </button>
                </div>
            </div>
            {
                isReportDetailsOpen && <ReportDetailsModel isOpen={isReportDetailsOpen} onClose={closeReportDetailsModel} type="REEL" relevantId={reel.id} />
            }
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                closeModal={closeDeleteModal}
                confirmDelete={confirmDelete}
                isDeleting={isDeleting}
                type="REEL"
            />
        </div>
    )
}

ReportedReel.propTypes = {
    reel: PropTypes.shape({
        id: PropTypes.string.isRequired,
        profilePictureUrl: PropTypes.string.isRequired,
        fullname: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        videoUrl: PropTypes.string,
        description: PropTypes.string.isRequired,
        likesCount: PropTypes.number.isRequired,
        commentsCount: PropTypes.number.isRequired,
        totalReportsCount: PropTypes.number.isRequired,
        isCommentsDisabled: PropTypes.bool
    }).isRequired,
    removeReel: PropTypes.func.isRequired
};

export default ReportedReel