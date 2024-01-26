// Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  getUserRoleFirestore,
} from "./firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Display success notification
      toast.success(`Welcome back, ${email}!`, {
        position: "top-right",
        autoClose: 3000, // Auto-close the notification after 3 seconds
        hideProgressBar: true,
      });
    } catch (error) {
      // Display error notification
      toast.error(`Error logging in: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
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

      
    </div>
  );
};

export default Login;
