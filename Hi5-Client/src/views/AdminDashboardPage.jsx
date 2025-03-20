import { useEffect, useState } from "react";
import BarChartOne from "../components/temp/BarChartOne";
import LineChartOne from "../components/temp/LineChartOne";
import MainLayout from "../components/layout/MainLayout";
import { DashboardRounded } from "@mui/icons-material";
import axiosInstance from "../services/axios.config";
import { useWebSocket } from "../socket/WebSocketProvider";

export default function SocialMediaDashboard() {

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalModerators, setTotalModerators] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalReels, setTotalReels] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalBannedUsers, setTotalBannedUsers] = useState(0);

  const [userGrowthDayStats, setUserGrowthDayStats] = useState({ x: [], y: [] });
  const [userGrowthMonthStats, setUserGrowthMonthStats] = useState({ x: [], y: [] });
  const [userGrowthYearStats, setUserGrowthYearStats] = useState({ x: [], y: [] });

  const [contentEngagementGrowthDayStats, setContentEngagementGrowthDayStats] = useState({ x: [], y: [] });
  const [contentEngagementGrowthMonthStats, setContentEngagementGrowthMonthStats] = useState({ x: [], y: [] });
  const [contentEngagementGrowthYearStats, setContentEngagementGrowthYearStats] = useState({ x: [], y: [] });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get("/analytics");
        const { totalUsers, totalModerators, totalPosts, totalReels, activeUsers, bannedUsers, userGrowthDayStatsResponse, userGrowthMonthStatsResponse, userGrowthYearStatsResponse, contentEngagementGrowthDayStatsResponse, contentEngagementGrowthMonthStatsResponse, contentEngagementGrowthYearStatsResponse } = response.data;
        setTotalUsers(totalUsers);
        setTotalModerators(totalModerators)
        setTotalPosts(totalPosts);
        setTotalReels(totalReels);
        setTotalActiveUsers(activeUsers);
        setTotalBannedUsers(bannedUsers);
        setUserGrowthDayStats(userGrowthDayStatsResponse);
        setUserGrowthMonthStats(userGrowthMonthStatsResponse);
        setUserGrowthYearStats(userGrowthYearStatsResponse);
        setContentEngagementGrowthDayStats(contentEngagementGrowthDayStatsResponse);
        setContentEngagementGrowthMonthStats(contentEngagementGrowthMonthStatsResponse);
        setContentEngagementGrowthYearStats(contentEngagementGrowthYearStatsResponse);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    fetchAnalytics();
  }, []);

  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();
  useEffect(() => {
    if (isConnected) {
      let analyticsSubscription;
      try {
        analyticsSubscription = subscribeTopic(
          `/analytics`,
          (message) => {
            const msg = JSON.parse(message);
            console.log(msg);
            const { totalUsers, totalModerators, totalPosts, totalReels, activeUsers, bannedUsers, userGrowthDayStatsResponse, userGrowthMonthStatsResponse, userGrowthYearStatsResponse, contentEngagementGrowthDayStatsResponse, contentEngagementGrowthMonthStatsResponse, contentEngagementGrowthYearStatsResponse } = msg;
            setTotalUsers(totalUsers);
            setTotalModerators(totalModerators);
            setTotalPosts(totalPosts);
            setTotalReels(totalReels);
            setTotalActiveUsers(activeUsers);
            setTotalBannedUsers(bannedUsers);
            setUserGrowthDayStats(userGrowthDayStatsResponse);
            setUserGrowthMonthStats(userGrowthMonthStatsResponse);
            setUserGrowthYearStats(userGrowthYearStatsResponse);
            setContentEngagementGrowthDayStats(contentEngagementGrowthDayStatsResponse);
            setContentEngagementGrowthMonthStats(contentEngagementGrowthMonthStatsResponse);
            setContentEngagementGrowthYearStats(contentEngagementGrowthYearStatsResponse);
          }
        );
      } catch (e) {
        console.log("error:" + e);
      }
      return () => {
        unsubscribeTopic(analyticsSubscription);
      };
    }
  }, [isConnected, subscribeTopic, unsubscribeTopic]);

  const [userGrowthData, setUserGrowthData] = useState({ x: [], y: [] });
  const [chartTypeUserGrowth, setChartTypeUserGrowth] = useState("bar");
  const [chartTypeUserGrowthTimeType, setChartTypeUserGrowthTimeType] = useState("day");

  const [engagementGrowthData, setEngagementGrowthData] = useState({ x: [], y: [] });
  const [chartTypeEngagementGrowth, setchartTypeEngagementGrowth] = useState("line");
  const [chartTypeEngagementGrowthTimeType, setchartTypeEngagementGrowthTimeType] = useState("day");

  useEffect(() => {
    if (chartTypeUserGrowthTimeType === "day") {
      setUserGrowthData(userGrowthDayStats);
    } else if (chartTypeUserGrowthTimeType === "month") {
      setUserGrowthData(userGrowthMonthStats);
    } else if (chartTypeUserGrowthTimeType === "year") {
      setUserGrowthData(userGrowthYearStats);
    } else {
      console.log("error undefined time type");
    }
  }, [chartTypeUserGrowthTimeType, userGrowthDayStats, userGrowthMonthStats, userGrowthYearStats]);

  useEffect(() => {
    if (chartTypeEngagementGrowthTimeType === "day") {
      setEngagementGrowthData(contentEngagementGrowthDayStats);
    } else if (chartTypeEngagementGrowthTimeType === "month") {
      setEngagementGrowthData(contentEngagementGrowthMonthStats);
    } else if (chartTypeEngagementGrowthTimeType === "year") {
      setEngagementGrowthData(contentEngagementGrowthYearStats);
    } else {
      console.log("error undefined time type");
    }
  }, [chartTypeEngagementGrowthTimeType, contentEngagementGrowthDayStats, contentEngagementGrowthMonthStats, contentEngagementGrowthYearStats]);

  return (
    <MainLayout>
      <div className="flex justify-center mx-auto pt-[70px] md:pt-0 md:pl-[70px] lg:pl-[260px] w-full h-full">
        <div className="flex justify-center w-full max-w-5xl">
          <div className="flex flex-col items-center bg-white shadow-md my-0 md:my-4 px-3 sm:px-6 py-10 rounded-lg w-full overflow-y-auto hide-scrollbar">
            <div className="flex flex-col items-center">
              <h2 className="flex flex-wrap items-center gap-2 bg-gray-200 mb-6 px-4 py-3 rounded-lg font-bold text-gray-800 text-xl sm:text-2xl md:text-4xl">
                <DashboardRounded
                  sx={{ fontSize: { xs: 20, sm: 35, md: 40 } }}
                />
                Admin Dashboard
              </h2>
              <p className="mb-8 text-gray-600 text-lg text-center">
                Get insights on user activity and engagement trends.
              </p>
            </div>

            <div className="gap-4 sm:gap-3 md:gap-4 grid grid-cols-1 xs:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 bg-gray-100 shadow-md mb-8 p-4 rounded-3xl w-full">
              {[
                { label: "Total Users", value: totalUsers },
                { label: "Total Moderators", value: totalModerators },
                { label: "Total Posts", value: totalPosts },
                { label: "Total Reels", value: totalReels },
                { label: "Active Users", value: totalActiveUsers },
                { label: "Banned Users", value: totalBannedUsers },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-500 shadow-md p-6 rounded-2xl hover:scale-105 transition-transform hover:-translate-y-1 duration-300 transform"
                >
                  <h3 className="mb-2 font-semibold text-gray-700 text-xl text-center">{item.label}</h3>
                  <p className="font-bold text-gray-800 text-3xl">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:gap-6 w-full">
              <div className="flex flex-col gap-3 bg-white shadow-md hover:shadow-lg p-2 sm:p-4 rounded-xl">
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="p-2 font-semibold text-gray-700 text-2xl">
                    User Growth
                  </h3>

                  <div className="flex flex-wrap gap-2 p-3 sm:p-0">
                    <div className="flex gap-2 bg-blue bg-gray-200 p-1 rounded-md transition duration-300">
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeUserGrowthTimeType === "day"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() => setChartTypeUserGrowthTimeType("day")}
                      >
                        Day
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeUserGrowthTimeType === "month"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() => setChartTypeUserGrowthTimeType("month")}
                      >
                        Month
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeUserGrowthTimeType === "year"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() => setChartTypeUserGrowthTimeType("year")}
                      >
                        Year
                      </button>
                    </div>

                    <div className="flex gap-2 bg-blue bg-gray-200 p-1 rounded-md transition duration-300">
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeUserGrowth === "bar"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() => setChartTypeUserGrowth("bar")}
                      >
                        Bar Chart
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeUserGrowth === "line"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() => setChartTypeUserGrowth("line")}
                      >
                        Line Chart
                      </button>
                    </div>
                  </div>
                </div>
                {chartTypeUserGrowth === "bar" ? (
                  <BarChartOne name="Users" fileName="UserGrowth" seriesData={userGrowthData} />
                ) : (
                  <LineChartOne name="Users" fileName="UserGrowth" seriesData={userGrowthData} />
                )}
              </div>

              <div className="flex flex-col gap-3 bg-white shadow-md hover:shadow-lg p-2 sm:p-4 rounded-xl">
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="p-2 font-semibold text-gray-700 text-2xl">
                    Content Engagement Growth
                  </h3>

                  <div className="flex flex-wrap gap-2 p-3 sm:p-0">
                    <div className="flex gap-2 bg-blue bg-gray-200 p-1 rounded-md transition duration-300">
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeEngagementGrowthTimeType === "day"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() =>
                          setchartTypeEngagementGrowthTimeType("day")
                        }
                      >
                        Day
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeEngagementGrowthTimeType === "month"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() =>
                          setchartTypeEngagementGrowthTimeType("month")
                        }
                      >
                        Month
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeEngagementGrowthTimeType === "year"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() =>
                          setchartTypeEngagementGrowthTimeType("year")
                        }
                      >
                        Year
                      </button>
                    </div>

                    <div className="flex gap-2 bg-blue bg-gray-200 p-1 rounded-md transition duration-300">
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeEngagementGrowth === "bar"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() => setchartTypeEngagementGrowth("bar")}
                      >
                        Bar Chart
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded transition ${chartTypeEngagementGrowth === "line"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() => setchartTypeEngagementGrowth("line")}
                      >
                        Line Chart
                      </button>
                    </div>
                  </div>
                </div>
                {chartTypeEngagementGrowth === "bar" ? (
                  <BarChartOne name="Impressions" fileName="ContentEngagementGrowth" seriesData={engagementGrowthData} />
                ) : (
                  <LineChartOne name="Impressions" fileName="ContentEngagementGrowth" seriesData={engagementGrowthData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
