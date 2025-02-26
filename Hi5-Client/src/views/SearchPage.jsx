import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Visibility, PersonAdd, Email } from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { searchUsersByKeyword } from "../services/api";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(initialSearchTerm);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setUsers([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    console.log("re render..");
  }, [debouncedSearchTerm]);

  const fetchUsers = useCallback(async () => {
    if (debouncedSearchTerm.trim().length < 3) return;
    try {
      setIsLoading(true);
      const response = await searchUsersByKeyword(debouncedSearchTerm, {
        size: 10,
        page,
      });
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setUsers((prevUsers) =>
          page === 0 ? response.data : [...prevUsers, ...response.data]
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, page]);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 3) {
      fetchUsers();
    }
  }, [page, fetchUsers, debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setSearchParams({ query: newSearchTerm });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(newSearchTerm);
    }, 500);
  };

  const loadMoreUsers = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreUsers();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMoreUsers]);

  return (
    <MainLayout>
      <div className="flex justify-center mx-auto pt-[70px] md:pt-0 md:pl-[70px] lg:pl-[260px] w-full h-full">
        <div className="flex justify-center w-full max-w-3xl">
          <div className="flex flex-col justify-center bg-white shadow-lg my-0 md:my-4 rounded-lg w-full">
            <div className="top-0 sticky p-2 md:p-6 w-full">
              <div className="flex justify-between items-center">
                <h1 className="hidden md:block font-semibold text-xl lg:text-2xl">
                  Search Users
                </h1>
                <div className="flex justify-between items-center border border-gray-700 rounded-md w-full sm:w-auto overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="bg-white dark:bg-black px-3 sm:px-4 py-2 focus:outline-none w-full sm:w-64"
                    aria-label="Search users"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button className="p-3" aria-label="Search">
                    <Search className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-slate-200 dark:bg-slate-800 mx-3 rounded-lg h-1"></div>
            <div className="flex flex-col space-y-4 mt-0 mb-10 sm:mb-3 sm:p-4 pb-4 h-[calc(100dvh-160px)] overflow-y-auto hide-scrollbar">
              {!isLoading && users.length === 0 && (
                <p className="text-center">No users found.</p>
              )}
              {users.length > 0 && (
                <>
                  {users.map((user) => (
                    <div
                      key={user?.id}
                      className="flex justify-between items-center bg-white dark:bg-black mx-3 sm:mx-0 p-3 rounded-lg transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full w-10 h-10 overflow-hidden">
                          <img
                            src={user?.profilePictureUrl}
                            alt={`${user?.fullname}'s profile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold sm:text-md text-sm">
                            {user?.fullname}
                          </p>
                          <p className="text-gray-400 text-sm">
                            @{user?.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/profile/${user?.id}`}
                          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white transition"
                        >
                          <Visibility />
                          <span className="hidden md:inline">View</span>
                        </Link>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white transition">
                          <PersonAdd />
                          <span className="hidden md:inline">Follow</span>
                        </button>
                        <Link
                          to={`/chat/${user?.id}`}
                          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white transition"
                        >
                          <Email />
                          <span className="hidden md:inline">Message</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {isLoading && users.length === 0 && (
                    <div className="flex flex-col justify-center">
                      <p className="text-center">Loading...</p>
                    </div>
                  )}
                  <div ref={loaderRef}></div>
                  {!isLoading && error && (
                    <p className="my-4 text-red-500 text-center">{error}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchPage;
