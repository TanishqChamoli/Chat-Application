import React, { useEffect, useState } from "react";
import Messagetext from "./Messagetext";
import ChatContent from "./ChatContent";
import axios from "axios";

function Chatbox({ reciever }) {
  const [messages, setMessages] = useState([]);
  const [sentMessage, setSentMessage] = useState("");

  const getMessages = async (e) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const response = await axios({
      method: "post",
      url: "/getMessages",
      type: "application/json",
      data: {
        own: userData["email"],
        friend: reciever,
      },
    });
    if (response.data["status"] !== 200) {
      alert(response.data["message"]);
    }
    return response.data;
  };

  useEffect(() => {
    getMessages().then((response) => setMessages(response["data"]));
  }, [reciever, sentMessage]);

  return (
    <div>
      <ChatContent messages={messages} />
      <Messagetext reciever={reciever} setSentMessage={setSentMessage} />
    </div>
  );
}

export default Chatbox;
