import React, { useState } from "react";
import axios from "axios";

function AddConnection() {
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send a POST request
    const response = await axios({
      method: "post",
      url: "/addConnection",
      type: "application/json",
      data: {
        name: userInfo["name"],
        mail: userInfo["email"],
        friend: email,
      },
    });
    if (response.data["status"] === 200) {
      alert(response.data["message"]);
      window.location.reload(false);
    } else {
      alert(response.data["message"]);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email: </label>
      <input
        type="email"
        value={email}
        placeholder="Enter connection's email"
        required
        onChange={({ target }) => setEmail(target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddConnection;
