import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../services/axios.config";
import { CloseRounded } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";

const ReportedUsersModel = ({ isOpen, closeModal, type, relevantId, reason }) => {

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [error, setError] = useState(null);

    const fetchRequests = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get("/moderate/report-users", {
                params: {
                    reportType: type,
                    relevantId,
                    reportReason: reason,
                    page,
                    size: 10,
                },
            });
            console.log(response.data);
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setUsers((prevUsers) => [...prevUsers, ...response.data]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [page, type, relevantId, reason]);

    useEffect(() => {
        if (isOpen) {
            setUsers([]);
            setPage(0);
            setHasMore(true);
            setError(null);
            setIsLoading(true);
        }
    }, [isOpen, type]);

    useEffect(() => {
        if (isOpen) {
            fetchRequests();
        }
    }, [isOpen, page, fetchRequests, type]);

    const loadMoreUsers = useCallback(() => {
        if (!isLoading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isLoading, hasMore, setPage]);

    if (!isOpen) return null;


    return (
        <>
            <div
                className="z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={handleOutsideClick}
            >
                <div
                    className={`bg-white dark:bg-black border border-gray-500 shadow-lg rounded-lg p-4  w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md transition-transform duration-300 transform ${isOpen ? "scale-100" : "scale-95"
                        }`}
                >
                    <div className="flex justify-between items-center mb-4 text-xl">
                        <h2 className="font-semibold text-lg">Users</h2>
                        <button
                            onClick={closeModal}
                            className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-100 dark:text-gray-300"
                        >
                            <CloseRounded
                                sx={{
                                    fontSize: { xs: 25, sm: 28, md: 30 },
                                }}
                                className="text-gray-500 hover:text-red-500 transition duration-200"
                            />
                        </button>
                    </div>
                    <div className="rounded-lg max-h-60 overflow-y-auto hide-scrollbar">
                        <InfiniteScroll
                            dataLength={users.length}
                            next={loadMoreUsers}
                            hasMore={hasMore}
                            loader={<></>}
                            endMessage={<p className="text-center">No more users</p>}
                        >
                            {users.map((user) => (
                                <div
                                    key={user?.id}
                                    className="flex justify-between items-center gap-5 sm:gap-0 bg-white dark:bg-black p-3 rounded-lg transition"
                                >
                                    <div className="flex items-center gap-1 min-[410px]:gap-4 transition duration-150">
                                        <div className="rounded-full w-10 min-[410px]:w-12 h-10 min-[410px]:h-12 overflow-hidden">
                                            <img
                                                src={user?.profilePictureUrl}
                                                alt={`${user?.fullname}'s profile`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold min-[410px]:text-md text-sm md:text-lg break-normal whitespace-nowrap">
                                                {user?.fullname}
                                            </p>
                                            <p className="text-gray-400 text-sm break-normal whitespace-nowrap">
                                                @{user?.username}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </InfiniteScroll>
                        {!isLoading && error && (
                            <p className="text-red-500 text-center">{error}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ReportedUsersModel.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    relevantId: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
};

export default ReportedUsersModel;