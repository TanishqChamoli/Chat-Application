import React from "react";

function LogoutButton() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("userData");
        window.location.reload(false);
      }}
      className="btn btn-primary"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
