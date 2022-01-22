import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("userData");
    if (!loggedInUser) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  return <div>Welcome to the Chat application</div>;
}

export default Home;
