import LoginForm from "./LoginForm";
import Signup from "./Signup";
import Home from "./Home";
import ConnectionList from "./ConnectionList";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/connections" element={<ConnectionList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
