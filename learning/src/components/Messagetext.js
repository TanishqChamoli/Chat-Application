import React, { useState } from "react";
import axios from "axios";

export default function Messagetext({ messages, setMessages, reciever }) {
  const [message, setMessage] = useState();
  const submitMessage = async (e) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const response = await axios({
      method: "post",
      url: "/sendMessage",
      type: "application/json",
      data: {
        sender: userData["email"],
        reciever: reciever,
        message: message,
      },
    });
    setMessage("");
    console.log(response.data["connections"]);
  };
  return (
    <div>
      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        type="text"
        placeholder="Type your message....."
      ></input>
      <button onClick={() => submitMessage}>Send</button>
    </div>
  );
}
