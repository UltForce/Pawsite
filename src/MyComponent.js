// src/MyComponent.js
import React, { useState } from "react";
import { app, getAuth, createUserWithEmailAndPassword } from "./firebase";

const MyComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registration successful!");
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default MyComponent;
