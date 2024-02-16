import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "./firebase"; // Make sure to import the necessary Firebase authentication functions

const Reset = () => {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);

      // Update state to indicate that reset email has been sent
      setResetSent(true);
    } catch (error) {
      // Handle error (e.g., display an error message)
      console.error("Error sending password reset email:", error.message);
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      {resetSent ? (
        <p>
          Password reset email has been sent. Please check your email and follow
          the instructions to reset your password.
        </p>
      ) : (
        <>
          <p>
            Enter your email address, and we will send you a link to reset your
            password.
          </p>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <button onClick={handleReset}>Send Reset Email</button>
        </>
      )}
      <p>
        Remember your password? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Reset;
