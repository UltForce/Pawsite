// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Import your auth instance
import "./styles.css"; // Import the styles
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to the login page after logout
      toast.success(`Logout Successful!`, {
        position: "top-right",
        autoClose: 3000, // Auto-close the notification after 3 seconds
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/homepage">Homepage</Link>
        </li>
        <li>
          <Link to="/notifications">Notifications</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/booking">Booking</Link>
        </li>
        <li>
          <Link to="/FAQs">FAQs</Link>
        </li>
        <li>
          <Link to="/terms">Terms & Conditions</Link>
        </li>
        {isLoggedIn ? (
          <>
            {/* Show Logout when the user is logged in */}
            <li>
              <Link onClick={handleLogout}>Logout</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
          </>
          
        ) : (
          <>
            {/* Show Login and Register when the user is not logged in */}
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
