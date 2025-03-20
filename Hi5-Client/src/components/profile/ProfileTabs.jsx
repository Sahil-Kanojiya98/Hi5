import PropTypes from "prop-types";
import { useState } from "react";
import Posts from "../post/Posts";
import Reels from "../reel/Reels";

const tabs = [
  { label: "Posts", value: "POSTS" },
  { label: "Reels", value: "REELS" },
  { label: "Saved Posts", value: "SAVED_POSTS", requiresProfile: true },
  { label: "Saved Reels", value: "SAVED_REELS", requiresProfile: true },
];

export default function ProfileTabs({ userId, isMyProfile, profileType }) {
  const filteredTabs = tabs.filter(
    (tab) => !tab.requiresProfile || isMyProfile
  );

  const [activeTab, setActiveTab] = useState("POSTS");

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-4 bg-gray-100 dark:bg-gray-900 m-4 p-3 rounded-md w-full max-w-xl">
        {(isMyProfile || profileType !== "PRIVATE") && (
          <>
            <div className="flex bg-white dark:bg-black shadow-md rounded-lg w-full overflow-x-auto whitespace-nowrap hide-scrollbar">
              {filteredTabs.map((tab) => (
                <div
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`relative flex flex-1 justify-center p-3 font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 hover:dark:bg-gray-800 rounded-lg text-black dark:text-white `}
                >
                  {tab.label}
                  {activeTab === tab.value && (
                    <div className="bottom-0 absolute bg-gray-800 dark:bg-gray-200 rounded-full w-10 h-1 transition-all duration-300"></div>
                  )}
                </div>
              ))}
            </div>

            {(activeTab === "POSTS" || activeTab === "SAVED_POSTS") && (
              <>
                <div className="flex justify-center rounded-lg w-full">
                  {activeTab === "POSTS" && (
                    <Posts
                      userId={userId}
                      feedType="POSTS"
                      isMyProfilePosts={true}
                    />
                  )}
                  {activeTab === "SAVED_POSTS" && isMyProfile && (
                    <Posts feedType="SAVED" />
                  )}
                </div>
              </>
            )}

            {(activeTab === "REELS" || activeTab === "SAVED_REELS") && (
              <div className="">
                {activeTab === "REELS" && (
                  <Reels
                    userId={userId}
                    feedType="REELS"
                    isMyProfileReels={isMyProfile}
                    showBackButton={false}
                    showCreateReelButton={false}
                  />
                )}
                {activeTab === "SAVED_REELS" && isMyProfile && (
                  <Reels
                    feedType="SAVED"
                    showBackButton={false}
                    showCreateReelButton={false}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Prop validation
ProfileTabs.propTypes = {
  userId: PropTypes.string.isRequired,
  isMyProfile: PropTypes.bool.isRequired,
  profileType: PropTypes.string.isRequired,
};
