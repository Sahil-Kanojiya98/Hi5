import CreatePost from "../components/post/CreatePost";
import MainLayout from "../components/layout/MainLayout";
import RightPanel from "../components/layout/common/panel/RightPanel";
import Storys from "../components/story/Storys";
import Posts from "../components/post/Posts";
import { useState } from "react";

const HomePage = () => {
  const [feedType, setFeedType] = useState("FOR_YOU");

  const forYouTabClickHandle = () => {
    setFeedType("FOR_YOU");
  };

  const followingTabClickHandle = () => {
    setFeedType("FOLLOWINGS");
  };

  return (
    <>
      <MainLayout>
        <div className="flex justify-center items-start gap-5 bg-gray-100 dark:bg-gray-900 mx-auto mt-[60px] sm:mt-[50px] md:mt-[10px] p-2 sm:p-4 md:pt-[0px] md:pl-[70px] lg:pl-[260px] w-full">
          <div className="flex flex-col items-center px-2 sm:px-3 xl:px-4 w-full lg:max-w-xl max-w-2xl">
            <Storys />

            <CreatePost />

            <div className="flex bg-white dark:bg-black shadow-md rounded-lg w-full max-w-xl">
              <div
                className="relative flex flex-1 justify-center hover:bg-gray-200 hover:dark:bg-gray-800 p-3 rounded-lg cursor-pointer"
                onClick={forYouTabClickHandle}
              >
                For You
                {feedType === "FOR_YOU" && (
                  <div className="bottom-0 absolute bg-gray-800 dark:bg-gray-200 rounded-full w-10 h-1"></div>
                )}
              </div>

              <div
                className="relative flex flex-1 justify-center hover:bg-gray-200 hover:dark:bg-gray-800 p-3 rounded-lg cursor-pointer"
                onClick={followingTabClickHandle}
              >
                Following
                {feedType === "FOLLOWINGS" && (
                  <div className="bottom-0 absolute bg-gray-800 dark:bg-gray-200 rounded-full w-10 h-1"></div>
                )}
              </div>
            </div>

            <Posts feedType={feedType} />
          </div>
          <RightPanel />
        </div>
      </MainLayout>
    </>
  );
};
export default HomePage;
