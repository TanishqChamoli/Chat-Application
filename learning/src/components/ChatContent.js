import React from "react";

export default function ChatContent({ messages }) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  var data = messages.map((message) => {
    if (userData["email"] === message["sender"]) {
      return (
        <div className="sent">
          <p className="message">{message["message"]}</p>
          <sub className="date">{message["date"]}</sub>
        </div>
      );
    } else {
      return (
        <div className="recieved">
          <p className="message">{message["message"]}</p>
          <sub className="date">{message["date"]}</sub>
        </div>
      );
    }
  });
  return <div>{data}</div>;
}
