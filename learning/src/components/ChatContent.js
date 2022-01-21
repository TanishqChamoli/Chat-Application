import React from "react";

export default function ChatContent({ messages }) {
  var data = messages.map((message) => {
    return (
      <div>
        <p className="sender">{message["sender"]}</p>
        <p className="message">{message["messageContent"]}</p>
      </div>
    );
  });
  return <div>{data}</div>;
}
