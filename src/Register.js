// Register.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  dba,
  doc,
  setDoc,
  AuditLogger,
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
    if (
      !email ||
      !password ||
      !firstname ||
      !lastname ||
      !mobilenumber ||
      !landlinenumber ||
      !region ||
      !city ||
      !barangay ||
      !street ||
      !unit
    ) {
      Toast.fire({
        icon: "error",
        title: "Please fill in all the fields.",
      });
      return; // Exit early if fields are empty
    }
    try {
      Swal.fire({
        icon: "question",
        title: "Do you want to register this account?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
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

          const event = {
            type: "Register", // Type of event
            userId: userId, // User ID associated with the event
            details: "User registered", // Details of the event
          };

          // Call the AuditLogger function with the event object
          AuditLogger({ event });
          Swal.fire({
            title: "success",
            text: "Account registered successfully",
            icon: "success",
            heightAuto: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              Toast.fire({
                icon: "success",
                title: "Account registered successfully",
              });
            }
          });
          navigate("/homepage");
        }
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Email is already registered.",
      });
      console.error("Email is already registered.", error.message);
    }
  };

  return (
    <section className="background-image">
      <div className="centered">
        <h2>Register</h2>
        <div className="two-column-layout">
          <div className="form-group form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingFirst"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label for="floatingFirst">First Name</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingLast"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label for="floatingLast">Last Name</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="number"
              class="form-control"
              id="floatingMobile"
              placeholder="Mobile Number"
              value={mobilenumber}
              onChange={(e) => setMobilenumber(e.target.value)}
            />
            <label for="floatingMobile">Mobile Number</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="number"
              class="form-control"
              id="floatingLand"
              placeholder="Landline Number"
              value={landlinenumber}
              onChange={(e) => setLandlinenumber(e.target.value)}
            />
            <label for="floatingLand">Landline Number</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingRegion"
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <label for="floatingRegion">Region</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingCity"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <label for="floatingCity">City</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingBarangay"
              placeholder="Barangay"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
            />
            <label for="floatingBarangay">Barangay</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingStreet"
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <label for="floatingStreet">Street</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingUnit"
              placeholder="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
            <label for="floatingUnit">Unit</label>
          </div>
          <div className="form-group"></div>
          <div className="form-group form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="floatingEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label for="floatingEmail">Email</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="floatingPass"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label for="floatingPass">Password</label>
          </div>
        </div>
        <button class="btn btn-outline-primary" onClick={handleRegister}>
          Register
        </button>
        <br />
        <p>
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
    </section>
  );
};

export default Register;
