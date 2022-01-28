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
      setChatInfo(reciever);
    }
  }, [reciever]);

  if (reciever !== "") {
    chatData = (
      <div>
        <Chatbox reciever={reciever} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="col-md-3">
        <AddConnection />
        {connections}
      </div>
      <div className="col-md-9">
        {reciever !== "" ? (
          <div>
            <button
              onClick={() => {
                setReciever("");
              }}
              className="btn btn-primary"
            >
              <i className="glyphicon glyphicon-remove"></i>
            </button>
            Talking to <strong>{chatInfo}</strong>
          </div>
        ) : (
          ""
        )}
        {chatData}
      </div>
    </div>
  );
}

export default ConnectionList;
