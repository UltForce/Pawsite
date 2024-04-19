import React, { useState, useEffect } from "react";
import "./styles.css"; // Import CSS file for styling
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "./firebase.js";
import $ from "jquery";
import "datatables.net"; // Import DataTables library
const Notifications = () => {
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          navigate("/login"); // Redirect to login page if user is not logged in
        }
      } catch (error) {
        console.error("Error checking login status:", error.message);
        navigate("/login"); // Redirect to login page if error occurs
      }
    };

    checkLoggedInStatus();
  }, [navigate]); // Pass navigate as a dependency to useEffect
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  window.addEventListener("scroll", toggleVisibility);

  useEffect(() => {
    // Load notifications from session storage when component mounts
    const storedNotifications = sessionStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  useEffect(() => {
    // Initialize DataTable when notifications change
    if (notifications.length > 0) {
      $("#notificationsTable").DataTable({
        lengthMenu: [10, 25, 50, 75, 100],
        pagingType: "full_numbers",
        order: [],
        columnDefs: [
          { targets: "no-sort", orderable: false },
          // Add column definitions here if needed
        ],
        drawCallback: function () {
          $(this.api().table().container())
            .find("td")
            .css("border", "1px solid #ddd");
        },
        rowCallback: function (row, data, index) {
          $(row).hover(
            function () {
              $(this).addClass("hover");
            },
            function () {
              $(this).removeClass("hover");
            }
          );
        },
        stripeClasses: ["stripe1", "stripe2"],
      });
    }
  }, [notifications]);

  return (
    <section className="background-image">
      <br />
      <div className="centered">
        <div className="customerReport">
          <h1>Notifications</h1>

          {notifications && notifications.length > 0 ? (
            <table id="notificationsTable" className="display">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Service</th>
                  <th>Pet Name</th>
                  <th>Pet Species</th>
                  <th>Pet Breed</th>
                  <th>Pet Weight (kg)</th>
                  <th>Pet Age</th>
                  <th>Pet Birthdate</th>
                  <th>Pet Gender</th>
                  <th>Pet Color</th>
                  <th>Vaccination</th>
                  <th>Vaccination Date</th>
                  <th>First Grooming</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <tr key={index}>
                    {Object.entries(JSON.parse(notification.data)).map(
                      ([key, value]) =>
                        key !== "appointmentId" && <td key={key}>{value}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>
      {isVisible && (
        <button className="back-to-top" onClick={scrollToTop}>
          Back to Top
        </button>
      )}
    </section>
  );
};

export default Notifications;
