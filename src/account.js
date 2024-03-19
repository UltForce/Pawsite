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
    <section className="background-image">
      <div className="centered page-transition">
        <h1 className="page-title">Account</h1>
        {user && userData && (
          <div className="centered">
            <p className="lead">
              Welcome, {userData.firstname} {userData.lastname}!
            </p>
            <table className="account-table">
              <tbody>
                <tr>
                  <th>Email:</th>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <th>Mobile Number:</th>
                  <td>{userData.mobilenumber}</td>
                </tr>
                <tr>
                  <th>Landline Number:</th>
                  <td>{userData.landlinenumber}</td>
                </tr>
                <tr>
                  <th>Region:</th>
                  <td>{userData.region}</td>
                </tr>
                <tr>
                  <th>City:</th>
                  <td>{userData.city}</td>
                </tr>
                <tr>
                  <th>Barangay:</th>
                  <td>{userData.barangay}</td>
                </tr>
                <tr>
                  <th>Street:</th>
                  <td>{userData.street}</td>
                </tr>
                <tr>
                  <th>Unit:</th>
                  <td>{userData.unit}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <br></br>
        <button onClick={handleReset}>Send Change Password Email</button>
      </div>
    </section>
  );
};

export default Account;
