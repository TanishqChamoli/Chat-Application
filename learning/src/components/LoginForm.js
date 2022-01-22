import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send a POST request
    const response = await axios({
      method: "post",
      url: "/login",
      type: "application/json",
      data: {
        email: email,
        password: password,
      },
    });
    if (response.data["status"] === 200) {
      localStorage.setItem("userData", JSON.stringify(response.data["token"]));
      navigate("/connections", { replace: true });
    } else {
      alert(response.data["message"]);
    }
  };
  if (localStorage.getItem("userData") !== null) {
    return (
      <div>
        Already logged in <LogoutButton />
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email: </label>
      <input
        type="text"
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
        placeholder="Enter your password"
        required
        onChange={({ target }) => setPassword(target.value)}
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
