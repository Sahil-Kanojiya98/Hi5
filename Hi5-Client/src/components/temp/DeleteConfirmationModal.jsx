import { useEffect } from "react";
import PropTypes from "prop-types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const DeleteConfirmationModal = ({
  isOpen,
  closeModal,
  confirmDelete,
  isDeleting,
  type,
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeModal]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isDeleting ? "pointer-events-none" : ""
          }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`bg-white dark:bg-black border border-gray-500 shadow-lg rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-6 transition-transform duration-300 transform ${
              isDeleting ? "scale-95 pointer-events-none" : "scale-100"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-red-600 dark:text-red-400 text-xl">
                Confirm Deletion
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-400 dark:text-gray-200"
                disabled={isDeleting}
              >
                <CloseRoundedIcon
                  sx={{
                    fontSize: { xs: 25, sm: 28, md: 30 },
                  }}
                  className="text-gray-500 hover:text-red-500 transition duration-200"
                />
              </button>
            </div>
            {type === "POST" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this post?
              </p>
            )}
            {type === "REEL" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this reel?
              </p>
            )}
            {type === "STORY" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this story?
              </p>
            )}
            {type === "COMMENT" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this comment?
              </p>
            )}
            {type === "MESSAGES" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete all messages?
              </p>
            )}
            {type === "NOTIFICATIONS" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete all notifications?
              </p>
            )}
            {type === "USER_ACCOUNT" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this account?
              </p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className={`bg-gray-300 dark:bg-gray-600 ${
                  isDeleting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-400 dark:hover:bg-gray-500"
                } px-4 py-2 rounded-lg text-black dark:text-white transition-all duration-200 ease-in-out`}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`bg-red-500 dark:bg-red-600 ${
                  isDeleting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600 dark:hover:bg-red-700"
                } px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out`}
                disabled={isDeleting}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
