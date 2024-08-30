import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import useLogout from "../hooks/useLogout";
import axiosInstance from "../utils/axiosConfig";

function HomePage() {
  const user = useSelector((state) => state.auth.user);
  console.table(user);
  const logout = useLogout();
  const handleLogout = async () => {
    await logout();
  };

  const [fetch , setFetch] = useState(null);
  const handleFetch = async () => {
    const result=await axiosInstance.get("/hello");
    if(result.status === 200){
      setFetch(`Hello, ${result.data}!`);
    }
  }

  return (
    <div>
      home page
      <Button onClick={handleLogout}>logout</Button>
      {fetch}
      <Button onClick={handleFetch}>fetch me</Button>
    </div>
  );
}

export default HomePage;
