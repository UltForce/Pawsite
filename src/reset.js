// reset.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "./firebase"; // Make sure to import the necessary Firebase authentication functions
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
const Reset = () => {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Toast.fire({
        icon: "error",
        title: "Please enter your email",
      });
      return; // Exit early if fields are empty
    }

    Swal.fire({
      icon: "question",
      title: "Do you want to send a change password link to this email?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await sendPasswordResetEmail(auth, email);
          Swal.fire({
            title: "success",
            text: "Password reset link sent successfully.",
            icon: "success",
            heightAuto: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              Toast.fire({
                icon: "success",
                title: "Password reset link has been sent to email.",
              });
            }
          });
          // Update state to indicate that reset email has been sent
          setResetSent(true);
        } catch (error) {
          Toast.fire({
            icon: "error",
            title: "Please enter a valid email.",
          });
          // Handle error (e.g., display an error message)
          console.error("Error sending password reset email:", error.message);
        }
      }
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Check if the pressed key is Enter
      handleReset(); // Call handleLogin function when Enter key is pressed
    }
  };

  return (
    <div className="centered background-image">
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
            onKeyPress={handleKeyPress} // Call handleKeyPress function on key press
          />
          <br />
          <button
            class="btn btn-outline-primary"
            onClick={handleReset}
            onKeyPress={handleKeyPress} // Call handleKeyPress function on key press
          >
            Send Reset Email
          </button>
        </>
      )}
      <br />
      <p>
        Remember your password? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Reset;
