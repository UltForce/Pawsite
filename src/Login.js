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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        // Fetch user role from Firestore
        const userRole = await getUserRoleFirestore(user.uid);
        if (userRole === "admin") {
          navigate("/dashboard"); // Redirect admin to the dashboard
        } else {
          navigate("/homepage"); // Redirect regular user to the homepage
        }
        Toast.fire({
          icon: "success",
          title: "Successfully Logged In",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Username or Password is incorrect.",
      });
    }
  };
  
  return (
    <div>
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
