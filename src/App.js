import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Homepage from "./homepage";
import Navbar from "./Navbar";
import Notifications from "./Notifications";
import Services from "./services";
import Booking from "./Booking";
import FAQs from "./FAQs";
import Terms from "./Terms";
import Account from "./account";
import Reset from "./reset";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Define or import userId here
  const userId = "your-user-id"; // Replace with the actual userId
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />{" "}
        {/* Remove userId prop */}
        <Route path="/FAQs" element={<FAQs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/account" element={<Account />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </Router>
  );
}

export default App;
