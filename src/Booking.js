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
  auth,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getUserRoleFirestore,
  getApprovedAppointments,
  getUserAppointments,
  getCurrentUserId,
  getAllAppointments,
  AuditLogger,
} from "./firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          navigate("/login"); // Redirect to login page if user is not logged in
        }
      } catch (error) {
        console.error("Error checking login status:", error.message);
        navigate("/login"); // Redirect to login page if error occurs
      }
    };

    checkLoggedInStatus();
  }, [navigate]); // Pass navigate as a dependency to useEffect

  const [appointments, setAppointments] = useState([]); // State for storing appointments
  const [selectedDate, setSelectedDate] = useState(null); // State for storing selected date
  const [formData, setFormData] = useState({
    // State for form data
    name: "",
    appointmentType: "",
    serviceType: "Nail Trim",
    petName: "",
    species: "",
    breed: "",
    weight: "",
    age: "",
    status: "pending",
    birthdate: "",
    gender: "",
    color: "",
    vaccination: "",
    vaccinationDate: "N/A",
    firstGrooming: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false); // State for controlling form visibility
  const [isValidDaySelected, setIsValidDaySelected] = useState(false); // State for checking if a valid day is selected
  const [termsChecked, setTermsChecked] = useState(false); // State for tracking if terms are checked
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const PetNameInputRef = useRef(null);
  const SpeciesInputRef = useRef(null);
  const BreedNumberInputRef = useRef(null);
  const WeightInputRef = useRef(null);
  const AgeInputRef = useRef(null);
  const ColorInputRef = useRef(null);

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
  // Fetch user ID from local storage when component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userId = getCurrentUserId();
        const userRole = await getUserRoleFirestore(userId);
        setIsAdmin(userRole === "admin");
      }
    });
    fetchAppointments();
    return () => unsubscribe();
  }, []);
  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const loggedInUserId = getCurrentUserId(); // Get current user's ID
      const userRole = await getUserRoleFirestore(loggedInUserId);
      const adminAppointments = await getAllAppointments();
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
      if (userRole === "admin") {
        setAppointments(adminAppointments);
      } else {
        setAppointments(allAppointments); // Set appointments
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };

  // Handle click on calendar event
  const handleEventClick = async (eventInfo) => {
    try {
      const loggedInUserId = getCurrentUserId(); // Get the current user's I

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
        isAdmin // User is an admin
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
          birthdate: clickedAppointment.birthdate,
          gender: clickedAppointment.gender,
          color: clickedAppointment.color,
          vaccination: clickedAppointment.vaccination,
          vaccinationDate: clickedAppointment.vaccinationDate,
          firstGrooming: clickedAppointment.firstGrooming,
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
      serviceType: formData.serviceType || "Nail Trim",
    };

    if (
      !updatedFormData.name ||
      !updatedFormData.petName ||
      !updatedFormData.species ||
      !updatedFormData.breed ||
      !updatedFormData.weight ||
      !updatedFormData.age ||
      !updatedFormData.birthdate ||
      !updatedFormData.gender ||
      !updatedFormData.color ||
      !updatedFormData.vaccination ||
      (updatedFormData.vaccination === "yes" &&
        !updatedFormData.vaccinationDate) ||
      !updatedFormData.firstGrooming
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
            birthdate: formData.birthdate,
            gender: formData.gender,
            color: formData.color,
            vaccination: formData.vaccination,
            vaccinationDate: formData.vaccinationDate,
            firstGrooming: formData.firstGrooming,
          });
          addNotification({
            id: Date.now(),
            message: `Appointment updated successfully:`,
            data: `${JSON.stringify(formData)}`,
          }); // Pass formData containing appointment details
          const event = {
            type: "Appointment", // Type of event
            userId: loggedInUserId, // User ID associated with the event
            details: "User edited an existing appointment", // Details of the event
          };

          // Call the AuditLogger function with the event object
          AuditLogger({ event });
          setIsFormOpen(false); // Close form
          setIsValidDaySelected(false);
          setFormData({
            name: "",
            appointmentType: "",
            serviceType: "Nail Trim",
            petName: "",
            species: "",
            breed: "",
            weight: "",
            age: "",
            birthdate: "",
            gender: "",
            color: "",
            vaccination: "",
            vaccinationDate: "N/A",
            firstGrooming: "",
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
            birthdate: formData.birthdate,
            gender: formData.gender,
            color: formData.color,
            vaccination: formData.vaccination,
            vaccinationDate: formData.vaccinationDate,
            firstGrooming: formData.firstGrooming,
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
            appointmentType: "",
            serviceType: "Nail Trim",
            petName: "",
            species: "",
            breed: "",
            weight: "",
            age: "",
            birthdate: "",
            gender: "",
            color: "",
            vaccination: "",
            vaccinationDate: "N/A",
            firstGrooming: "",
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
          const event = {
            type: "Appointment", // Type of event
            userId: loggedInUserId, // User ID associated with the event
            details: "User created a new appointment", // Details of the event
          };

          // Call the AuditLogger function with the event object
          AuditLogger({ event });
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
        if (isAdmin) {
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
                appointmentType: "",
                serviceType: "Nail Trim",
                petName: "",
                species: "",
                breed: "",
                weight: "",
                age: "",
                birthdate: "",
                gender: "",
                color: "",
                vaccination: "",
                vaccinationDate: "N/A",
                firstGrooming: "",
              });
              addNotification({
                id: Date.now(),
                message: `Appointment deleted successfully:`,
                data: `${JSON.stringify(formData)}`,
              }); // Pass formData containing appointment detailsls
              const event = {
                type: "Appointment", // Type of event
                userId: loggedInUserId, // User ID associated with the event
                details: "User deleted an existing appointment", // Details of the event
              };

              // Call the AuditLogger function with the event object
              AuditLogger({ event });
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
                appointmentType: "",
                serviceType: "Nail Trim",
                petName: "",
                species: "",
                breed: "",
                weight: "",
                age: "",
                birthdate: "",
                gender: "",
                color: "",
                vaccination: "",
                vaccinationDate: "N/A",
                firstGrooming: "",
              });
              addNotification({
                id: Date.now(),
                message: `Appointment canceled successfully:`,
                data: `${JSON.stringify(formData)}`,
              }); // Pass formData containing appointment detailsls
              const event = {
                type: "Appointment", // Type of event
                userId: loggedInUserId, // User ID associated with the event
                details: "User canceled an existing appointment", // Details of the event
              };

              // Call the AuditLogger function with the event object
              AuditLogger({ event });
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
        if (!isAdmin) {
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
        } else {
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

    setFormData({
      // Reset form data
      name: "",
      appointmentType: "",
      serviceType: "Nail Trim",
      petName: "",
      species: "",
      breed: "",
      weight: "",
      age: "",
      birthdate: "",
      gender: "",
      color: "",
      vaccination: "",
      vaccinationDate: "N/A",
      firstGrooming: "",
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

      if (isAdmin) {
        await updateAppointment(loggedInUserId, formData.appointmentId, {
          status: status,
        });
        setIsFormOpen(false);
        setIsValidDaySelected(false);
        setFormData({
          name: "",
          appointmentType: "",
          serviceType: "Nail Trim",
          petName: "",
          species: "",
          breed: "",
          weight: "",
          age: "",
          birthdate: "",
          gender: "",
          color: "",
          vaccination: "",
          vaccinationDate: "N/A",
          firstGrooming: "",
        });
        addNotification({
          id: Date.now(),
          message: `Appointment status updated successfully:`,
          data: `${JSON.stringify(formData)}`,
        });
        const event = {
          type: "Appointment", // Type of event
          userId: loggedInUserId, // User ID associated with the event
          details: "User changed the status of an existing appointment", // Details of the event
        };

        // Call the AuditLogger function with the event object
        AuditLogger({ event });
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Check if the pressed key is Enter
      if (event.target.id === "floatingName") {
        PetNameInputRef.current.focus();
      } else if (event.target.id === "floatingPet") {
        SpeciesInputRef.current.focus();
      } else if (event.target.id === "floatingSpecies") {
        BreedNumberInputRef.current.focus();
      } else if (event.target.id === "floatingBreed") {
        WeightInputRef.current.focus();
      } else if (event.target.id === "floatingWeight") {
        AgeInputRef.current.focus();
      } else if (event.target.id === "floatingAge") {
        ColorInputRef.current.focus();
      }
    }
  };
  // Define handleVaccinationChange function to update vaccination status and date in formData state
  const handleVaccinationChange = (e) => {
    const vaccinationStatus = e.target.value;

    // Update vaccination status
    setFormData({ ...formData, vaccination: vaccinationStatus });

    // If vaccination status is "no", set vaccination date to "N/A"
    if (vaccinationStatus === "no") {
      setFormData({ ...formData, vaccination: "no", vaccinationDate: "" });
    } else if (formData.vaccination === "no") {
      // If changing from "no" to "yes", clear vaccination date
      setFormData({ ...formData, vaccinationDate: "" });
    }
  };

  // Define handleBirthdateChange function to update birthdate in formData state
  const handleBirthdateChange = (e) => {
    const selectedDate = e.target.value;
    // Check if selected date is not in the future
    if (selectedDate <= new Date().toISOString().split("T")[0]) {
      setFormData({ ...formData, birthdate: selectedDate });
    } else {
      Toast.fire({
        icon: "error",
        title: "Birthdate cannot be in the future",
      });
    }
  };

  // Define handleVaccinationDateChange function to update vaccination date in formData state
  const handleVaccinationDateChange = (e) => {
    const selectedDate = e.target.value;
    const petBirthdate = formData.birthdate; // Get pet's birthdate from formData state

    if (!petBirthdate) {
      // Check if pet's birthdate is not set
      Toast.fire({
        icon: "error",
        title: "Please set the pet's birthdate first",
      });
      return; // Exit function early
    }

    // Check if selected date is not in the future
    if (selectedDate <= new Date().toISOString().split("T")[0]) {
      // Check if selected date is later than pet's birthdate
      if (selectedDate >= petBirthdate) {
        setFormData({ ...formData, vaccinationDate: selectedDate });
      } else {
        Toast.fire({
          icon: "error",
          title: "Vaccination date cannot be earlier than pet's birthdate",
        });
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Vaccination date cannot be in the future",
      });
    }
  };

  return (
    <section className="background-shadow">
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
              right: "dayGridMonth,timeGridDay,timeGridWeek,listDay",
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
            allDaySlot={false}
            datesSet={handleViewChange}
            expandRows={true}
            height="975px"
            eventMinWidth={1000}
            eventTimeFormat={{
              // Set custom time format
              hour: "numeric",
              minute: "numeric",
            }}
            slotMinTime="08:00:00" // Set the earliest time to 8am
            slotMaxTime="17:30:00" // Set the latest time to 5pm
            slotDuration="01:00:00" // Set the duration of each time slot to 30 minutes
          />
        </div>

        <div style={{ flex: 0.3 }}>
          {isFormOpen && (
            <>
              <h2>Appointment Form</h2>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingName"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Name"
                    id="floatingName"
                    value={formData.name}
                    onChange={(e) => {
                      const namevalue = e.target.value;
                      if (namevalue.length <= 128) {
                        setFormData({ ...formData, name: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div>
                  <label
                    className="col-form-label col-form-label-sm"
                    for="typeOptions"
                  >
                    Appointment Type:
                  </label>
                  <div id="typeOptions">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="type"
                        id="onsite"
                        value="onsite"
                        checked={formData.appointmentType === "onsite"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            appointmentType: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" for="onsite">
                        Onsite
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="type"
                        id="home"
                        value="home"
                        checked={formData.appointmentType === "home"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            appointmentType: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" for="home">
                        Home
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label>Service Type:</label>
                  <select
                    class="form-select form-select-sm booking-form"
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceType: e.target.value })
                    }
                  >
                    <option value="Nail Trim">Nail Trim</option>
                    <option value="Paw Trim">Paw Trim</option>
                    <option value="Face Trim">Face Trim</option>
                    <option value="Sanitary Trim">Sanitary Trim</option>
                    <option value="Teethbrushing">Teethbrushing</option>
                    <option value="Ear Cleaning">Ear Cleaning</option>
                    <option value="Anal Sac">Anal Sac</option>
                    <option value="Bath / Dry">Bath / Dry</option>
                    <option value="Basic Grooming">Basic Grooming</option>
                    <option value="Full Grooming">Full Grooming</option>
                    <option value="Cat Grooming">Cat Grooming</option>
                  </select>
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingPet"
                  >
                    Pet Name:
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Name"
                    id="floatingPet"
                    value={formData.petName}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 128) {
                        setFormData({ ...formData, petName: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={PetNameInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingSpecies"
                  >
                    Pet Species:
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Species"
                    id="floatingSpecies"
                    value={formData.species}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 128) {
                        setFormData({ ...formData, species: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={SpeciesInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingBreed"
                  >
                    Pet Breed:
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Breed"
                    id="floatingBreed"
                    value={formData.breed}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 128) {
                        setFormData({ ...formData, breed: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={BreedNumberInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingWeight"
                  >
                    Pet Weight: (kg)
                  </label>
                  <input
                    type="number"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Weight"
                    id="floatingWeight"
                    value={formData.weight}
                    onChange={(e) => {
                      const weightValue = e.target.value;
                      if (weightValue >= 0 && weightValue.length <= 128) {
                        // Check if the value is positive or zero
                        setFormData({ ...formData, weight: weightValue });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={WeightInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingAge"
                  >
                    Pet Age:
                  </label>
                  <input
                    type="number"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Age"
                    id="floatingAge"
                    value={formData.age}
                    onChange={(e) => {
                      const ageValue = e.target.value;
                      if (ageValue >= 0 && ageValue.length <= 128) {
                        // Check if the value is positive or zero
                        setFormData({ ...formData, age: ageValue });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={AgeInputRef}
                  />
                </div>

                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingColor"
                  >
                    Pet Color:
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Color"
                    id="floatingColor"
                    value={formData.color}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 128) {
                        setFormData({ ...formData, color: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={ColorInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingBirthdate"
                  >
                    Pet Birthdate:
                  </label>
                  <input
                    type="date"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Birthdate"
                    id="floatingBirthdate"
                    value={formData.birthdate}
                    onChange={handleBirthdateChange}
                  />
                </div>
                <div>
                  <label
                    className="col-form-label col-form-label-sm"
                    for="genderOptions"
                  >
                    Pet Gender:
                  </label>
                  <div id="genderOptions">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="male"
                        value="male"
                        checked={formData.gender === "male"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      />
                      <label className="form-check-label" for="male">
                        Male
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="female"
                        value="female"
                        checked={formData.gender === "female"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      />
                      <label className="form-check-label" for="female">
                        Female
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="col-form-label col-form-label-sm"
                    htmlFor="vaccinationOptions"
                  >
                    Vaccination:
                  </label>
                  <div id="vaccinationOptions">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="vaccination"
                        id="vaccinationyes"
                        value="yes"
                        checked={formData.vaccination === "yes"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vaccination: e.target.value,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="vaccinationyes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="vaccination"
                        id="vaccinationno"
                        value="no"
                        checked={formData.vaccination === "no"}
                        onChange={handleVaccinationChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="vaccinationno"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
                {formData.vaccination === "yes" && ( // Conditionally render if vaccination is yes
                  <div>
                    <label
                      className="col-form-label col-form-label-sm"
                      htmlFor="vaccinationDate"
                    >
                      Vaccination Date:
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm booking-form"
                      id="vaccinationDate"
                      value={formData.vaccinationDate}
                      onChange={handleVaccinationDateChange}
                    />
                  </div>
                )}

                <div>
                  <label
                    className="col-form-label col-form-label-sm"
                    for="groomingOptions"
                  >
                    First Grooming:
                  </label>
                  <div id="groomingOptions">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="grooming"
                        id="groomingyes"
                        value="yes"
                        checked={formData.firstGrooming === "yes"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstGrooming: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" for="groomingyes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="grooming"
                        id="groomingno"
                        value="no"
                        checked={formData.firstGrooming === "no"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstGrooming: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" for="groomingno">
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <br />
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
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  disabled={!termsChecked}
                >
                  Submit
                </button>
                {/* Conditionally render the delete button */}
                {formData.appointmentId && (
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={handleDeleteAppointment}
                  >
                    Delete
                  </button>
                )}
                {isAdmin && (
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
                        : "Change Status"}
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
      <br />
    </section>
  );
};

export default Booking;
