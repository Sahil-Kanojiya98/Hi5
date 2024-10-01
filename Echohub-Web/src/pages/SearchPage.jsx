import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import UserSkeleton from "../components/skeletons/UserSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async (term, pageNumber) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/user/search", {
        params: { pattern: term, page: pageNumber },
      });
      console.log(response);
      setUsers((prevUsers) => [...prevUsers, ...response.data.content]);
      const totalPages = response.data.totalPages;
      if (pageNumber >= totalPages - 1) {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm !== "") {
      setPage(0);
      setHasMore(true);
      setError(null);
      setUsers([]);
      fetchUsers(searchTerm, 0);
    } else {
      setUsers([]);
      setPage(0);
      setHasMore(true);
      setError(null);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (page > 0 && searchTerm) {
      fetchUsers(searchTerm, page);
    }
  }, [page, searchTerm]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const loadMoreUsers = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-[#374151] bg-black min-h-[calc(100vh+1px)] ">
      <div className="sticky top-0 z-10 border-b border-[#212121] p-4 bg-black">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-white">Search Users</p>
          <div className="flex items-center border rounded-md p-2 bg-black">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search users..."
              className="bg-transparent text-white outline-none placeholder-white px-2 py-1 w-full"
            />
            <button className="text-white hover:text-gray-300 ml-2">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {!isLoading && error && (
          <p className="text-center my-4 text-red-500">{error}</p>
        )}
        {!isLoading && users.length === 0 && searchTerm != "" && (
          <p className="text-center text-white">
            No users found for {searchTerm}.
          </p>
        )}
        {users.length > 0 && (
          <InfiniteScroll
            dataLength={users.length}
            next={loadMoreUsers}
            hasMore={hasMore}
            loader={
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <UserSkeleton key={i} />
                ))}
              </div>
            }
            endMessage={<p className="text-center text-white">No more users</p>}
          >
            <div className="flex flex-col gap-4">
              {users.map((user) => (
                <div
                  key={user?.id}
                  className="flex items-center justify-between gap-4 p-4 bg-black rounded-md hover:bg-[#212121] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={
                          user?.profilePictureUrl
                            ? `http://localhost:8080${user?.profilePictureUrl}`
                            : "/avatar.png"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {user?.fullname}
                      </p>
                      <p className="text-white text-sm">@{user?.username}</p>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${user?.id}`}
                    className="px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-gray-300 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
