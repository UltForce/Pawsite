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
} from "./firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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

const Services = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Initially set to false
  // State to hold services data
  const [services, setServices] = useState([]);
  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null, // State to hold the selected image file
  });
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

  // Function to handle form submission for adding/editing a service
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.image) {
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
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let imageUrl = formData.image; // Default to the current image URL if not uploading a new image

          if (formData.image) {
            // If an image file is selected
            const storage = getStorage();
            const storageRef = ref(storage, `images/${formData.image.name}`);
            await uploadBytes(storageRef, formData.image); // Upload the image file to Firebase Storage
            imageUrl = await getDownloadURL(storageRef); // Get the download URL of the uploaded image
          }

          if (formData.id) {
            // Update existing service
            await updateDoc(doc(dba, "services", formData.id), {
              name: formData.name,
              description: formData.description,
              image: imageUrl, // Store the image URL in Firestore
            });
          } else {
            // Add new service
            await addDoc(collection(dba, "services"), {
              name: formData.name,
              description: formData.description,
              image: imageUrl, // Store the image URL in Firestore
            });
          }
          // Clear form data after submission
          setFormData({ name: "", description: "", image: null });
          // Fetch updated services data
          fetchServices();
        } catch (error) {
          console.error("Error submitting service:", error.message);
        }
        // Show success message
        Swal.fire({
          title: "success",
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

  // Function to handle editing of a service
  const handleEdit = (service) => {
    Swal.fire({
      icon: "question",
      title: "Do you want to edit this service?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete the previous image from Firebase Storage if it exists
          if (service.image) {
            const storage = getStorage();
            const imageRef = ref(storage, service.image);
            await deleteObject(imageRef);
          }

          // Set the form data to the selected service
          setFormData({ ...service });
        } catch (error) {
          console.error("Error editing service:", error.message);
        }
      }
    });
  };

  // Function to handle image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  // Fetch services data on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section className="background-image-bigger">
      <div className="centered">
        <h1 className="page-title">Services</h1>
        {isAdmin && (
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <label>Description:</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit">{formData.id ? "Update" : "Add"}</button>
          </form>
        )}
        <div className="service-cards">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="image-container">
                <img src={service.image} alt={service.name} />
              </div>
              {isAdmin && (
                <div>
                  <button onClick={() => handleEdit(service)}>Edit</button>
                  <button
                    onClick={() => handleDelete(service.id, service.image)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
