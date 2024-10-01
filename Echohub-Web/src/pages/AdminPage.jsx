import { useEffect, useState } from "react";
import Echohub from "../components/logo/Echohub";
import axios from "axios";
import { getAccessToken } from "../utils/localStorage";
import axiosInstance from "../utils/axiosConfig";

function AdminPage() {
  const [usersCount, setUsersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersResponse = await axiosInstance.get("/admin/users/count");
        const postsResponse = await axiosInstance.get("/admin/posts/count");
        setUsersCount(usersResponse.data);
        setPostsCount(postsResponse.data);
      } catch (error) {
        console.error("Error fetching admin data", error);
      }
    };
    fetchDashboardData();
  }, []);

  const shutDown = async () => {
    const accessToken = getAccessToken();
    try {
      const response = await axios.post(
        "http://localhost:8080/actuator/shutdown",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Response from shutdown:", response.data);
      console.log("Shutting down...");
    } catch (error) {
      console.error("Error shutting down:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-[calc(100vh+1px)]">
        <div className="flex justify-center items-center w-full border-b border-gray-700 h-20">
          <Echohub classNames="text-3xl" />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Admin Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-2 md:p-4 ">
            <div className="bg-gray-800 p-4 rounded-md shadow-md text-center">
              <h2 className="text-lg font-bold">Total Users</h2>
              <p className="text-3xl mt-2">{usersCount}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-md shadow-md text-center">
              <h2 className="text-lg font-bold">Total Posts</h2>
              <p className="text-3xl mt-2">{postsCount}</p>
            </div>
          </div>
          <div className="bg-red-600 hover:bg-red-500 rounded-md shadow-md text-center p-2 m-2 md:p-4 md:m-4">
            <button onClick={shutDown}>Shut Down</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
