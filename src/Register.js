// Register.js

import React, { useState, useRef } from "react";
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
  const LastNameInputRef = useRef(null);
  const MobileNumberInputRef = useRef(null);
  const LandlineNumberInputRef = useRef(null);
  const RegionInputRef = useRef(null);
  const CityInputRef = useRef(null);
  const BarangayInputRef = useRef(null);
  const StreetInputRef = useRef(null);
  const UnitInputRef = useRef(null);
  const EmailInputRef = useRef(null);
  const PasswordInputRef = useRef(null);

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
    if (!/\S+@\S+\.\S+/.test(email)) {
      Toast.fire({
        icon: "error",
        title: "Invalid email address.",
      });
      return; // Exit early if email is invalid
    }

    if (password.length < 6) {
      Toast.fire({
        icon: "error",
        title: "Password must be at least 6 characters long.",
      });
      return; // Exit early if password is less than 6 characters
    }

    Swal.fire({
      icon: "question",
      title: "Do you want to register this account?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
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
            email,
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
          navigate("/login");
        } catch (error) {
          console.log("Firebase error:", error.code); // Add this line to log the error code
          if (error.code === "auth/email-already-in-use") {
            Toast.fire({
              icon: "error",
              title: "Email is already registered.",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "An error occurred. Please try again later.",
            });
          }
          console.error("Email is already registered.", error.message);
        }
      }
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Check if the pressed key is Enter
      if (event.target.id === "floatingFirst") {
        LastNameInputRef.current.focus();
      } else if (event.target.id === "floatingLast") {
        MobileNumberInputRef.current.focus();
      } else if (event.target.id === "floatingMobile") {
        LandlineNumberInputRef.current.focus();
      } else if (event.target.id === "floatingLand") {
        RegionInputRef.current.focus();
      } else if (event.target.id === "floatingRegion") {
        CityInputRef.current.focus();
      } else if (event.target.id === "floatingCity") {
        BarangayInputRef.current.focus();
      } else if (event.target.id === "floatingBarangay") {
        StreetInputRef.current.focus();
      } else if (event.target.id === "floatingStreet") {
        UnitInputRef.current.focus();
      } else if (event.target.id === "floatingUnit") {
        EmailInputRef.current.focus();
      } else if (event.target.id === "floatingEmail") {
        PasswordInputRef.current.focus();
      } else {
        handleRegister();
      }
    }
  };

  return (
    <section className="background-image">
      <div className="centered">
        <h2>Register</h2>
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="row">
              <div className="form-floating mb-3 col-md-6">
                <input
                  type="text"
                  class="form-control"
                  id="floatingFirst"
                  placeholder="First Name"
                  value={firstname}
                  //onChange={(e) => setFirstname(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onChange={(e) => {
                    const firstnamevalue = e.target.value;
                    if (firstnamevalue.length <= 128) {
                      // Check if the value is positive or zero
                      setFirstname(firstnamevalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingFirst">
                  First Name
                </label>
              </div>

              <div className="  form-floating mb-3  col-md-6">
                <input
                  type="text"
                  class="form-control"
                  id="floatingLast"
                  placeholder="Last Name"
                  value={lastname}
                  //onChange={(e) => setLastname(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={LastNameInputRef}
                  onChange={(e) => {
                    const lastnamevalue = e.target.value;
                    if (lastnamevalue.length <= 128) {
                      // Check if the value is positive or zero
                      setLastname(lastnamevalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingLast">
                  Last Name
                </label>
              </div>
              <div className="  form-floating mb-3  col-md-6">
                <input
                  type="number"
                  class="form-control"
                  id="floatingMobile"
                  placeholder="Mobile Number"
                  value={mobilenumber}
                  //onChange={(e) => setMobilenumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={MobileNumberInputRef}
                  onChange={(e) => {
                    const mobilenumbervalue = e.target.value;
                    if (
                      mobilenumbervalue >= 0 &&
                      mobilenumbervalue.length <= 13
                    ) {
                      // Check if the value is positive or zero
                      setMobilenumber(mobilenumbervalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingMobile">
                  Mobile Number
                </label>
              </div>
              <div className="  form-floating mb-3  col-md-6">
                <input
                  type="number"
                  class="form-control"
                  id="floatingLand"
                  placeholder="Landline Number"
                  value={landlinenumber}
                  //onChange={(e) => setLandlinenumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={LandlineNumberInputRef}
                  onChange={(e) => {
                    const landlinenumbervalue = e.target.value;
                    if (
                      landlinenumbervalue >= 0 &&
                      landlinenumbervalue.length <= 128
                    ) {
                      // Check if the value is positive or zero
                      setLandlinenumber(landlinenumbervalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingLand">
                  Landline Number
                </label>
              </div>
              <div className="  form-floating mb-3  col-md-6">
                <input
                  type="text"
                  class="form-control"
                  id="floatingRegion"
                  placeholder="Region"
                  value={region}
                  //onChange={(e) => setRegion(e.target.value)}
                  onChange={(e) => {
                    const regionvalue = e.target.value;
                    if (regionvalue.length <= 128) {
                      // Check if the value is positive or zero
                      setRegion(regionvalue);
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  ref={RegionInputRef}
                />
                <label className="register-label" for="floatingRegion">
                  Region
                </label>
              </div>
              <div className="  form-floating mb-3  col-md-6">
                <input
                  type="text"
                  class="form-control"
                  id="floatingCity"
                  placeholder="City"
                  value={city}
                  //onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={CityInputRef}
                  onChange={(e) => {
                    const cityvalue = e.target.value;
                    if (cityvalue.length <= 128) {
                      // Check if the value is positive or zero
                      setCity(cityvalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingCity">
                  City
                </label>
              </div>
              <div className="  form-floating mb-3  col-md-6">
                <input
                  type="text"
                  class="form-control"
                  id="floatingBarangay"
                  placeholder="Barangay"
                  value={barangay}
                  //onChange={(e) => setBarangay(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={BarangayInputRef}
                  onChange={(e) => {
                    const barangayvalue = e.target.value;
                    if (barangayvalue.length <= 128) {
                      // Check if the value is positive or zero
                      setBarangay(barangayvalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingBarangay">
                  Barangay
                </label>
              </div>
              <div className="form-floating mb-3  col-md-6">
                <input
                  type="text"
                  class="form-control"
                  id="floatingStreet"
                  placeholder="Street"
                  value={street}
                  //onChange={(e) => setStreet(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={StreetInputRef}
                  onChange={(e) => {
                    const streetvalue = e.target.value;
                    if (streetvalue.length <= 128) {
                      // Check if the value is positive or zero
                      setStreet(streetvalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingStreet">
                  Street
                </label>
              </div>
              <div className=" form-floating mb-3  col-md-6">
                <input
                  type="text"
                  class="form-control"
                  id="floatingUnit"
                  placeholder="Unit"
                  value={unit}
                  //onChange={(e) => setUnit(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={UnitInputRef}
                  onChange={(e) => {
                    const unitvalue = e.target.value;
                    if (unitvalue.length <= 128) {
                      // Check if the value is positive or zero
                      setUnit(unitvalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingUnit">
                  Unit
                </label>
              </div>
              <div className="col-md-6"></div>
              <div className=" form-floating mb-3  col-md-6">
                <input
                  type="email"
                  class="form-control"
                  id="floatingEmail"
                  placeholder="Email"
                  value={email}
                  //onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={EmailInputRef}
                  onChange={(e) => {
                    const emailvalue = e.target.value;
                    if (emailvalue.length <= 128) {
                      // Check if the value is positive or zero
                      setEmail(emailvalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingEmail">
                  Email
                </label>
              </div>
              <div className=" form-floating mb-3  col-md-6">
                <input
                  type="password"
                  class="form-control"
                  id="floatingPass"
                  placeholder="Password"
                  value={password}
                  //onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={PasswordInputRef}
                  onChange={(e) => {
                    const passwordvalue = e.target.value;
                    if (passwordvalue.length <= 128) {
                      // Check if the value is positive or zero
                      setPassword(passwordvalue);
                    }
                  }}
                />
                <label className="register-label" for="floatingPass">
                  Password
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
        <br />
        <button class="btn btn-outline-primary" onClick={handleRegister}>
          Register
        </button>
        <br />
        <p>
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
      <div className="col-md-1"></div>
    </section>
  );
};

export default Register;
