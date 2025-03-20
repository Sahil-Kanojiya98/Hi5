import MainLayout from "../components/layout/MainLayout"
import { useEffect, useState } from "react";
import { getModerators } from "../services/api";
import ModeratorSearchCard from "../components/temp/ModeratorSearchCard";

const ModeratorControlPage = () => {

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
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
        fetchUsers();
    }, []);

    return (
        <MainLayout>
            <div className="flex justify-center mx-auto pt-[70px] md:pt-0 md:pl-[70px] lg:pl-[260px] w-full h-full">
                <div className="flex justify-center w-full max-w-3xl">
                    <div className="flex flex-col justify-center bg-white shadow-lg my-0 md:my-4 px-4 rounded-lg w-full">
                        <div className="top-0 sticky p-2 md:p-6 w-full">
                            <div className="flex justify-between items-center">
                                <h1 className="hidden md:block font-semibold text-xl lg:text-2xl">
                                    Moderators
                                </h1>
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
                                        <ModeratorSearchCard key={user.id} index={index} user={user} />
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
        </MainLayout>
    )
}

export default ModeratorControlPage