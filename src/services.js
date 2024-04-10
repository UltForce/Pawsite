import React, { useState, useEffect } from "react";
import {
  dba,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  auth,
  getUserRoleFirestore,
  getCurrentUserId,
  AuditLogger,
} from "./firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // Import FontAwesome icons
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

const Services = () => {
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

  const [isAdmin, setIsAdmin] = useState(false); // Initially set to false
  // State to hold services data
  const [services, setServices] = useState([]);

  // State to hold current index for pagination
  const [currentIndex, setCurrentIndex] = useState(0);
  // Number of cards to display at a time
  const cardsPerPage = 5;
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = getCurrentUserId(); // Get the current user's ID
        const userRole = await getUserRoleFirestore(userId); // Fetch user role from Firestore
        setIsAdmin(userRole === "admin"); // Set isAdmin state based on user role
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch services data from Firestore
  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(dba, "services"));
      const servicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error.message);
    }
  };

  // Function to handle pagination - move to the next set of cards
  const nextCards = () => {
    const totalCards = services.length;
    const maxIndex = totalCards - (totalCards % cardsPerPage || cardsPerPage);
    const nextIndex = Math.min(currentIndex + cardsPerPage, maxIndex);
    setCurrentIndex(nextIndex);
  };

  // Function to handle pagination - move to the previous set of cards
  const prevCards = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - cardsPerPage, 0));
  };

  const handleSubmit = async () => {
    Swal.fire({
      title: "Add a Service",
      html:
        '<div class="form-floating"><input id="swal-input-name" class="form-control" placeholder="Name"><label for="swal-input-name">Name</label></div>' +
        '<div class="form-floating"><input id="swal-input-description" class="form-control" placeholder="Description"><label for="swal-input-description">Description</label></div>' +
        '<div><input type="file" id="swal-input-image" accept=".jpg, .jpeg, .png" class="form-control">',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-input-name").value;
        const description = document.getElementById(
          "swal-input-description"
        ).value;
        const image = document.getElementById("swal-input-image").files[0];

        return { name, description, image };
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { name, description, image } = result.value;

        if (!name || !description || !image) {
          Toast.fire({
            icon: "error",
            title: "Please fill in all the fields.",
          });
          return; // Exit early if fields are empty
        }

        Swal.fire({
          icon: "question",
          title: "Do you want to add this service?",
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: "No",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const storage = getStorage();
              const storageRef = ref(storage, `images/${image.name}`);
              await uploadBytes(storageRef, image);
              const imageUrl = await getDownloadURL(storageRef);

              await addDoc(collection(dba, "services"), {
                name,
                description,
                image: imageUrl,
              });

              // Fetch updated services data
              fetchServices();
              const userId = getCurrentUserId(); // Get the current user's ID
              const event = {
                type: "Services", // Type of event
                userId: userId, // User ID associated with the event
                details: "User has created a service", // Details of the event
              };

              // Call the AuditLogger function with the event object
              AuditLogger({ event });
              // Show success message
              Swal.fire({
                title: "Success",
                text: "Service created successfully",
                icon: "success",
                heightAuto: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Confirm",
              }).then((result) => {
                if (result.isConfirmed) {
                  Toast.fire({
                    icon: "success",
                    title: "Service created successfully",
                  });
                }
              });
            } catch (error) {
              console.error("Error submitting service:", error.message);
            }
          }
        });
      }
    });
  };

  // Function to handle deletion of a service
  const handleDelete = async (serviceId, imageUrl) => {
    Swal.fire({
      icon: "question",
      title: "Do you want to delete this service?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete the service document from Firestore
          await deleteDoc(doc(dba, "services", serviceId));

          // Delete the image from Firebase Storage if it exists
          if (imageUrl) {
            const storage = getStorage();
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          }

          // Fetch updated services data after deletion
          fetchServices();
          const userId = getCurrentUserId(); // Get the current user's ID
          const event = {
            type: "Services", // Type of event
            userId: userId, // User ID associated with the event
            details: "User has deleted a service", // Details of the event
          };

          // Call the AuditLogger function with the event object
          AuditLogger({ event });
        } catch (error) {
          console.error("Error deleting service:", error.message);
        }
        // Show success message
        Swal.fire({
          title: "success",
          text: "Service deleted successfully",
          icon: "success",
          heightAuto: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            Toast.fire({
              icon: "success",
              title: "Service deleted successfully",
            });
          }
        });
      }
    });
  };

  const handleEdit = (service) => {
    Swal.fire({
      title: "Edit Service",
      html: `
        <div class="form-floating"><input id="swal-input-name" class="form-control" placeholder="Name" value="${service.name}" ><label for="swal-input-name">Name</label></div>
        <div class="form-floating"><input id="swal-input-description" class="form-control" placeholder="Description" value="${service.description}"><label for="swal-input-description">Description</label></div>
        <div><input type="file" id="swal-input-image" accept=".jpg, .jpeg, .png" class="form-control" value="${service.image}">`,
      focusConfirm: false,
      preConfirm: async () => {
        const name = document.getElementById("swal-input-name").value;
        const description = document.getElementById(
          "swal-input-description"
        ).value;
        const image = document.getElementById("swal-input-image").files[0];

        return { name, description, image };
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { name, description, image } = result.value;

        if (!name || !description) {
          Toast.fire({
            icon: "error",
            title: "Please fill in all the fields.",
          });
          return; // Exit early if fields are empty
        }

        Swal.fire({
          icon: "question",
          title: "Do you want to update this service?",
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: "No",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              let imageUrl = service.image; // Default to the current image URL

              if (image) {
                // If a new image is selected, upload it and get the new URL
                const storage = getStorage();
                const storageRef = ref(storage, `images/${image.name}`);
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef);
              }

              // Update the service document in Firestore with the new data
              await updateDoc(doc(dba, "services", service.id), {
                name,
                description,
                image: imageUrl,
              });

              // Fetch updated services data
              fetchServices();
              const userId = getCurrentUserId(); // Get the current user's ID
              const event = {
                type: "Services", // Type of event
                userId: userId, // User ID associated with the event
                details: "User has edited a service", // Details of the event
              };

              // Call the AuditLogger function with the event object
              AuditLogger({ event });
              // Show success message
              Swal.fire({
                title: "Success",
                text: "Service updated successfully",
                icon: "success",
                heightAuto: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Confirm",
              }).then((result) => {
                if (result.isConfirmed) {
                  Toast.fire({
                    icon: "success",
                    title: "Service updated successfully",
                  });
                }
              });
            } catch (error) {
              console.error("Error updating service:", error.message);
            }
          }
        });
      }
    });
  };

  // Fetch services data on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section className="background-image">
      <div className="centered">
        <h1 className="page-title">Services</h1>
        {isAdmin && (
          <div>
            <button className="btn btn-outline-primary" onClick={handleSubmit}>
              {" "}
              <FaPlus />
            </button>
          </div>
        )}
        <div className="service-cards-container">
          <button className="pagination-buttons page-item" onClick={prevCards}>
            &laquo;
          </button>
          <div className="service-cards">
            {services
              .slice(currentIndex, currentIndex + cardsPerPage)
              .map((service) => (
                <div className="service-card" key={service.id}>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="image-container">
                    <img src={service.image} alt={service.name} />
                  </div>
                  {isAdmin && (
                    <div>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleEdit(service)}
                      >
                        <FaEdit /> {/* FontAwesome edit icon */}
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleDelete(service.id, service.image)}
                      >
                        <FaTrash /> {/* FontAwesome trash icon */}
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
          <button
            className={`pagination-buttons page-item ${
              currentIndex + cardsPerPage >= services.length ? "disabled" : ""
            }`}
            onClick={nextCards}
            disabled={currentIndex + cardsPerPage >= services.length}
          >
            &raquo;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
