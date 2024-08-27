import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import useLogout from "../hooks/useLogout";

function HomePage() {
  const user = useSelector((state) => state.auth.user);
  console.table(user);
  const logout = useLogout();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      home page
      <Button onClick={handleLogout}>logout</Button>
    </div>
  );
}

export default HomePage;
