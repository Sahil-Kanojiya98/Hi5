import { useState, useEffect } from "react";
import {
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
} from "../utils/indexedDB";
import {
  setAccessToken,
  getAccessToken,
  removeAccessToken,
} from "../utils/localStorage";

const TokenManager = () => {
  const [refreshToken, setRefreshTokenState] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [newRefreshToken, setNewRefreshToken] = useState("");
  const [newAccessToken, setNewAccessToken] = useState("");

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedRefreshToken = await getRefreshToken("refreshToken");
        setRefreshTokenState(storedRefreshToken?.token || null);
        setAccessTokenState(getAccessToken());
      } catch (error) {
        console.error("Failed to load tokens:", error);
      }
    };
    loadTokens();
  }, []);

  const handleSetRefreshToken = async () => {
    try {
      await setRefreshToken({ id: "refreshToken", token: newRefreshToken });
      setRefreshTokenState(newRefreshToken);
    } catch (error) {
      console.error("Failed to set refresh token:", error);
    }
  };

  const handleSetAccessToken = () => {
    try {
      setAccessToken(newAccessToken);
      setAccessTokenState(newAccessToken);
    } catch (error) {
      console.error("Failed to set access token:", error);
    }
  };

  const handleRemoveRefreshToken = async () => {
    try {
      await removeRefreshToken("refreshToken");
      setRefreshTokenState(null);
    } catch (error) {
      console.error("Failed to remove refresh token:", error);
    }
  };

  const handleRemoveAccessToken = () => {
    try {
      removeAccessToken();
      setAccessTokenState(null);
    } catch (error) {
      console.error("Failed to remove access token:", error);
    }
  };

  return (
    <div>
      <h1>Token Manager</h1>
      <div>
        <h2>Refresh Token</h2>
        <input
          type="text"
          value={newRefreshToken}
          onChange={(e) => setNewRefreshToken(e.target.value)}
          placeholder="Enter new refresh token"
        />
        <button onClick={handleSetRefreshToken}>Set Refresh Token</button>
        <button onClick={handleRemoveRefreshToken}>Remove Refresh Token</button>
        <p>Current Refresh Token: {refreshToken || "None"}</p>
      </div>
      <div>
        <h2>Access Token</h2>
        <input
          type="text"
          value={newAccessToken}
          onChange={(e) => setNewAccessToken(e.target.value)}
          placeholder="Enter new access token"
        />
        <button onClick={handleSetAccessToken}>Set Access Token</button>
        <button onClick={handleRemoveAccessToken}>Remove Access Token</button>
        <p>Current Access Token: {accessToken || "None"}</p>
      </div>
    </div>
  );
};

export default TokenManager;
