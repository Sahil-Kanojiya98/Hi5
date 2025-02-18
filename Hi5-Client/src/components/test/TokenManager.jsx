import { useState, useEffect } from "react";
import { setToken, getToken, removeToken } from "../../utils/localStorage";

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
    <div className="border-gray-200 bg-white shadow-md mx-auto mt-10 p-6 border rounded-lg max-w-xl">
      <h1 className="mb-6 font-bold text-2xl text-center text-gray-800">
        Token Manager
      </h1>
      <div className="mb-6">
        <h2 className="mb-4 font-semibold text-gray-700 text-lg">
          Access Token
        </h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
            placeholder="Enter new access token"
            className="flex-1 border-gray-300 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handlesetToken}
            className="bg-blue-500 hover:bg-blue-600 shadow-md px-4 py-2 rounded-lg font-semibold text-white transition duration-300"
          >
            Set Access Token
          </button>
        </div>
        <div className="text-right">
          <button
            onClick={handleremoveToken}
            className="bg-red-500 hover:bg-red-600 shadow-md px-4 py-2 rounded-lg font-semibold text-white transition duration-300"
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
