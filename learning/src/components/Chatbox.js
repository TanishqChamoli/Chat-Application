import React, { useEffect, useState } from "react";
import Messagetext from "./Messagetext";
import ChatContent from "./ChatContent";
import axios from "axios";

let timer;

function Chatbox({ reciever }) {
  const [messages, setMessages] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessagesFound, setNewMessagesFound] = useState(0);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const getMessages = async (e) => {
    console.log("Called get messages");
    try {
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
      } else {
        return response.data["data"];
      }
    } catch (err) {
      console.log(err);
    } finally {
      console.log("Got messages");
    }
  };

  const checkForMessage = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/checkForMessage",
        type: "application/json",
        data: {
          own: userData["email"],
          friend: reciever,
        },
      });
      if (response.data["status"] === 200) {
        if (response.data["count"] !== messages.length) {
          console.log("New messages");
          setNewMessagesFound(response.data["count"]);
        }
      } else {
        console.log("not a 200");
      }
    } catch (err) {
      console.log(err);
    } finally {
      clearTimeout(timer);
      timer = setTimeout(checkForMessage, 5000);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getMessages().then((allMessages) => {
      setMessageData(allMessages);
    });
  }, [reciever]);

  useEffect(() => {
    setMessages(messageData);
    setIsLoading(false);
  }, [messageData]);

  useEffect(() => {
    if (isLoading === false) {
      getMessages().then((allMessages) => {
        setMessageData(allMessages);
      });
    }
  }, [newMessagesFound]);

  useEffect(() => {
    if (isLoading === false) {
      checkForMessage();
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      {isLoading ? (
        <p style={{ alignContent: "center" }}>Please wait loading messages</p>
      ) : (
        <ChatContent messages={messages} />
      )}
      <Messagetext reciever={reciever} />
    </div>
  );
}

export default Chatbox;
