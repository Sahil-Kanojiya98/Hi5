import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../services/axios.config";

const RightPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axiosInstance.get("/user/suggest");
        setUsers(response?.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <div className="hidden lg:block mt-5 w-72 min-w-60">
      <div className="bg-white dark:bg-black shadow-md p-4 rounded-md">
        <p className="mb-4 font-bold text-lg">You Might Know</p>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <div className="flex flex-col space-y-5">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${user?.id}`}>
                      <img
                        src={user?.profilePictureUrl}
                        alt={`${user?.fullname}'s Profile`}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    </Link>
                    <div>
                      <span className="block font-medium text-sm truncate">
                        {user?.fullname}
                      </span>
                      <span className="block text-gray-400 text-xs truncate">
                        {user?.username}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${user?.id}`}
                    className="bg-gray-200 dark:bg-gray-800 hover:opacity-90 px-4 py-1 rounded-full font-semibold text-black dark:text-white text-sm transition duration-200"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No suggestions found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
