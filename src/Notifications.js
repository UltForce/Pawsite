import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./styles.css"; // Import CSS file for styling
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from session storage when component mounts
    const storedNotifications = sessionStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  const dismissNotification = (id) => {
    // Update the state using functional update to ensure it's based on the latest state
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );

    // Retrieve the updated notifications from the state
    const updatedNotifications = notifications.filter((n) => n.id !== id);

    // Store the updated notifications in session storage
    sessionStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  return (
     // <section className="background-image">
    <div>
      <h1>Notifications</h1>
      {notifications && notifications.length > 0 ? (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              {notification.message}
              {/* Check if notification.data is defined before parsing it */}
              {notification.data &&
                Object.entries(JSON.parse(notification.data)).map(
                  ([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  )
                )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications</p>
      )}
    </div>
    // </section>
  );
};

export default Notifications;
