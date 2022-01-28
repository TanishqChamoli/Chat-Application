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
    <form onSubmit={submitMessage} className="form-inline">
      <div className="col-md-10">
        <textarea
          onChange={({ target }) => setToSend(target.value)}
          value={toSend}
          type="text"
          placeholder="Type your message....."
          required
          className="form-control"
          style={{ width: "100%" }}
        ></textarea>
      </div>
      <div className="col-md-2 d-flex justify-content-center">
        <button className="btn btn-primary">Send</button>
      </div>
    </form>
  );
}
