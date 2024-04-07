// Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  getUserRoleFirestore,
  AuditLogger,
} from "./firebase";

import "react-toastify/dist/ReactToastify.css";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Check if email or password is empty
    if (!email) {
      Toast.fire({
        icon: "error",
        title: "Please enter your email",
      });
      return; // Exit early if fields are empty
    } else if (!password) {
      Toast.fire({
        icon: "error",
        title: "Please enter your password.",
      });
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Display success notification
      Toast.fire({
        icon: "success",
        title: "Successfully Login",
      });
      const event = {
        type: "Login", // Type of event
        userId: user.uid, // User ID associated with the event
        details: "User logged in", // Details of the event
      };

      // Call the AuditLogger function with the event object
      AuditLogger({ event });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Username or Password is incorrect.",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Fetch user role from Firestore
          const userRole = await getUserRoleFirestore(user.uid);
          if (userRole === "admin") {
            navigate("/dashboard"); // Redirect admin to the dashboard
          } else {
            navigate("/homepage"); // Redirect regular user to the homepage
          }
        } catch (error) {
          console.error("Error getting user role:", error.message);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  return (
    <section className="background-image">
      <div className="centered">
        <img src="pawsite2.png" height="200px" />
        <h2>Login</h2>
        <div class="form-floating mb-3">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="register-label" for="floatingInput">
            Email address
          </label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            autocomplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="register-label" for="floatingPassword">
            Password
          </label>
        </div>
        <br />
        <button class="btn btn-outline-primary" onClick={handleLogin}>
          Login
        </button>
        <br />
        <p>
          Don't have an account? <Link to="/register">Register here</Link>.
        </p>
        <p>
          Forgot Password? <Link to="/reset">Recover</Link>.
        </p>
      </div>
    </section>
  );
};

export default Login;
