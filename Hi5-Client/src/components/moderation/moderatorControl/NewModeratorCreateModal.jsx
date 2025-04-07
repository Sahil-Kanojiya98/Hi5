import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const NewModeratorCreateModal = ({
    isOpen,
    closeModal,
    createAccount,
    isCreatingAccount,
    accountCreationError,
}) => {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, closeModal]);

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    const handleSubmit = () => {
        createAccount({ email, username, password });
    };

    return (
        <>
            {isOpen && (
                <div
                    className={`z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ${isCreatingAccount ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={handleOutsideClick}
                >
                    <div
                        className={`bg-white dark:bg-black border border-gray-500  shadow-lg p-4 sm:p-6 md:p-8 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md transition-transform duration-300 transform ${isOpen ? "scale-100" : "scale-95"} ${isCreatingAccount ? "opacity-50" : ""}`}
                    >
                        <div className="flex justify-between items-center mb-4 text-xl">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                                Create New Moderator
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-100 dark:text-gray-300"
                                disabled={isCreatingAccount}
                            >
                                <CloseRoundedIcon
                                    sx={{
                                        fontSize: { xs: 25, sm: 28, md: 30 },
                                    }}
                                />
                            </button>
                        </div>

                        <div className="space-y-4 mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-black dark:text-white"
                                disabled={isCreatingAccount}
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-white dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-black dark:text-white"
                                disabled={isCreatingAccount}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-black dark:text-white"
                                disabled={isCreatingAccount}
                            />
                            {accountCreationError && (
                                <p className="text-red-500 text-sm">{accountCreationError}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className={`bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-black dark:text-gray-200 transition-all duration-200 ease-in-out`}
                                disabled={isCreatingAccount}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out`}
                                disabled={isCreatingAccount}
                            >
                                Create Moderator
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

NewModeratorCreateModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    createAccount: PropTypes.func.isRequired,
    isCreatingAccount: PropTypes.bool.isRequired,
    accountCreationError: PropTypes.string,
};

export default NewModeratorCreateModal;