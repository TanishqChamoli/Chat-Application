import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Connection from "./Connection";
import AddConnection from "./AddConnection";
import axios from "axios";
import Chatbox from "./Chatbox";

function ConnectionList() {
  const navigate = useNavigate();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("userData");
    if (!loggedInUser) {
      navigate("/login", { replace: true });
    }
  }, []);

  const [reciever, setReciever] = useState("");

  const [connections, setConnections] = useState([]);
  const getConnectionInfo = async (e) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const response = await axios({
      method: "post",
      url: "/getConnections",
      type: "application/json",
      data: {
        email: userData["email"],
      },
    });
    console.log(response.data["connections"]);
    setConnections(
      response.data["connections"].map((connection, i) => {
        return (
          <Connection
            key={i}
            email={connection["email"]}
            name={connection["name"]}
            setReciver={setReciever}
          />
        );
      })
    );
  };
  useEffect(() => {
    getConnectionInfo();
  }, []);

  let chatInfo = "Select Someone to chat with or add connections";
  if (reciever !== "") {
    chatInfo = "Sending messages to " + reciever;
  }

  return (
    <div>
      <AddConnection />
      {connections}
      {chatInfo}
      <Chatbox reciver={reciever} />
    </div>
  );
}

export default ConnectionList;
