import React, { useState, useEffect, useRef } from "react";
import { generateReports } from "./firebase.js";
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
import { type } from "@testing-library/user-event/dist/type/index.js";

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
  const [filteredAppointments, setFilteredAppointments] = useState([]); // Initialize filteredAppointments state
  const [appointmentsLast30Days, setAppointmentsLast30Days] = useState([]);
  const [appointmentsLast15Days, setAppointmentsLast15Days] = useState([]);
  const [appointmentsToday, setAppointmentsToday] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]); // New state for upcoming appointments
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilters, setTypeFilters] = useState([]); // State for selected type filters
  const [serviceFilters, setServiceFilters] = useState([]); // State for selected service filters
  const [statusFilters, setStatusFilters] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [data, setData] = useState([]);

  const typeRef = useRef(null);
  const serviceRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointments = await getAppointments();
        setAppointments(appointments);
        setFilteredAppointments(appointments);

        const currentDate = new Date();
        const last30DaysDate = new Date();
        last30DaysDate.setDate(currentDate.getDate() - 30);

        const last15DaysDate = new Date();
        last15DaysDate.setDate(currentDate.getDate() - 15);

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
        // Calculate upcoming appointments
        const upcomingAppointments = appointments.filter(
          (appointment) => new Date(appointment.date) > currentDate
        );

        setAppointmentsLast30Days(appointmentsLast30Days);
        setAppointmentsLast15Days(appointmentsLast15Days);
        setAppointmentsToday(appointmentsToday);
        setUpcomingAppointments(upcomingAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };

    fetchAppointments();
  }, []);

  const handleGenerateReports = async () => {
    try {
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

  const handleSearch = () => {
    const filtered = appointments.filter((appointment) => {
      const nameMatch = appointment.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const petNameMatch = appointment.petName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const weightMatch =
        appointment.weight &&
        appointment.weight
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const ageMatch =
        appointment.age &&
        appointment.age
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const typeFilterMatch =
        typeFilters.length === 0 ||
        typeFilters.includes(appointment.appointmentType.toLowerCase());
      const serviceFilterMatch =
        serviceFilters.length === 0 ||
        serviceFilters.includes(appointment.serviceType.toLowerCase());
      const statusFilterMatch =
        statusFilters.length === 0 ||
        statusFilters.includes(appointment.status.toLowerCase());

      if (typeFilters.length === 0) {
        return (
          (nameMatch || petNameMatch || weightMatch || ageMatch) &&
          serviceFilterMatch &&
          statusFilterMatch
        );
      } else {
        return (
          (nameMatch || petNameMatch || weightMatch || ageMatch) &&
          typeFilterMatch &&
          serviceFilterMatch &&
          statusFilterMatch
        );
      }
    });

    setFilteredAppointments(filtered);
  };

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
    const handleClickOutside = (event) => {
      if (
        typeRef.current &&
        !typeRef.current.contains(event.target) &&
        !event.target.classList.contains("btn-outline-secondary")
      ) {
        setShowTypeDropdown(false);
      }
      if (
        serviceRef.current &&
        !serviceRef.current.contains(event.target) &&
        !event.target.classList.contains("btn-outline-primary")
      ) {
        setShowServiceDropdown(false);
      }
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target) &&
        !event.target.classList.contains("btn-outline-secondary")
      ) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTypeFilterChange = (event) => {
    const { value, checked } = event.target;
    console.log("Type filter changed:", value, checked);
    if (checked) {
      setTypeFilters([...typeFilters, value]);
    } else {
      setTypeFilters(typeFilters.filter((filter) => filter !== value));
    }
  };

  const handleServiceFilterChange = (event) => {
    const { value, checked } = event.target;
    console.log("Service filter changed:", value, checked);
    if (checked) {
      setServiceFilters([...serviceFilters, value]);
    } else {
      setServiceFilters(serviceFilters.filter((filter) => filter !== value));
    }
  };

  const handleStatusFilterChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setStatusFilters([...statusFilters, value]);
    } else {
      setStatusFilters(statusFilters.filter((filter) => filter !== value));
    }
  };

  // Sort filteredAppointments by date before rendering
  const sortedAppointments = filteredAppointments.slice().sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  return (
    <section className="background-image">
      <div className="centered page-transition">
        <h1 className="page-title">Dashboard</h1>

        <div className="appointmentReport">
          <h3>Appointments</h3>
          <table className="w3-table">
            <thead>
              <tr>
                <th>Last 30 days</th>
                <th>Last 15 days</th>
                <th>Today</th>
                <th>Upcoming</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{appointmentsLast30Days.length}</td>
                <td>{appointmentsLast15Days.length}</td>
                <td>{appointmentsToday.length}</td>
                <td>{upcomingAppointments.length}</td>{" "}
                {/* Display count of upcoming appointments */}
              </tr>
            </tbody>
          </table>
        </div>
        <br />

        <div className="search-container d-flex">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by Name, Pet name, Weight, or Age"
            className="form-control me-sm-2 search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Type dropdown */}
          <div className="dropdown btn-group" ref={typeRef}>
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              id="btnGroupDrop1"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              Type
            </button>
            <div
              aria-labelledby="btnGroupDrop1"
              className={`dropdown-menu ${showTypeDropdown ? "show" : ""}`}
            >
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="onsite"
                  onChange={handleTypeFilterChange}
                  checked={typeFilters.includes("onsite")}
                />
                Onsite
              </label>
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="home"
                  onChange={handleTypeFilterChange}
                  checked={typeFilters.includes("home")}
                />
                Home
              </label>
              {/* Add more checkboxes for other types */}
            </div>
          </div>
          {/* Service dropdown */}
          <div className="dropdown btn-group" ref={serviceRef}>
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              id="btnGroupDrop2"
              onClick={() => setShowServiceDropdown(!showServiceDropdown)}
            >
              Service
            </button>
            <div
              aria-labelledby="btnGroupDrop2"
              className={`dropdown-menu ${showServiceDropdown ? "show" : ""}`}
            >
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="bathing"
                  onChange={handleServiceFilterChange}
                  checked={serviceFilters.includes("bathing")}
                />
                Bathing
              </label>
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="haircutting"
                  onChange={handleServiceFilterChange}
                  checked={serviceFilters.includes("haircutting")}
                />
                Haircutting
              </label>
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="nail trimming"
                  onChange={handleServiceFilterChange}
                  checked={serviceFilters.includes("nail trimming")}
                />
                Nail Trimming
              </label>
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="ear trimming"
                  onChange={handleServiceFilterChange}
                  checked={serviceFilters.includes("ear trimming")}
                />
                Ear Trimming
              </label>
              {/* Add more checkboxes for other services */}
            </div>
          </div>
          {/* Status dropdown */}
          <div className="dropdown btn-group" ref={statusRef}>
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              id="btnGroupDrop3"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              Status
            </button>
            <div
              aria-labelledby="btnGroupDrop3"
              className={`dropdown-menu ${showStatusDropdown ? "show" : ""}`}
            >
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="pending"
                  onChange={handleStatusFilterChange}
                  checked={statusFilters.includes("pending")}
                />
                Pending
              </label>
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="approved"
                  onChange={handleStatusFilterChange}
                  checked={statusFilters.includes("approved")}
                />
                Approved
              </label>
              <label className="dropdown-item checkbox">
                <input
                  type="checkbox"
                  value="completed"
                  onChange={handleStatusFilterChange}
                  checked={statusFilters.includes("completed")}
                />
                Completed
              </label>
              <label className="dropdown-item checkbox ">
                <input
                  type="checkbox"
                  value="canceled"
                  onChange={handleStatusFilterChange}
                  checked={statusFilters.includes("canceled")}
                />
                Canceled
              </label>
              {/* Add more checkboxes for other status */}
            </div>
          </div>
          <button
            className="btn btn-secondary my-2 my-sm-0"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <br />
        <div className="customerReport">
          <h3>Appointment List</h3>
          <table className="w3-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Service</th>
                <th>Pet Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Weight (kg)</th>
                <th>Age</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment) => {
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
        <br />

        <button class="btn btn-outline-primary" onClick={handleGenerateReports}>
          Generate Reports
        </button>
        <br />
      </div>
    </section>
  );
};

export default Dashboard;
