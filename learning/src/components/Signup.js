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
    if (response.data["status"] === 201) {
      alert("User Created");
      navigate("/login", { replace: true });
    } else {
      alert("Creation failed due to : " + response.data["message"]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="col-md-3 col-md-offset-4 align-center"
    >
      <div className="form-group">
        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          required
          onChange={({ target }) => setName(target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          required
          onChange={({ target }) => setEmail(target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          value={password}
          placeholder="Enter password"
          required
          onChange={({ target }) => setPassword(target.value)}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Create User
      </button>
    </form>
  );
}

export default Signup;
