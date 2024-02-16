// Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  dba,
  doc,
  setDoc,
} from "./firebase";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendEmailVerification } from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [landlinenumber, setLandlinenumber] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [street, setStreet] = useState("");
  const [unit, setUnit] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Additional setup logic for registered users
      const user = userCredential.user;

      // Fetch the UID of the registered user
      const userId = user.uid;

      // Send email verification
      await sendEmailVerification(user);

      // Store additional user details in Firestore along with the userID
      const userDocRef = doc(dba, "users", userId);
      await setDoc(userDocRef, {
        userId, // Include the userID in Firestore document
        role: "user",
        firstname,
        lastname,
        mobilenumber,
        landlinenumber,
        region,
        city,
        barangay,
        street,
        unit,
      });

      // Display success notification
      toast.success(`Registration Successful!`, {
        position: "top-right",
        autoClose: 3000, // Auto-close the notification after 3 seconds
        hideProgressBar: true,
      });
      navigate("/Login");
    } catch (error) {
      // Display error notification
      toast.error(`Error registering in: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <label>First Name:</label>
      <input
        type="text"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <br />
      <label>Last Name:</label>
      <input
        type="text"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <br />
      <label>Mobile Number:</label>
      <input
        type="number"
        value={mobilenumber}
        onChange={(e) => setMobilenumber(e.target.value)}
      />
      <br />
      <label>Landline Number:</label>
      <input
        type="number"
        value={landlinenumber}
        onChange={(e) => setLandlinenumber(e.target.value)}
      />
      <br />
      <label>Region:</label>
      <input
        type="text"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />
      <br />
      <label>City:</label>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <br />
      <label>Barangay:</label>
      <input
        type="text"
        value={barangay}
        onChange={(e) => setBarangay(e.target.value)}
      />
      <br />
      <label>Street:</label>
      <input
        type="text"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
      />
      <br />
      <label>Unit:</label>
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />
      <br />
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
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
