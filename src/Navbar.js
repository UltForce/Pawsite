import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, getCurrentUserId, getUserRoleFirestore } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCog,
  faBell,
  faShoppingCart,
  faSignOutAlt,
  faQuestionCircle,
  faInfoCircle,
  faImage,
  faCalendar,
  faTag,
  faAddressBook,
  faClapperboard,
} from "@fortawesome/free-solid-svg-icons";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userId = getCurrentUserId();
        const userRole = await getUserRoleFirestore(userId);
        setIsAdmin(userRole === "admin");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    Swal.fire({
      icon: "question",
      title: "Do you want to logout?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await auth.signOut();
          navigate("/login");
          Toast.fire({
            icon: "success",
            title: "Successfully Logout",
          });
        } catch (error) {
          console.error("Error logging out:", error.message);
        }
        Swal.fire({
          title: "success",
          text: "Account successfully logout.",
          icon: "success",
          type: "success",
          heightAuto: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            Toast.fire({
              icon: "success",
              title: "Account successfully logout.",
            });
          }
        });
      }
    });
  };

  return (
    <nav>
      <ul className="centeredNav">
        <li>
          <img src="pawsite2.png" height="50px" alt="Pawsite Logo" />
        </li>
        {isLoggedIn ? (
          <>
            {isAdmin && (
              <li
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                <Link to="/dashboard">
                  <FontAwesomeIcon icon={faClapperboard} />
                  <span className="nav-label"> Dashboard</span>
                </Link>
              </li>
            )}
            <li className={location.pathname === "/homepage" ? "active" : ""}>
              <Link to="/homepage">
                <FontAwesomeIcon icon={faHome} />
                <span className="nav-label"> Home</span>
              </Link>
            </li>
            <li className={location.pathname === "/About" ? "active" : ""}>
              <Link to="/About">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="nav-label"> About us</span>
              </Link>
            </li>
            <li className={location.pathname === "/Gallery" ? "active" : ""}>
              <Link to="/Gallery">
                <FontAwesomeIcon icon={faImage} />
                <span className="nav-label"> Gallery</span>
              </Link>
            </li>
            <li className={location.pathname === "/Shop" ? "active" : ""}>
              <Link to="/Shop">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="nav-label"> Shop</span>
              </Link>
            </li>
            <li
              className={location.pathname === "/notifications" ? "active" : ""}
            >
              <Link to="/notifications">
                <FontAwesomeIcon icon={faBell} />
                <span className="nav-label"> Notifications</span>
              </Link>
            </li>
            <li className={location.pathname === "/services" ? "active" : ""}>
              <Link to="/services">
                <FontAwesomeIcon icon={faTag} />
                <span className="nav-label"> Services</span>
              </Link>
            </li>
            <li className={location.pathname === "/booking" ? "active" : ""}>
              <Link to="/booking">
                <FontAwesomeIcon icon={faCalendar} />
                <span className="nav-label"> Book now</span>
              </Link>
            </li>
            <li className={location.pathname === "/terms" ? "active" : ""}>
              <Link to="/terms">
                <FontAwesomeIcon icon={faCog} />
                <span className="nav-label"> Terms & Conditions</span>
              </Link>
            </li>
            <li className={location.pathname === "/FAQs" ? "active" : ""}>
              <Link to="/FAQs">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span className="nav-label"> FAQs</span>
              </Link>
            </li>
            <li className={location.pathname === "/account" ? "active" : ""}>
              <Link to="/account">
                <FontAwesomeIcon icon={faUser} />
                <span className="nav-label"> Account</span>
              </Link>
            </li>
            <li>
              <Link onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="nav-label"> Logout</span>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className={location.pathname === "/login" ? "active" : ""}>
              <Link to="/login">
                <FontAwesomeIcon icon={faUser} />
                <span className="nav-label"> Login</span>
              </Link>
            </li>
            <li className={location.pathname === "/register" ? "active" : ""}>
              <Link to="/register">
                <FontAwesomeIcon icon={faAddressBook} />
                <span className="nav-label"> Register</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
