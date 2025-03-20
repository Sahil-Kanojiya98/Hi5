import { useEffect } from "react";
import PropTypes from "prop-types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const UnbanConfirmationModal = ({
    isOpen,
    closeModal,
    confirmUnban,
    isUnbanning,
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
                    className={`z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ${isUnbanning ? "pointer-events-none" : ""
                        }`}
                    onClick={handleOutsideClick}
                >
                    <div
                        className={`bg-white dark:bg-gray-900 shadow-xl rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 sm:p-8 transition-transform duration-300 transform ${isUnbanning ? "scale-95 pointer-events-none" : "scale-100"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 text-xl">
                                Confirm Unban
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-400 dark:text-gray-200"
                                disabled={isUnbanning}
                            >
                                <CloseRoundedIcon
                                    sx={{
                                        fontSize: { xs: 25, sm: 28, md: 30 },
                                    }}
                                />
                            </button>
                        </div>

                        <p className="mb-6 text-gray-700 dark:text-gray-300">
                            Are you sure you want to unban this account?
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className={`bg-gray-300 dark:bg-gray-600 ${isUnbanning
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-400 dark:hover:bg-gray-500"
                                    } px-4 py-2 rounded-lg text-black dark:text-white transition-all duration-200 ease-in-out`}
                                disabled={isUnbanning}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmUnban}
                                className={`bg-yellow-500 dark:bg-yellow-600 ${isUnbanning
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-yellow-600 dark:hover:bg-yellow-700"
                                    } px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out`}
                                disabled={isUnbanning}
                            >
                                Unban
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

UnbanConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    confirmUnban: PropTypes.func.isRequired,
    isUnbanning: PropTypes.bool.isRequired,
};

export default UnbanConfirmationModal;
