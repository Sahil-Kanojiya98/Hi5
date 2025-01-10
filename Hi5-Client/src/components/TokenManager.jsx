import { useState, useEffect } from "react";
import { setToken, getToken, removeToken } from "../utils/localStorage";

const TokenManager = () => {
  console.log("TokenManager");

  const [token, setTokenState] = useState(null);
  const [newToken, setNewToken] = useState("");

  useEffect(() => {
    const loadAccessToken = () => {
      try {
        const storedToken = getToken();
        setTokenState(storedToken || null);
      } catch (error) {
        console.error("Failed to load token:", error);
      }
    };
    loadAccessToken();
  }, []);

  const handlesetToken = () => {
    try {
      setToken(newToken);
      setTokenState(newToken);
      setNewToken("");
    } catch (error) {
      console.error("Failed to set access token:", error);
    }
  };

  const handleremoveToken = () => {
    try {
      removeToken();
      setTokenState(null);
    } catch (error) {
      console.error("Failed to remove access token:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Token Manager
      </h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Access Token
        </h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
            placeholder="Enter new access token"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlesetToken}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Set Access Token
          </button>
        </div>
        <div className="text-right">
          <button
            onClick={handleremoveToken}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
          >
            Remove Access Token
          </button>
        </div>
      </div>
      <p className="text-gray-700 text-sm">
        Current Access Token:{" "}
        <span className="font-semibold text-gray-800">{token || "None"}</span>
      </p>
    </div>
  );
};

export default TokenManager;
