// homepage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId, getUserRoleFirestore, auth } from "./firebase.js";

const Homepage = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userId = getCurrentUserId();
        const userRole = await getUserRoleFirestore(userId);
        setIsAdmin(userRole === "admin");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBookNowClick = () => {
    navigate("/booking"); // Redirect to booking page when "Book now" button is clicked
  };

  return (
    <section className="background-image">
      <div className="homepage centered">
        <header>
          <h1>Welcome to Pawsite!</h1>
          <h4>Be part of the pack.</h4>
          <img src="pawsite2.png" height="200px" />
        </header>
        <main>
          <p>
            Your neighbourhood source of pet supplies and pet grooming services
            We sell dog food, cat food and other pet supplies. COD available via
            grab, lalamove or Mr. Speedy.
          </p>

          <section className="hero">
            <h2>Discover Something Amazing!</h2>
            <p>Explore our latest offerings and find what interests you!</p>
          </section>
          <section className="featured">
            <h2>Featured Content</h2>
            <div className="card">
              <h3>Featured Article</h3>
              <p>Read about the latest news and updates.</p>
            </div>
            <div className="card">
              <h3>Featured Product</h3>
              <p>Check out our newest promos and get exclusive discounts.</p>
            </div>
          </section>
        </main>
      </div>
      {/* Floating "Book now" button */}
      {isLoggedIn ? (
        <button className="book-now-button" onClick={handleBookNowClick}>
          Book now
        </button>
      ) : (
        <></>
      )}
    </section>
  );
};

export default Homepage;
