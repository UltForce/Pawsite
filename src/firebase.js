// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANevoJMHQyCnWqcJJ71YUKIsKQjSDcUPA",
  authDomain: "pawsite-30215.firebaseapp.com",
  projectId: "pawsite-30215",
  storageBucket: "pawsite-30215.appspot.com",
  messagingSenderId: "1068739245102",
  appId: "1:1068739245102:web:6492dc28800c7a176e5bbf",
  measurementId: "G-BKJW8Y1Y9N",
};
// test
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {
  app,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
