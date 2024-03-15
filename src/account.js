import React, { useState, useEffect } from "react";
import { auth, sendPasswordResetEmail, getUserData } from "./firebase"; // Make sure to import the necessary Firebase authentication and Firestore functions
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

const Account = () => {
  const [user, setUser] = useState(null); // State to store the current user's data
  const [userData, setUserData] = useState(null); // State to store user data from Firestore

  useEffect(() => {
    // Fetch the current user when the component mounts
    const currentUser = auth.currentUser;
    if (currentUser) {
      // If a user is logged in, set the user data
      setUser(currentUser);
      // Fetch user data from Firestore
      fetchUserData(currentUser.uid);
    } else {
      // If no user is logged in, set user to null
      setUser(null);
      setUserData(null); // Clear user data if no user is logged in
    }
  }, []);

  // Function to fetch user data from Firestore
  const fetchUserData = async (userId) => {
    try {
      const userData = await getUserData(userId);
      setUserData(userData); // Set user data in state
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setUserData(null); // Clear user data in case of error
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      Toast.fire({
        icon: "success",
        title: "Password reset link has been sent to email.",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Please login first.",
      });
      console.error("Error sending password reset email:", error.message);
    }
  };

  return (
    <div className="centered">
      <h1 className="page-title">Account</h1>
      {user && userData && (
        <div>
          <p className="lead">
            Welcome, {userData.firstname} {userData.lastname}!
          </p>
          <p>Email: {user.email}</p>
          <p>Mobile Number: {userData.mobilenumber}</p>
          <p>Landline Number: {userData.landlinenumber}</p>
          <p>Region: {userData.region}</p>
          <p>City: {userData.city}</p>
          <p>Barangay: {userData.barangay}</p>
          <p>Street: {userData.street}</p>
          <p>Unit: {userData.unit}</p>
        </div>
      )}
      <button onClick={handleReset}>Send Change Password Email</button>
    </div>
  );
};

export default Account;
