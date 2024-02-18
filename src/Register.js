// Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  dba,
  doc,
  setDoc,
} from "./firebase";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { sendEmailVerification } from "firebase/auth";

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

      // Access user properties directly from userCredential.user
      const userId = userCredential.user.uid;

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
      // Send email verification
      await sendEmailVerification(userCredential.user);
      Toast.fire({
        icon: "success",
        title: "Successfully Registered",
      });
      navigate("/homepage");
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Error registering.",
      });
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div className="centered">
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
