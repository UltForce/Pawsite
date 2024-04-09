// homepage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "./firebase.js";

const Homepage = () => {
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
      <button className="book-now-button" onClick={handleBookNowClick}>
        Book now
      </button>
    </section>
  );
};

export default Homepage;
