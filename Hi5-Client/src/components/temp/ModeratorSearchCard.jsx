import PropTypes from "prop-types";
import { Delete } from '@mui/icons-material';
import DeleteConfirmationModal from "../temp/DeleteConfirmationModal";
import { useState } from "react";
import { deleteModeratorAccount } from "../../services/api";

const ModeratorSearchCard = ({ index, user }) => {

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteModeratorAccount(user?.id);
            // remove user from the parent
            console.log("Account deleted: " + user?.id);
        } catch (error) {
            console.error("Error deleting : ", error);
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    return <div
        key={user?.id}
        className="flex flex-wrap justify-between items-center gap-3 sm:gap-0 bg-white dark:bg-black shadow-md p-3 rounded-lg transition"
    >
        <div className="flex items-center gap-3 min-[410px]:gap-4 transition duration-150">
            <div className="flex justify-center items-center bg-blue-500 border-4 border-gray-300 rounded-full w-10 min-[410px]:w-12 h-10 min-[410px]:h-12 overflow-hidden">
                {index + 1}
            </div>
            <div>
                <p className="font-semibold text-md text-slate-900 dark:text-white md:text-lg break-words">
                    {user?.email}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">@{user?.username}</p>
            </div>
        </div>

        <p className="text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">Created At: {new Date(user?.createdAt).toLocaleDateString()}</p>

        <div className="flex gap-1 min-[410px]:gap-2">
            <button
                onClick={openDeleteModal}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 shadow-md px-2 min-[410px]:px-4 py-2 rounded-full font-medium text-white text-sm hover:scale-105 transition-all duration-300 transform"
            >
                <Delete className="w-5 h-5" />
                <span className="hidden md:inline">Delete</span>
            </button>
        </div>
        <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            closeModal={closeDeleteModal}
            confirmDelete={confirmDelete}
            isDeleting={isDeleting}
            type="USER_ACCOUNT"
        />
    </div>
};

ModeratorSearchCard.propTypes = {
    index: PropTypes.number.isRequired,
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        email: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};


export default ModeratorSearchCard;
