import React, { useState } from "react";
import Messagetext from "./Messagetext";
import ChatContent from "./ChatContent";

function Chatbox({ reciever }) {
  const [messages, setMessages] = useState([]);
  return (
    <div>
      <ChatContent messages={messages} />
      <Messagetext messages={messages} setMessages={setMessages} reciever={reciever} />
    </div>
  );
}

export default Chatbox;
