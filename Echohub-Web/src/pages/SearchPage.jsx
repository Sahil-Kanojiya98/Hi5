import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import RightPanelSkeleton from "../components/skeletons/RightPanelSkeleton";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (e) => {
    try {
      setIsLoading(true);
      setSearchTerm(e.target.value);
      const response = await axiosInstance.get("/user/search", {
        params: { pattern: e.target.value },
      });
      setUsers(response.data.content);
    } catch (e) {
        console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      <div className="sticky top-0 z-10 border-b border-gray-700 p-3 px-6 bg-black">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl font-semibold text-white">Search Users</p>
          <div className="flex items-center border rounded-md p-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search users..."
              className="bg-transparent text-white outline-none placeholder-gray-500 px-2 py-1 w-full"
            />
            <button className="text-white hover:text-gray-300 mr-2 ">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mx-7 mt-4">
        {isLoading && (
          <>
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
          </>
        )}
        {!isLoading &&
          users?.map((user) => (
            <div
              className="flex items-center justify-between gap-4"
              key={user?.id}
            >
              <div className="flex gap-2 items-center">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full">
                    <img
                      src={
                        user?.profilePictureUrl
                          ? `http://localhost:8080${user?.profilePictureUrl}`
                          : "/avatar.png"
                      }
                      alt="Profile"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold ">{user?.fullname}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                </div>
              </div>
              <div>
                <Link
                  to={`/profile/${user?.id}`}
                  className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SearchPage;
