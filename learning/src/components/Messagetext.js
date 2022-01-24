import React, { useState } from "react";
import axios from "axios";

export default function Messagetext({ reciever }) {
  const [toSend, setToSend] = useState("");
  const submitMessage = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const response = await axios({
      method: "post",
      url: "/sendMessage",
      type: "application/json",
      data: {
        sender: userData["email"],
        reciever: reciever,
        message: toSend,
      },
    });
    console.log(response.data);
    if (response.data["status"] !== 200) {
      alert(response.data["message"]);
    }
    setToSend("");
  };
  return (
    <div>
      <input
        onChange={({ target }) => setToSend(target.value)}
        value={toSend}
        type="text"
        placeholder="Type your message....."
      ></input>
      <button onClick={submitMessage}>Send</button>
    </div>
  );
}
