// Dashboard.js

import React, { useState } from 'react';
import Notifications from './Notifications';

const Dashboard = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Hide notification after 3 seconds
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleShowNotification}>Show Notification</button>
      {showNotification && <Notifications message="You have 1 notification" />}
    </div>
  );
};

export default Dashboard;
