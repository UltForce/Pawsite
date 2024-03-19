// Dashboard.js

import React, { useState, useEffect } from "react";
import { generateReports } from "./firebase.js"; // Import the generateReports function
import {
  getAllUsers,
  getAllAppointments,
  getAllData,
  getAppointments,
  getUsers,
  getData,
} from "./firebase.js";
import "./dashboard.css";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLast30Days, setAppointmentsLast30Days] = useState([]); // Define state for appointments in last 30 days
  const [appointmentsLast15Days, setAppointmentsLast15Days] = useState([]); // Define state for appointments in last 15 days
  const [appointmentsToday, setAppointmentsToday] = useState([]); // Define state for appointments today
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointments = await getAppointments();

        // Get the current date
        const currentDate = new Date();

        // Calculate the date 30 days ago
        const last30DaysDate = new Date();
        last30DaysDate.setDate(currentDate.getDate() - 30);

        // Calculate the date 15 days ago
        const last15DaysDate = new Date();
        last15DaysDate.setDate(currentDate.getDate() - 15);

        // Filter appointments based on date ranges
        const appointmentsLast30Days = appointments.filter(
          (appointment) => new Date(appointment.date) >= last30DaysDate
        );
        const appointmentsLast15Days = appointments.filter(
          (appointment) => new Date(appointment.date) >= last15DaysDate
        );
        const appointmentsToday = appointments.filter(
          (appointment) =>
            new Date(appointment.date).toDateString() ===
            currentDate.toDateString()
        );

        // Update state with filtered appointments
        setAppointmentsLast30Days(appointmentsLast30Days);
        setAppointmentsLast15Days(appointmentsLast15Days);
        setAppointmentsToday(appointmentsToday);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };

    fetchAppointments();
  }, []);
  const handleGenerateReports = async () => {
    try {
      // Call the generateReports function
      await generateReports();
      Toast.fire({
        icon: "success",
        title: "Reports successfully generated..",
      });
    } catch (error) {
      console.error("Error generating reports:", error.message);
      alert("An error occurred while generating reports.");
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        const appointments = await getAppointments();
        setAppointments(appointments);
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="background-image">
      <div className="centered page-transition">
        <h1 className="page-title">Dashboard</h1>

        {/* Appointment column */}
        <div className="appointmentReport">
          <h3>Appointments</h3>
          <table class="w3-table">
            <thead>
              <tr>
                <th>Last 30 days</th>
                <th>Last 15 days</th>
                <th>Today</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{appointmentsLast30Days.length}</td>
                <td>{appointmentsLast15Days.length}</td>
                <td>{appointmentsToday.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        {/* Appointment Column */}

        {/* New customer table */}
        <div class="customerReport">
          <h3>Appointment List</h3>

          <table class="w3-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Service</th>
                <th>Pet Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Weight</th>
                <th>Age</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => {
                // Find the user corresponding to this appointment
                const user = users.find(
                  (user) => user.userId === appointment.userId
                );
                return (
                  <tr key={appointment.appointmentId}>
                    <td>{appointment.name}</td>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{appointment.appointmentType}</td>
                    <td>{appointment.serviceType}</td>
                    <td>{appointment.petName}</td>
                    <td>{appointment.species}</td>
                    <td>{appointment.breed}</td>
                    <td>{appointment.weight}</td>
                    <td>{appointment.age}</td>
                    <td>{appointment.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <br></br>
        {/* New customer table */}

        {/* Button to trigger report generation */}
        <button onClick={handleGenerateReports}>Generate Reports</button>
      </div>
    </section>
  );
};

export default Dashboard;
