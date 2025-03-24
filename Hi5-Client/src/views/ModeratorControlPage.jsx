import MainLayout from "../components/layout/MainLayout"
import { useEffect, useState } from "react";
import { createModeratorAccount, getModerators } from "../services/api";
import ModeratorSearchCard from "../components/temp/ModeratorSearchCard";
import { PersonAdd } from "@mui/icons-material";
import NewModeratorCreateModal from "../components/temp/NewModeratorCreateModal";
import * as Yup from "yup";

const ModeratorControlPage = () => {

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getModerators();
            setUsers(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(6, "Password must be at least 6 characters long")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[@$!%*?&]/, "Password must contain at least one special character")
            .required("Password is required"),
        username: Yup.string()
            .min(3, "Username must be at least 3 characters")
            .max(15, "Username must not exceed 15 characters")
            .matches(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores")
            .required("Username is required"),
        email: Yup.string()
            .email("Please enter a valid email address")
            .required("Email is required"),
    });

    const [isCreateNewModeratorModalOpen, setIsCreateNewModeratorModalOpen] = useState(false);
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [accountCreationError, setAccountCreationError] = useState(null);
    const openCreateNewModeratorModal = () => {
        setAccountCreationError(null);
        setIsCreatingAccount(false);
        setIsCreateNewModeratorModalOpen(true);
    }
    const closeCreateNewModeratorModal = () => setIsCreateNewModeratorModalOpen(false);
    const createNewAccount = async (data) => {
        try {
            setIsCreatingAccount(true);
            setAccountCreationError(null);
            await validationSchema.validate({ email: data.email, username: data.username, password: data.password }, { abortEarly: true });
            const response = await createModeratorAccount({ email: data.email, username: data.username, password: data.password });
            if (response.status === 200) {
                closeCreateNewModeratorModal();
                fetchUsers();
            }
        } catch (error) {
            setAccountCreationError(error?.response?.data?.message || error?.message || "Failed to create account");
        } finally {
            setIsCreatingAccount(false);
        }
    }

    const removeModerator = (id) => {
        setUsers(users.filter(user => user.id !== id));
    }

    return (
        <MainLayout>
            <div className="flex justify-center mx-auto pt-[70px] md:pt-0 md:pl-[70px] lg:pl-[260px] w-full h-full">
                <div className="flex justify-center w-full max-w-3xl">
                    <div className="flex flex-col justify-center bg-white dark:bg-black shadow-lg my-0 md:my-4 px-4 rounded-lg w-full">
                        <div className="top-0 sticky p-2 md:p-6 w-full">
                            <div className="flex justify-between items-center">
                                <h1 className="hidden md:block font-semibold text-xl lg:text-2xl">
                                    Moderators
                                </h1>
                                <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium text-white transition"
                                    onClick={openCreateNewModeratorModal}
                                >
                                    <PersonAdd />
                                    <span className="hidden sm:inline">New Moderator</span>
                                </button>
                            </div>
                        </div>
                        <div className="bg-slate-200 dark:bg-slate-800 mx-3 rounded-lg h-1"></div>
                        <div className="flex flex-col flex-1 space-y-4 mt-0 mb-10 sm:mb-3 min-[450px]:p-4 pb-4 overflow-y-auto hide-scrollbar">
                            {!isLoading && users.length === 0 && (
                                <div className="flex flex-1 justify-center items-center">
                                    <p className="text-center">No Moderators Found</p>
                                </div>
                            )}
                            {users.length > 0 && (
                                <>
                                    {users.map((user, index) => (
                                        <ModeratorSearchCard key={user.id} index={index} user={user} removeModerator={removeModerator} />
                                    ))}
                                </>
                            )}
                            {isLoading && users.length === 0 && (
                                <div className="flex flex-col justify-center">
                                    <p className="text-center">Loading...</p>
                                </div>
                            )}
                            {!isLoading && error && (
                                <p className="my-4 text-red-500 text-center">{error}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <NewModeratorCreateModal
                isOpen={isCreateNewModeratorModalOpen}
                closeModal={closeCreateNewModeratorModal}
                isCreatingAccount={isCreatingAccount}
                createAccount={createNewAccount}
                accountCreationError={accountCreationError}
            />
        </MainLayout>
    )
}

export default ModeratorControlPage