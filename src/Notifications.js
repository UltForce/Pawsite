import React from 'react';


const Notifications = ({ message }) => {
  return (
    <div style={{ 
      position: 'absolute',
      top: 0,
      width: '100%',
      backgroundColor: 'red',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      zIndex: '999',
    }}>
      {message}
    </div>
  );
};



export default Notifications;
