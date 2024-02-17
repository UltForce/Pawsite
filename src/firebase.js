import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
{
  /*
const firebaseConfig = {
  apiKey: "AIzaSyANevoJMHQyCnWqcJJ71YUKIsKQjSDcUPA",
  authDomain: "pawsite-30215.firebaseapp.com",
  projectId: "pawsite-30215",
  storageBucket: "pawsite-30215.appspot.com",
  messagingSenderId: "1068739245102",
  appId: "1:1068739245102:web:6492dc28800c7a176e5bbf",
  measurementId: "G-BKJW8Y1Y9N",
};
*/
}

const firebaseConfig = {
  apiKey: "AIzaSyCI_yV6J0RXtIxKKOTCRWdzOFowCGX7Z7Y",
  authDomain: "pawsite2.firebaseapp.com",
  projectId: "pawsite2",
  storageBucket: "pawsite2.appspot.com",
  messagingSenderId: "998834889315",
  appId: "1:998834889315:web:100880b154398f7443ce56",
  measurementId: "G-SX530VTRW7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(); // Get authentication instance directly using getAuth
const dba = getFirestore(); // Use dba as Firestore instance
const getCurrentUserId = () => {
  // Check if a user is currently signed in
  const user = auth.currentUser;

  // If a user is signed in, return the user's UID (user ID)
  // If no user is signed in, return null or handle it according to your app logic
  return user ? user.uid : null;
};

const getUserRoleFirestore = async (userId) => {
  try {
    const userDocRef = doc(dba, "users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData.role || "user"; // Return the user's role, defaulting to "user" if not present
    } else {
      console.error("User document not found in Firestore.");
      return "user"; // Default to "user" role if the document doesn't exist
    }
  } catch (error) {
    console.error("Error fetching user role from Firestore:", error.message);
    throw error; // You can handle this error in the calling code
  }
};

// Function to create a new appointment
const createAppointment = async (userId, appointmentData) => {
  try {
    // Add the userId to the appointment data
    appointmentData.userId = userId;
    appointmentData.status = appointmentData.status || "pending"; // Set default value to "pending" if status is not provided
    // Create a new document in the "appointments" collection
    const appointmentRef = await addDoc(
      collection(dba, "appointments"),
      appointmentData
    );

    // Get the ID of the newly created appointment document
    const appointmentId = appointmentRef.id;

    // Add the appointmentId to the appointment data
    appointmentData.appointmentId = appointmentId;

    // Update the appointment document with the appointmentId
    await updateDoc(appointmentRef, { appointmentId: appointmentId });

    console.log("Appointment created successfully with ID: ", appointmentId);
  } catch (error) {
    console.error("Error creating appointment:", error.message);
  }
};

// Function to get approved appointments
const getApprovedAppointments = async () => {
  try {
    // Query the "appointments" collection where status is approved
    const appointmentsQuery = query(
      collection(dba, "appointments"),
      where("status", "==", "approved")
    );
    const snapshot = await getDocs(appointmentsQuery);
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return appointments;
  } catch (error) {
    console.error("Error getting approved appointments:", error.message);
    return [];
  }
};

const getUserAppointments = async (userId) => {
  try {
    // Get the user's role
    const userRole = await getUserRoleFirestore(userId);

    // If the user is an admin, fetch all appointments
    if (userRole === "admin") {
      return await getAllAppointments();
    }

    // Query the "appointments" collection where userId matches the logged-in user's ID
    const appointmentsQuery = query(
      collection(dba, "appointments"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(appointmentsQuery);
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return appointments;
  } catch (error) {
    console.error("Error getting user appointments:", error.message);
    return [];
  }
};

// Function to retrieve all appointments
const getAllAppointments = async () => {
  try {
    // Query the "appointments" collection where userId matches
    const appointmentsQuery = query(collection(dba, "appointments"));
    const snapshot = await getDocs(appointmentsQuery);
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return appointments;
  } catch (error) {
    console.error("Error getting appointments:", error.message);
    return [];
  }
};

// Function to update an appointment
const updateAppointment = async (userId, appointmentId, newData) => {
  try {
    // Construct the reference to the appointment document
    const appointmentDocRef = doc(dba, "appointments", appointmentId);

    // Update the appointment document with the new data
    await updateDoc(appointmentDocRef, newData);

    console.log("Appointment updated successfully!");
  } catch (error) {
    console.error("Error updating appointment:", error.message);
  }
};

// Function to delete an appointment
const deleteAppointment = async (appointmentId) => {
  try {
    const appointmentDocRef = doc(dba, "appointments", appointmentId);
    await deleteDoc(appointmentDocRef);
    console.log("Appointment deleted successfully!");
  } catch (error) {
    console.error("Error deleting appointment:", error.message);
  }
};

export {
  getAuth, // Export getAuth directly
  auth, // Export auth if needed
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  getUserRoleFirestore,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  createAppointment,
  getUserAppointments,
  getApprovedAppointments,
  updateAppointment,
  deleteAppointment,
  dba,
  where,
  query,
  getFirestore,
  getDocs,
  collection,
  getAllAppointments,
  getCurrentUserId,
};
