import React, { useState, useEffect } from "react";
import "./styles.css"; // Import CSS file for styling

const Notifications = () => {
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

  return (
    <section className="background-image">
      <div className="centered">
        <h1>Notifications</h1>
        {notifications && notifications.length > 0 ? (
          <table className="account-table centered">
            <tbody>
              {notifications.map((notification, index) => (
                <p>
                  {notification.message}
                  <tr key={index}>
                    {notification.data &&
                      Object.entries(JSON.parse(notification.data)).map(
                        ([key, value]) => (
                          <tr className="notification-header" key={key}>
                            <th className="notification-header">{key}:</th>
                            <td className="notification-value">{value}</td>
                          </tr>
                        )
                      )}
                  </tr>
                </p>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No notifications</p>
        )}
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
