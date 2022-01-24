import React from "react";

export default function ChatContent({ messages }) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  var data = messages.map((message) => {
    if (userData["email"] === message["sender"]) {
      return (
        <div className="sent" key={message["date"] + message["message"]}>
          <p className="message">
            {message["message"]}
            <sub className="date">{message["date"]}</sub>
          </p>
        </div>
      );
    } else {
      return (
        <div className="recieved" key={message["date"] + message["message"]}>
          <p className="message">
            {message["message"]}
            <sub className="date">{message["date"]}</sub>
          </p>
        </div>
      );
    }
  });
  return <div>{data}</div>;
}
