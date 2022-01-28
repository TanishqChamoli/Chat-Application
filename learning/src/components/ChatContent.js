import React from "react";

export default function ChatContent({ messages }) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  var data = messages.map((message) => {
    if (userData["email"] === message["sender"]) {
      return (
        <div className="sent messages" key={message["id"] + message["message"]}>
          <p className="message">
            {message["message"]}
            <sub className="date">{message["date"]}</sub>
          </p>
          {message["status"] ? (
            <i className="fas fa-check-double"></i>
          ) : (
            <i className="fas fa-check"></i>
          )}
        </div>
      );
    } else {
      return (
        <div
          className="recieved messages"
          key={message["id"] + message["message"]}
        >
          <p className="message">
            {message["message"]}
            <sub className="date">{message["date"]}</sub>
          </p>
        </div>
      );
    }
  });
  return (
    <div className="chat-box">
      {messages.length === 0 ? (
        <div className="align-center">
          <strong>No messages,Say hello</strong>
        </div>
      ) : (
        data
      )}
    </div>
  );
}
