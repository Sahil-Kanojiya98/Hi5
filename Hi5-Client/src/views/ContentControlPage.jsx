import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import PostModeration from "../components/temp/PostModeration";
import ReelModeration from "../components/temp/ReelModeration";
import CommentModeration from "../components/temp/CommentModeration";

const ContentControlPage = () => {

    const [feedType, setFeedType] = useState("POST");
    const postTabClickHandle = () => {
        setFeedType("POST");
    };
    const reelTabClickHandle = () => {
        setFeedType("REEL");
    };
    const commentTabClickHandle = () => {
        setFeedType("COMMENT");
    };

    return (
        <MainLayout>
            <div className="flex justify-center mx-auto pt-[70px] md:pt-0 md:pl-[70px] lg:pl-[260px] w-full h-full">
                <div className="flex justify-center w-full max-w-3xl">
                    <div className="flex flex-col justify-center bg-white shadow-lg my-0 md:my-4 px-4 rounded-lg w-full">
                        <div className="top-0 sticky p-2 md:p-6 w-full">
                            <div className="flex bg-white dark:bg-black shadow-md rounded-lg w-full">
                                <div
                                    className="relative flex flex-1 justify-center hover:bg-gray-200 hover:dark:bg-gray-800 p-3 rounded-lg cursor-pointer"
                                    onClick={postTabClickHandle}
                                >
                                    Post
                                    {feedType === "POST" && (
                                        <div className="bottom-0 absolute bg-gray-800 dark:bg-gray-200 rounded-full w-10 h-1"></div>
                                    )}
                                </div>

                                <div
                                    className="relative flex flex-1 justify-center hover:bg-gray-200 hover:dark:bg-gray-800 p-3 rounded-lg cursor-pointer"
                                    onClick={reelTabClickHandle}
                                >
                                    Reels
                                    {feedType === "REEL" && (
                                        <div className="bottom-0 absolute bg-gray-800 dark:bg-gray-200 rounded-full w-10 h-1"></div>
                                    )}
                                </div>

                                <div
                                    className="relative flex flex-1 justify-center hover:bg-gray-200 hover:dark:bg-gray-800 p-3 rounded-lg cursor-pointer"
                                    onClick={commentTabClickHandle}
                                >
                                    Comments
                                    {feedType === "COMMENT" && (
                                        <div className="bottom-0 absolute bg-gray-800 dark:bg-gray-200 rounded-full w-10 h-1"></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-200 dark:bg-slate-800 mx-3 rounded-lg h-1"></div>

                        <div className="flex flex-col flex-1 items-center space-y-4 mt-0 mb-10 sm:mb-3 min-[450px]:p-4 pb-4 overflow-y-auto hide-scrollbar">
                            {feedType === "POST" && (
                                <PostModeration />
                            )}
                            {feedType === "REEL" && (
                                <ReelModeration />
                            )}
                            {feedType === "COMMENT" && (
                                <CommentModeration />
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ContentControlPage;
