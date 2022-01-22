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
  }, [navigate]);

  const [reciever, setReciever] = useState("");
  const [chatInfo, setChatInfo] = useState();
  const [connections, setConnections] = useState([]);
  let chatData;

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
    setConnections(
      response.data["connections"].map((connection, i) => {
        return (
          <Connection
            key={i}
            email={connection["email"]}
            name={connection["name"]}
            setReciever={setReciever}
          />
        );
      })
    );
  };
  useEffect(() => {
    getConnectionInfo();
  }, []);
  useEffect(() => {
    if (reciever === "") {
      setChatInfo("Select someone to chat with or add connections");
    } else {
      setChatInfo("Sending messages to " + reciever);
    }
  }, [reciever]);

  if (reciever !== "") {
    chatData = (
      <div>
        <Chatbox reciever={reciever} />
        <button
          onClick={() => {
            setReciever("");
          }}
        >
          Close Chat
        </button>
      </div>
    );
  }

  return (
    <div>
      <AddConnection />
      {connections}
      {chatInfo}
      {chatData}
    </div>
  );
}

export default ConnectionList;
