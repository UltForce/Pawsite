// Dashboard.js

import React, { useState, useEffect } from 'react';
import { generateReports } from "./firebase.js"; // Import the generateReports function
import { getAllUsers, getAllAppointments, getAllData, getAppointments, getUsers, getData, } from "./firebase.js";
import './dashboard.css'

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGenerateReports = async () => {
    try {
      // Call the generateReports function
      await generateReports();
      alert("Reports generated successfully!");
    } catch (error) {
      console.error("Error generating reports:", error.message);
      alert("An error occurred while generating reports.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        const appointments = await getAppointments();
        setAppointments(appointments);
        setUsers(users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="centered">
        <h2>Dashboard</h2>
        <p>Welcome to the dashboard!</p>

        {/* Appointment column */}
        <div className="appointmentReport">
          <h3>Appointments</h3>
          <table class="w3-table">
            <thead>
              <tr>
                <th>60</th>
                <th>15</th>
                <th>4</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Last 30 days</td>
                <td>Last 15 days</td>
                <td>Today</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        {/* Appointment Column */}

        {/* New customer table */}
        <div class="customerReport">
          <h3>New Customers</h3>
          {users.map((users, appointments) => (
          <table class="w3-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Appointment Date</th>
                <th>Service</th>
                <th>Appointment Status</th>
              </tr>
            </thead>
            <br></br>
            <tbody>  
    <tr>  
        <td>{users.firstname}</td>  
        <td>{users.lastname}</td>  
        <td>{users.mobilenumber}</td>  
        <td>{users.region}</td> 
        <td>{users.city}</td>  
        <td>{users.barangay}</td>  
        <td>{appointments.status}</td> 
  
    </tr>
    </tbody>
          </table>
          ))}
        </div>
        <br></br>
        {/* New customer table */}

        {/* Button to trigger report generation */}
        <button onClick={handleGenerateReports}>Generate Reports</button>
      </div>
    </>
  );
};

export default Dashboard;
