// Booking.js
import "bootstrap";
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap-icons/font/bootstrap-icons.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getUserRoleFirestore,
  getApprovedAppointments,
  getUserAppointments,
  getCurrentUserId,
} from "./firebase";
import Swal from "sweetalert2";
// Toast configuration for displaying messages
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

// Component for booking appointments
const Booking = ({ addNotification }) => {
  const [userId, setUserId] = useState(""); // State for storing user ID
  const [appointments, setAppointments] = useState([]); // State for storing appointments
  const [selectedDate, setSelectedDate] = useState(null); // State for storing selected date
  const [formData, setFormData] = useState({
    // State for form data
    name: "",
    appointmentType: "onsite",
    serviceType: "bathing",
    petName: "",
    species: "",
    breed: "",
    weight: "",
    age: "",
    status: "pending",
  });
  const [isFormOpen, setIsFormOpen] = useState(false); // State for controlling form visibility
  const [isValidDaySelected, setIsValidDaySelected] = useState(false); // State for checking if a valid day is selected
  const [termsChecked, setTermsChecked] = useState(false); // State for tracking if terms are checked
  const [userRole, setUserRole] = useState(""); // State to store user role
  const calendarRef = useRef(null);

  // Object mapping appointment status to colors
  const statusColors = {
    pending: "orange",
    canceled: "red",
    approved: "blue",
    completed: "green",
  };

  // Function to map appointment status to color
  const getStatusColor = (status) => {
    return statusColors[status] || "gray"; // Default color is gray for unknown status
  };

  // Fetch user role and appointments when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedInUserId = getCurrentUserId(); // Get current user's ID
        const [role, userAppointments, approvedAppointments] =
          await Promise.all([
            // Fetch user role and appointments
            getUserRoleFirestore(loggedInUserId),
            getUserAppointments(loggedInUserId),
            getApprovedAppointments(),
          ]);

        setUserRole(role); // Set user role

        // Filter out user's own approved appointments from the approvedAppointments array
        const filteredApprovedAppointments = approvedAppointments.filter(
          (appointment) => appointment.userId !== loggedInUserId
        );

        // Combine user's own appointments and filtered approved appointments
        const allAppointments = [
          ...filteredApprovedAppointments,
          ...userAppointments,
        ];

        // Set the combined appointments
        setAppointments(allAppointments);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData(); // Fetch data
  }, []);

  // Fetch user ID from local storage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId"); // Get user ID from local storage
    if (storedUserId) {
      setUserId(storedUserId); // Set user ID
    }
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const loggedInUserId = getCurrentUserId(); // Get current user's ID
      const userAppointments = await getUserAppointments(loggedInUserId); // Fetch user's appointments
      const approvedAppointments = await getApprovedAppointments(); // Fetch approved appointments

      const filteredApprovedAppointments = approvedAppointments.filter(
        // Filter out user's own approved appointments
        (appointment) => appointment.userId !== loggedInUserId
      );

      const allAppointments = [
        // Combine user's own appointments and filtered approved appointments
        ...filteredApprovedAppointments,
        ...userAppointments,
      ];
      setAppointments(allAppointments); // Set appointments
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };

  // Handle click on calendar event
  const handleEventClick = async (eventInfo) => {
    try {
      const loggedInUserId = getCurrentUserId(); // Get the current user's ID
      const userRole = await getUserRoleFirestore(loggedInUserId); // Get the user's role

      const appointmentId = eventInfo.event.id;
      const clickedAppointment = appointments.find(
        // Find clicked appointment
        (appointment) => appointment.id === appointmentId
      );

      if (!clickedAppointment) {
        console.error("Appointment not found.");
        return;
      }

      if (
        clickedAppointment.userId === loggedInUserId || // User owns the appointment
        userRole === "admin" // User is an admin
      ) {
        setFormData({
          // Set form data
          appointmentId: appointmentId,
          name: clickedAppointment.name,
          appointmentType: clickedAppointment.appointmentType,
          serviceType: clickedAppointment.serviceType,
          petName: clickedAppointment.petName,
          species: clickedAppointment.species,
          breed: clickedAppointment.breed,
          weight: clickedAppointment.weight,
          age: clickedAppointment.age,
        });
        setSelectedDate(clickedAppointment.date); // Set selected date
        setIsFormOpen(true); // Open form
      } else {
        // Show error message if user cannot edit/delete appointment
        Swal.fire({
          title: "Error",
          text: "You cannot edit or delete appointments that do not belong to you or are not pending.",
          icon: "error",
          heightAuto: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            Toast.fire({
              icon: "error",
              title:
                "You cannot edit or delete appointments that do not belong to you or are not pending.",
            });
          }
        });
      }
    } catch (error) {
      console.error("Error handling event click:", error.message);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      appointmentType: formData.appointmentType || "onsite",
      serviceType: formData.serviceType || "bathing",
    };

    if (
      !updatedFormData.name ||
      !updatedFormData.petName ||
      !updatedFormData.species ||
      !updatedFormData.breed ||
      !updatedFormData.weight ||
      !updatedFormData.age
    ) {
      Toast.fire({
        icon: "error",
        title: "Please fill in all the fields.",
      });
      return; // Exit early if fields are empty
    }

    const loggedInUserId = getCurrentUserId();

    if (formData.appointmentId) {
      // Update appointment
      Swal.fire({
        icon: "question",
        title: "Do you want to edit this appointment?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateAppointment(loggedInUserId, formData.appointmentId, {
            name: formData.name,
            appointmentType: formData.appointmentType,
            serviceType: formData.serviceType,
            petName: formData.petName,
            species: formData.species,
            breed: formData.breed,
            weight: formData.weight,
            age: formData.age,
          });
          addNotification({
            id: Date.now(),
            message: `Appointment updated successfully:`,
            data: `${JSON.stringify(formData)}`,
          }); // Pass formData containing appointment detailsls
          setIsFormOpen(false); // Close form
          setIsValidDaySelected(false);
          setFormData({
            name: "",
            appointmentType: "onsite",
            serviceType: "bathing",
            petName: "",
            species: "",
            breed: "",
            weight: "",
            age: "",
          });
          // Show success message
          Swal.fire({
            title: "success",
            text: "Appointment updated successfully",
            icon: "success",
            heightAuto: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              Toast.fire({
                icon: "success",
                title: "Appointment updated successfully",
              });
            }
          });
          fetchAppointments(); // Fetch appointments
        }
      });
    } else {
      // Create new appointment
      Swal.fire({
        icon: "question",
        title: "Do you want to create this appointment?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await createAppointment(loggedInUserId, {
            userId: loggedInUserId,
            date: selectedDate,
            name: formData.name,
            appointmentType: formData.appointmentType,
            serviceType: formData.serviceType,
            petName: formData.petName,
            species: formData.species,
            breed: formData.breed,
            weight: formData.weight,
            age: formData.age,
            status: formData.status,
          });
          addNotification({
            id: Date.now(),
            message: `Appointment created successfully:`,
            data: `${JSON.stringify(formData)}`,
          }); // Pass formData containing appointment detailsls
          setIsFormOpen(false); // Close form
          setIsValidDaySelected(false);
          setFormData({
            name: "",
            appointmentType: "onsite",
            serviceType: "bathing",
            petName: "",
            species: "",
            breed: "",
            weight: "",
            age: "",
          });
          // Show success message
          Swal.fire({
            title: "success",
            text: "Appointment created successfully",
            icon: "success",
            heightAuto: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              Toast.fire({
                icon: "success",
                title: "Appointment created successfully",
              });
            }
          });
          fetchAppointments(); // Fetch appointments
        }
      });
    }
  };

  // Handle deletion of appointment
  const handleDeleteAppointment = async () => {
    try {
      if (formData.appointmentId) {
        const loggedInUserId = getCurrentUserId(); // Get the current user's ID
        const clickedAppointment = appointments.find(
          // Find clicked appointment
          (appointment) => appointment.id === formData.appointmentId
        );

        if (!clickedAppointment) {
          console.error("Appointment not found.");
          return;
        }

        // Check if the user is an admin
        const userRole = await getUserRoleFirestore(loggedInUserId);
        if (userRole === "admin") {
          Swal.fire({
            icon: "question",
            title: "Do you want to delete this appointment?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
          }).then(async (result) => {
            if (result.isConfirmed) {
              // If user is admin, delete appointment
              await deleteAppointment(formData.appointmentId);
              setIsFormOpen(false); // Close form
              setIsValidDaySelected(false);
              setFormData({
                name: "",
                appointmentType: "onsite",
                serviceType: "bathing",
                petName: "",
                species: "",
                breed: "",
                weight: "",
                age: "",
              });
              addNotification({
                id: Date.now(),
                message: `Appointment deleted successfully:`,
                data: `${JSON.stringify(formData)}`,
              }); // Pass formData containing appointment detailsls
              fetchAppointments(); // Fetch appointments
              // Show success message
              Swal.fire({
                title: "success",
                text: "Appointment deleted successfully",
                icon: "success",
                type: "success",
                heightAuto: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Confirm",
              }).then((result) => {
                if (result.isConfirmed) {
                  Toast.fire({
                    icon: "success",
                    title: "Appointment deleted successfully",
                  });
                }
              });
              return;
            }
          });
        }

        // If user is not admin and appointment is pending, cancel appointment
        else if (
          clickedAppointment.userId === loggedInUserId &&
          clickedAppointment.status === "pending"
        ) {
          Swal.fire({
            icon: "question",
            title: "Do you want to cancel this appointment?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
          }).then(async (result) => {
            if (result.isConfirmed) {
              await deleteAppointment(formData.appointmentId);
              setIsFormOpen(false); // Close form
              setIsValidDaySelected(false);
              setFormData({
                name: "",
                appointmentType: "onsite",
                serviceType: "bathing",
                petName: "",
                species: "",
                breed: "",
                weight: "",
                age: "",
              });
              addNotification({
                id: Date.now(),
                message: `Appointment deleted successfully:`,
                data: `${JSON.stringify(formData)}`,
              }); // Pass formData containing appointment detailsls
              // Show success message
              Swal.fire({
                title: "success",
                text: "Appointment canceled successfully",
                icon: "success",
                type: "success",
                heightAuto: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Confirm",
              }).then((result) => {
                if (result.isConfirmed) {
                  Toast.fire({
                    icon: "success",
                    title: "Appointment canceled successfully",
                  });
                }
              });
              fetchAppointments(); // Fetch appointments
            }
          });
        } else {
          Swal.fire({
            // Show error message if user cannot cancel appointment
            title: "Error",
            text: "You cannot cancel appointments that do not belong to you or are not pending.",
            icon: "error",
            heightAuto: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              Toast.fire({
                icon: "error",
                title:
                  "You cannot delete appointments that do not belong to you or are not pending.",
              });
            }
          });
        }
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      Toast.fire({
        icon: "error",
        title: "Error deleting appointment",
      });
    }
  };

  // Handle selection of date on calendar
  const handleDateSelect = async (selectInfo) => {
    const loggedInUserId = getCurrentUserId(); // Get the current user's ID
    const userRole = await getUserRoleFirestore(loggedInUserId); // Get the user's role
    const startDate = selectInfo.startStr; // Get selected date
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date

    if (startDate >= currentDate) {
      // Check if selected date is valid
      // Check if the user already has a pending appointment
      const userPendingAppointments = appointments.filter(
        // Filter user's pending appointments
        (appointment) =>
          appointment.userId === loggedInUserId &&
          appointment.status === "pending"
      );

      setSelectedDate(startDate); // Set selected date
      setIsValidDaySelected(true); // Set valid day selected
      const calendarApi = calendarRef.current.getApi();
      if (selectInfo.view.type === "timeGridDay") {
        // Open form when day view is selected
        if (userRole === "user") {
          if (userPendingAppointments.length > 0) {
            // Notify the user that they already have a pending appointment
            Swal.fire({
              title: "Information",
              text: "You already have a pending appointment. Please wait for it to be processed.",
              icon: "info",
              heightAuto: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                Toast.fire({
                  icon: "info",
                  title:
                    "You already have a pending appointment. Please wait for it to be processed.",
                });
              }
            });
            return;
          }
          setIsFormOpen(true); // Open form
        }
      } else {
        // Change view to day grid when other views are selected
        calendarApi.changeView("timeGridDay", startDate);
      }
    } else {
      setIsFormOpen(false); // Close form if selected date is invalid
      setIsValidDaySelected(false);
      console.log("Cannot select past dates.");
    }
    if (userRole === "admin") {
      setIsFormOpen(false);
    }
    setFormData({
      // Reset form data
      name: "",
      appointmentType: "onsite",
      serviceType: "bathing",
      petName: "",
      species: "",
      breed: "",
      weight: "",
      age: "",
    });
  };

  // Handle view change on calendar
  const handleViewChange = (viewInfo) => {
    if (
      viewInfo.view.type !== "timeGrid" && // Close form when view is not time grid or day grid month
      viewInfo.view.type !== "dayGridMonth"
    ) {
      setIsFormOpen(false); // Close form
    }

    if (isValidDaySelected && viewInfo.view.type === "timeGrid") {
      // Open form when valid day is selected and view is time grid
      setIsFormOpen(true); // Open form
    }
  };

  // Handle terms checkbox change
  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked); // Set terms checked
  };

  const handleStatusChange = async (status) => {
    try {
      const loggedInUserId = getCurrentUserId();
      const clickedAppointment = appointments.find(
        (appointment) => appointment.id === formData.appointmentId
      );

      if (!clickedAppointment) {
        console.error("Appointment not found.");
        return;
      }

      const userRole = await getUserRoleFirestore(loggedInUserId);

      if (userRole === "admin") {
        await updateAppointment(loggedInUserId, formData.appointmentId, {
          status: status,
        });
        setIsFormOpen(false);
        setIsValidDaySelected(false);
        setFormData({
          name: "",
          appointmentType: "onsite",
          serviceType: "bathing",
          petName: "",
          species: "",
          breed: "",
          weight: "",
          age: "",
        });
        addNotification({
          id: Date.now(),
          message: `Appointment status updated successfully:`,
          data: `${JSON.stringify(formData)}`,
        });
        fetchAppointments();
        Swal.fire({
          title: "success",
          text: "Appointment status updated successfully",
          icon: "success",
          heightAuto: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            Toast.fire({
              icon: "success",
              title: "Appointment status updated successfully",
            });
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "You are not authorized to update appointment status.",
          icon: "error",
          heightAuto: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            Toast.fire({
              icon: "error",
              title: "You are not authorized to update appointment status.",
            });
          }
        });
      }
    } catch (error) {
      console.error("Error updating appointment status:", error.message);
      Toast.fire({
        icon: "error",
        title: "Error updating appointment status",
      });
    }
  };

  return (
    <section className="background-image">
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: "50px" }}>
          <h1>My Appointments</h1>
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
              bootstrap5Plugin,
            ]}
            themeSystem="bootstrap5"
            initialView="timeGridDay"
            initialDate={new Date().toISOString()} // Set initial date to current date/time
            timeZone="Asia/Manila" // Set timezone to Asia/Manila
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridDay,timeGridWeek,listWeek,listDay",
            }}
            events={appointments.map((appointment) => ({
              id: appointment.id,
              title: appointment.name,
              start: appointment.date,
              backgroundColor: getStatusColor(appointment.status), // Set color based on status
            }))}
            editable={true}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            slotDuration="01:00:00"
            allDaySlot={false}
            datesSet={handleViewChange}
            height="640px"
          />
        </div>
        <div style={{ flex: 0.3 }}>
          {isFormOpen && (
            <>
              <h2>Appointment Form</h2>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Appointment Type:</label>
                  <select
                    value={formData.appointmentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentType: e.target.value,
                      })
                    }
                  >
                    <option value="onsite">Onsite</option>
                    <option value="home">Home</option>
                  </select>
                </div>
                <div>
                  <label>Service Type:</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceType: e.target.value })
                    }
                  >
                    <option value="bathing">Bathing</option>
                    <option value="haircutting">Haircutting</option>
                    <option value="nail trimming">Nail Trimming</option>
                    <option value="ear trimming">Ear Trimming</option>
                  </select>
                </div>
                <div>
                  <label>Pet Name:</label>
                  <input
                    type="text"
                    value={formData.petName}
                    onChange={(e) =>
                      setFormData({ ...formData, petName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Species:</label>
                  <input
                    type="text"
                    value={formData.species}
                    onChange={(e) =>
                      setFormData({ ...formData, species: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Breed:</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) =>
                      setFormData({ ...formData, breed: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Weight:</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Age:</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={termsChecked}
                    onChange={handleTermsChange}
                  />
                  <label htmlFor="terms">
                    I agree to the <a href="/terms">Terms and Conditions</a>.
                  </label>
                </div>
                <button type="submit" disabled={!termsChecked}>
                  Submit
                </button>
                {/* Conditionally render the delete button */}
                {formData.appointmentId && (
                  <button type="button" onClick={handleDeleteAppointment}>
                    Delete
                  </button>
                )}

                {userRole === "admin" && (
                  <div className="dropdown">
                    <button
                      className={`btn btn-${getStatusColor(
                        formData.status ? formData.status : "pending"
                      )} dropdown-toggle`}
                      type="button"
                      id="statusDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {formData.status
                        ? formData.status.charAt(0).toUpperCase() +
                          formData.status.slice(1)
                        : "Status"}
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="statusDropdown"
                    >
                      {formData.status !== "pending" && (
                        <li>
                          <button
                            className={`dropdown-item btn btn-${getStatusColor(
                              "pending"
                            )}`}
                            type="button"
                            onClick={() => handleStatusChange("pending")}
                          >
                            Pending
                          </button>
                        </li>
                      )}
                      {formData.status !== "approved" && (
                        <li>
                          <button
                            className={`dropdown-item btn btn-${getStatusColor(
                              "approved"
                            )}`}
                            type="button"
                            onClick={() => handleStatusChange("approved")}
                          >
                            Approved
                          </button>
                        </li>
                      )}
                      {formData.status !== "canceled" && (
                        <li>
                          <button
                            className={`dropdown-item btn btn-${getStatusColor(
                              "canceled"
                            )}`}
                            type="button"
                            onClick={() => handleStatusChange("canceled")}
                          >
                            Canceled
                          </button>
                        </li>
                      )}
                      {formData.status !== "completed" && (
                        <li>
                          <button
                            className={`dropdown-item btn btn-${getStatusColor(
                              "completed"
                            )}`}
                            type="button"
                            onClick={() => handleStatusChange("completed")}
                          >
                            Completed
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Booking;
