import React from 'react';

const Notifications = ({ message }) => {
  return (
    <div className="centered">
      <h2>Notifications</h2>
      <p>Welcome to the Notifications!</p>
      <p>{message}</p>
    </div>
  );
};

export default Notifications;
