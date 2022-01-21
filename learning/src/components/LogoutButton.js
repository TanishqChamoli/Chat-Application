import React from "react";

function LogoutButton() {
  return (
    <div>
      <button
        onClick={() => {
          localStorage.removeItem("userData");
          window.location.reload(false);
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default LogoutButton;
