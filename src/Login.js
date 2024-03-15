// Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  getUserRoleFirestore,
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
      await signInWithEmailAndPassword(auth, email, password);
      // Display success notification
      Toast.fire({
        icon: "success",
        title: "Successfully Login",
      });
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
    <div className="centered">
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
      <p>
        Forgot Password? <Link to="/reset">Recover</Link>.
      </p>
    </div>
  );
};

export default Login;
