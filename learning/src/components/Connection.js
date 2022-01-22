import React from "react";

function Connection({ name, email, setReciever }) {
  return (
    <div>
      <p>
        {name}:{email}
      </p>
      <button
        onClick={() => {
          setReciever(email);
        }}
      >
        Open Chat
      </button>
    </div>
  );
}

export default Connection;
