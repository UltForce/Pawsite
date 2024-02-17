import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDocs,
  getUserRoleFirestore,
  collection,
  getFirestore,
  query,
  getAllAppointments,
  getApprovedAppointments,
  getUserAppointments,
  getCurrentUserId,
} from "./firebase";
import { auth } from "./firebase";
import { toast } from "react-toastify"; // Import toast module
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

const Booking = () => {
  const dba = getFirestore(); // Use dba as Firestore instance
  const [userId, setUserId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    appointmentType: "",
    serviceType: "",
    petName: "",
    status: "pending",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isValidDaySelected, setIsValidDaySelected] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const calendarRef = useRef(null);

  useEffect(() => {
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
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userId = getCurrentUserId();

      // Fetch user's own appointments
      const userAppointments = await getUserAppointments(userId);

      // Fetch all approved appointments
      let approvedAppointments = await getApprovedAppointments();

      // Filter out user's own approved appointments from the approvedAppointments array
      approvedAppointments = approvedAppointments.filter(
        (appointment) => appointment.userId !== userId
      );

      // Combine user's own appointments and approved appointments
      const allAppointments = [...approvedAppointments, ...userAppointments];

      // Set the combined appointments
      setAppointments(allAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };
  fetchAppointments();
  const handleEventClick = async (eventInfo) => {
    try {
      const loggedInUserId = getCurrentUserId(); // Get the current user's ID
      const userRole = await getUserRoleFirestore(loggedInUserId); // Get the user's role

      const appointmentId = eventInfo.event.id;
      const clickedAppointment = appointments.find(
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
          appointmentId: appointmentId,
          name: clickedAppointment.name,
          appointmentType: clickedAppointment.appointmentType,
          serviceType: clickedAppointment.serviceType,
          petName: clickedAppointment.petName,
        });
        setSelectedDate(clickedAppointment.date);
        setIsFormOpen(true);
      } else {
        Swal.fire({
          title: "Error",
          text: "You cannot edit or delete appointments that do not belong to you.",
          icon: "error",
          type: "error",
          heightAuto: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            Toast.fire({
              icon: "error",
              title:
                "You cannot edit or delete appointments that do not belong to you.",
            });
          }
        });
      }
    } catch (error) {
      console.error("Error handling event click:", error.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const loggedInUserId = getCurrentUserId();

    if (formData.appointmentId) {
      Swal.fire({
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
          });
          setIsFormOpen(false);
          setIsValidDaySelected(false);
          setFormData({
            name: "",
            appointmentType: "",
            serviceType: "",
            petName: "",
          });
          Swal.fire({
            title: "success",
            text: "Appointment updated successfully",
            icon: "success",
            type: "success",
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
        }
      });
    } else {
      Swal.fire({
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
            status: formData.status,
          });
          setIsFormOpen(false);
          setIsValidDaySelected(false);
          setFormData({
            name: "",
            appointmentType: "",
            serviceType: "",
            petName: "",
          });
          Swal.fire({
            title: "success",
            text: "Appointment created successfully",
            icon: "success",
            type: "success",
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
        }
      });
    }
    fetchAppointments();
  };

  const handleDeleteAppointment = async () => {
    try {
      if (formData.appointmentId) {
        Swal.fire({
          title: "Do you want to delete this appointment?",
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: `No`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            await deleteAppointment(formData.appointmentId);
            toast.success("Appointment deleted successfully");
            fetchAppointments();
            setIsFormOpen(false);
            setIsValidDaySelected(false);
            setFormData({
              name: "",
              appointmentType: "",
              serviceType: "",
              petName: "",
            });
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
          }
        });
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Error deleting appointment");
    }
  };

  const handleDateSelect = async (selectInfo) => {
    const loggedInUserId = getCurrentUserId(); // Get the current user's ID
    const userRole = await getUserRoleFirestore(loggedInUserId); // Get the user's role
    const startDate = selectInfo.startStr;
    const currentDate = new Date().toISOString().split("T")[0];

    if (startDate >= currentDate) {
      setSelectedDate(startDate);
      setIsValidDaySelected(true);
      const calendarApi = calendarRef.current.getApi();
      if (selectInfo.view.type === "timeGridDay") {
        if (userRole === "user") {
          setIsFormOpen(true);
        }
      } else {
        calendarApi.changeView("timeGridDay", startDate);
      }
    } else {
      setIsFormOpen(false);
      setIsValidDaySelected(false);
      console.log("Cannot select past dates.");
    }
    setFormData({
      name: "",
      appointmentType: "",
      serviceType: "",
      petName: "",
    });
  };

  const handleViewChange = (viewInfo) => {
    if (
      viewInfo.view.type !== "timeGrid" &&
      viewInfo.view.type !== "dayGridMonth"
    ) {
      setIsFormOpen(false);
    }

    if (isValidDaySelected && viewInfo.view.type === "timeGrid") {
      setIsFormOpen(true);
    }
  };

  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked);
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
          initialView="timeGridDay"
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
          select={handleDateSelect}
          eventClick={handleEventClick}
          slotDuration="01:00:00"
          allDaySlot={false}
          datesSet={handleViewChange}
        />
      </div>
      <div style={{ flex: 1 }}>
        {isFormOpen && (
          <>
            <h2>Appointment Form</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Existing form fields */}
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
              {getUserRoleFirestore(getCurrentUserId()) === "admin" && formData.appointmentId && (
                <button type="button" onClick={handleDeleteAppointment}>
                  Delete
                </button>
              )}
              
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
