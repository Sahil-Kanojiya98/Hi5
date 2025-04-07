import {
    ChevronLeft,
    ChevronRight,
    Send,
    Close,
    FavoriteSharp,
    FavoriteBorderSharp,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { getStory, likeEntity, unlikeEntity } from "../../../services/api";
import { useNavigate } from "react-router-dom";

const ViewStorysModal = ({ isOpen, closeModal, newStoryUser }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [storyData, setStoryData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const handleModalClose = useCallback(() => {
        closeModal();
        setCurrentIndex(0);
    }, [closeModal, setCurrentIndex]);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                setIsLoading(true);
                const response = await getStory(newStoryUser.id, currentIndex);
                console.log("data:")
                console.log(response.data);
                setStoryData(response.data);
            } catch (error) {
                console.error("Error fetching stories:", error);
                handleModalClose();
            } finally {
                setIsLoading(false);
            }
        }
        fetchStory();
    }, [currentIndex, newStoryUser, handleModalClose]);

    const nextImage = useCallback(() => {
        if (currentIndex === newStoryUser.totalStorys - 1) {
            handleModalClose();
            setCurrentIndex(0);
            return;
        }
        setCurrentIndex((prevIndex) => {
            return prevIndex < newStoryUser.totalStorys - 1 ? prevIndex + 1 : prevIndex;
        });
    }, [currentIndex, handleModalClose, newStoryUser]);

    const previousImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    useEffect(() => {
        let timer;
        if (isOpen) {
            timer = setInterval(nextImage, 5000);
        }
        return () => clearInterval(timer);
    }, [isOpen, nextImage]);

    const likeClickHandler = async () => {
        if (storyData?.likeStatus === "LIKED") {
            unlikeEntity({
                relevantId: storyData?.id,
                type: "STORY",
            });
            setStoryData((prevState) => ({
                ...prevState,
                likeCount: prevState.likeCount - 1,
                likeStatus: "NOT_LIKED",
            }));
            console.log("unliked " + storyData?.id);
        } else {
            likeEntity({
                relevantId: storyData?.id,
                type: "STORY",
            });
            setStoryData((prevState) => ({
                ...prevState,
                likeCount: prevState.likeCount + 1,
                likeStatus: "LIKED",
            }));
            console.log("liked " + storyData?.id);
        }
    };

    const navigate = useNavigate();

    const handleRedirectToChat = () => {
        navigate(`/chat/${newStoryUser?.id}`);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleModalClose();
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
    }, [isOpen, handleModalClose]);

    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 transition-all">
            <button
                onClick={handleModalClose}
                className="top-4 right-4 z-10 fixed bg-gray-500 p-2 rounded-full text-white"
            >
                <Close className="text-2xl" />
            </button>

            <div className="relative flex flex-col justify-center items-center bg-white shadow-lg rounded-md w-full max-w-md h-screen">

                <div className="top-7 sm:top-0 left-0 absolute flex gap-1 px-4 pt-2 w-full">
                    {Array.from({ length: newStoryUser.totalStorys }).map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 flex-1 rounded-md transition-all ${index <= currentIndex ? "bg-blue-500" : "bg-gray-300"
                                }`}
                        ></div>
                    ))}
                </div>


                {isLoading && (
                    <div className="flex justify-center items-center w-full h-full">
                        <div className="border-4 border-t-transparent border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
                    </div>
                )}
                {!isLoading && storyData?.imageUrl ? (
                    <img
                        src={storyData.imageUrl}
                        alt={`Story image ${currentIndex + 1}`}
                        className="mb-4 rounded-md w-full object-contain"
                    />
                ) : (
                    <video
                        src={storyData?.videoUrl}
                        autoPlay
                        className="mb-4 rounded-md w-full object-contain"
                    />
                )}

                <div className="bottom-8 absolute px-4 py-2 w-full">
                    {!isLoading && (
                        <div className="flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 shadow-lg py-2 rounded-xl">
                            <div className="flex justify-center items-center space-x-2">
                                <div
                                    className="flex items-center gap-1 bg-gray-700 bg-opacity-60 hover:shadow-md rounded-lg text-white cursor-pointer"
                                    onClick={handleRedirectToChat}
                                >
                                    <input
                                        type="text"
                                        placeholder="Chat with user..."
                                        className="flex-grow bg-transparent opacity-100 px-4 py-2 rounded-lg focus:outline-none w-full text-white cursor-pointer placeholder-gray-400"
                                        readOnly
                                    />
                                    <button
                                        className="flex items-center bg-transparent hover:bg-blue-500 hover:bg-opacity-70 ml-2 px-4 py-2 rounded-lg text-white hover:text-white transition-all"
                                    >
                                        <Send />
                                    </button>
                                </div>

                                <button
                                    className="group flex items-center gap-1 space-x-2 bg-gray-700 bg-opacity-60 hover:shadow-md px-3 py-2 rounded-lg text-white hover:scale-110 transition duration-200 cursor-pointer transform"
                                    onClick={likeClickHandler}
                                >
                                    {storyData?.likeStatus === "LIKED" ? (
                                        <FavoriteSharp className="w-5 h-5 text-red-600 transition-colors duration-200" />
                                    ) : (
                                        <FavoriteBorderSharp className="w-5 h-5 group-hover:text-red-600 transition-colors duration-200" />
                                    )}
                                    <span className="font-medium group-hover:text-red-500 text-sm">
                                        {storyData?.likeCount}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={previousImage}
                    className="top-1/2 left-2 absolute bg-gray-400 hover:bg-gray-700 opacity-50 shadow-lg p-3 rounded-full text-white -translate-y-1/2 transform"
                    aria-label="Previous Story"
                >
                    <ChevronLeft className="text-2xl" />
                </button>
                <button
                    onClick={nextImage}
                    className="top-1/2 right-2 absolute bg-gray-400 hover:bg-gray-700 opacity-50 shadow-lg p-3 rounded-full text-white -translate-y-1/2 transform"
                    aria-label="Next Story"
                >
                    <ChevronRight className="text-2xl" />
                </button>
            </div>
        </div >


    )
}

ViewStorysModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    newStoryUser: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullname: PropTypes.string.isRequired,
        profilePictureUrl: PropTypes.string.isRequired,
        totalStorys: PropTypes.number.isRequired,
        totalSeenStorys: PropTypes.number.isRequired,
    }).isRequired
};

export default ViewStorysModal