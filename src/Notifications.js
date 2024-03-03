import React, { useState } from 'react';
import './styles.css'; // Import CSS file for styling

const Notifications = ({ message }) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
  };

  // Return null if dismissed to hide the notification
  if (dismissed) {
    return null;
  }

  return (
    <div className="notification">
      <div className="content">
        <h2>Notification</h2>
        <p>{message}</p>
      </div>
      <button className="dismiss-button" onClick={handleDismiss}>
        Dismiss
      </button>
    </div>
  );
};

export default Notifications;
