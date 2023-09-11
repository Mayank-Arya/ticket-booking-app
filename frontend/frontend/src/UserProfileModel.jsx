import React, { useState, useEffect } from "react";
import "./UserProfileModel.css";

function UserProfileModel({ onClose, onEdit }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("username");

    if (storedEmail && storedName) {
      setUser({ email: storedEmail, name: storedName });
    }
  }, []);

  return (
    <div className="modal-overlay">
      <div className="user-profile-modal">
        <h2>User Profile</h2>
        {user ? (
          <>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </>
        ) : (
          <p>Loading user profile...</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UserProfileModel;
