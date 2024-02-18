// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getCurrentUserId, getUserRoleFirestore } from "./firebase"; // Assuming you have functions to get the current user ID and fetch user role
import "./styles.css";
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

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initially set to false
  const [isAdmin, setIsAdmin] = useState(false); // Initially set to false
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userId = getCurrentUserId(); // Get the current user's ID
        const userRole = await getUserRoleFirestore(userId); // Fetch user role from Firestore
        setIsAdmin(userRole === "admin"); // Set isAdmin state based on user role
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to the login page after logout
      Toast.fire({
        icon: "success",
        title: "Successfully Logout",
      });
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <nav>
      <ul className="centeredNav">
        {isLoggedIn ? (
          <>
            {/* Render Dashboard link only if the user is an admin */}
            {isAdmin && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
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
            <li>
              <Link onClick={handleLogout}>Logout</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
          </>
        ) : (
          <>
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
