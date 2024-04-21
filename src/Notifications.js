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
  const vaccinationformatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    // Check if dateTimeString is not applicable
    if (!dateTimeString) {
      return "N/A";
    }
    // Extract date, day of the week, and hour
    const year = dateTime.getFullYear();
    const month = ("0" + (dateTime.getMonth() + 1)).slice(-2); // Adding leading zero for single digit months
    const day = ("0" + dateTime.getDate()).slice(-2); // Adding leading zero for single digit days
    const dayOfWeek = dateTime.toLocaleDateString("en-US", { weekday: "long" });

    // Format date string with spaces and without minutes and seconds
    return `${year}-${month}-${day} ${dayOfWeek}`;
  };
  return (
    <section className="background-image">
      <br />
      <div className="centered">
        <div className="customerReport">
          <center>
            <h1>Notifications</h1>
          </center>
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
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <tr key={index}>
                    {Object.entries(JSON.parse(notification.data)).map(
                      ([key, value]) => {
                        if (key === "vaccinationDate") {
                          return (
                            <td key={key}>
                              {vaccinationformatDateTime(value)}
                            </td>
                          );
                        } else if (key !== "appointmentId" && key !== "petId") {
                          return <td key={key}>{value}</td>;
                        }
                        return null; // Skip rendering if key is "appointmentId" or "petId"
                      }
                    )}
                    <td>{notification.message}</td>
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
