import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid"; // Import timeGrid plugin
import listPlugin from "@fullcalendar/list"; // Import list plugin
import interactionPlugin from "@fullcalendar/interaction"; // Import interaction plugin
import {
  getMyAppointments,
  createAppointment,
  deleteAppointment,
} from "./firebase";
import { auth } from "./firebase"; // Import Firebase authentication module

const getCurrentUserId = () => {
  // Check if a user is currently signed in
  const user = auth.currentUser;

  // If a user is signed in, return the user's UID (user ID)
  // If no user is signed in, return null or handle it according to your app logic
  return user ? user.uid : null;
};

const Booking = () => {
  const [userId, setUserId] = useState(""); // Assuming userId is managed locally
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    appointmentType: "",
    serviceType: "",
    petName: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form open/close
  const [isValidDaySelected, setIsValidDaySelected] = useState(false); // Track if a valid day is selected

  const calendarRef = useRef(null);

  useEffect(() => {
    // Fetch userId from wherever you store it (e.g., local storage, context, etc.)
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  useEffect(() => {
    fetchAppointments(); // Fetch appointments when the component mounts
  }, []); // Fetch appointments only once when the component mounts

  const fetchAppointments = async () => {
    const userAppointments = await getMyAppointments(userId);
    setAppointments(userAppointments);
  };

  const handleEventClick = async (eventInfo) => {
    const loggedInUserId = getCurrentUserId();
    const appointmentId = eventInfo.event.id;
    const clickedAppointment = appointments.find(
      (appointment) => appointment.id === appointmentId
    );

    if (!clickedAppointment) {
      console.error("Appointment not found.");
      return;
    }

    if (clickedAppointment.userId === loggedInUserId) {
      // If the appointment belongs to the current user, display options to edit or delete it
      const action = window.confirm(
        "Do you want to edit or delete this appointment?"
      );

      if (action) {
        // Edit the appointment
        // Implement your logic to edit the appointment here
      } else {
        // Delete the appointment
        try {
          await deleteAppointment(userId, appointmentId);
          fetchAppointments();
        } catch (error) {
          console.error("Error deleting appointment:", error);
        }
      }
    } else {
      // If the appointment does not belong to the current user, simply display the details
      alert(
        "You cannot edit or delete appointments that do not belong to you."
      );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Assuming you have a function to get the currently logged-in user's ID
    const loggedInUserId = getCurrentUserId(); // Implement this function according to your authentication logic

    // Assuming you have a function to add appointment data to Firebase
    await createAppointment(loggedInUserId, {
      userId: loggedInUserId, // Add the userId of the currently logged-in user
      date: selectedDate,
      name: formData.name,
      appointmentType: formData.appointmentType,
      serviceType: formData.serviceType,
      petName: formData.petName,
    });
    fetchAppointments();
    setFormData({
      name: "",
      appointmentType: "",
      serviceType: "",
      petName: "",
    });
    setIsFormOpen(false); // Close the form after submission
  };

  const handleDateSelect = (selectInfo) => {
    const startDate = selectInfo.startStr;
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    // Check if the selected date is not in the past
    if (startDate >= currentDate) {
      setSelectedDate(startDate);
      setIsValidDaySelected(true);
      const calendarApi = calendarRef.current.getApi();
      if (selectInfo.view.type === "timeGridDay") {
        setIsFormOpen(true); // Open the form when a time slot is selected in time grid view
      } else {
        calendarApi.changeView("timeGridDay", startDate); // Switch to timeGrid view and focus on the selected date
      }
    } else {
      setIsFormOpen(false);
      setIsValidDaySelected(false);
      console.log("Cannot select past dates.");
    }
  };

  const handleViewChange = (viewInfo) => {
    // Close the form if the current view is not timeGrid
    if (
      viewInfo.view.type !== "timeGrid" &&
      viewInfo.view.type !== "dayGridMonth"
    ) {
      setIsFormOpen(false);
    }

    // Open the form if a valid day is selected and view is timeGrid
    if (isValidDaySelected && viewInfo.view.type === "timeGrid") {
      setIsFormOpen(true);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <h2>My Appointments</h2>
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="timeGridDay" // Display one day view with time slots
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridDay,timeGridWeek,listWeek,listDay",
          }}
          events={appointments.map((appointment) => ({
            id: appointment.id,
            title: "Appointment",
            start: appointment.date,
          }))}
          editable={true}
          selectable={true}
          select={handleDateSelect} // Update event handler
          eventClick={handleEventClick}
          slotDuration="01:00:00" // Set slot duration to 1 hour
          allDaySlot={false} // Disable all-day slots
          datesSet={handleViewChange} // Listen for view change events
        />
      </div>
      <div style={{ flex: 1 }}>
        {isFormOpen && ( // Render the form only when isFormOpen is true
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
                  <option value="">Select Appointment Type</option>
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
                  <option value="">Select Service Type</option>
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
              <button type="submit">Submit</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
