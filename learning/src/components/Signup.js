import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send a POST request
    const response = await axios({
      method: "post",
      url: "/signup",
      type: "application/json",
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
    // setName("");
    // setEmail("");
    // setPassword("");
    if (response.data["status"] === 201) {
      alert("User Created");
      navigate("/login", { replace: true });
    } else {
      alert("Creation failed due to : " + response.data["message"]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name: </label>
      <input
        type="text"
        value={name}
        placeholder="Enter your name"
        required
        onChange={({ target }) => setName(target.value)}
      />
      <br />
      <label htmlFor="email">Email: </label>
      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        required
        onChange={({ target }) => setEmail(target.value)}
      />
      <br />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        value={password}
        placeholder="Enter password"
        required
        onChange={({ target }) => setPassword(target.value)}
      />
      <br />
      <button type="submit">Create User</button>
    </form>
  );
}

export default Signup;
