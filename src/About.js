import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "./firebase.js";

const About = () => {
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
      <div className="homepage">
        <header>
          <h1>Be part of the pack.</h1>
        </header>
        <main>
          <div className="centered">
            <h2>
              Dedicated to our passion and adoration for animal care, groomers
              with over 4 years of pet grooming experience who have been
              offering both on site and home grooming services since 2019. We
              pride ourselves on patience, kindness and competence — and our
              clients would agree. It’s why so many of them use our services on
              a regular basis.
            </h2>
          </div>
        </main>
      </div>
      {/* Floating "Book now" button */}
      <button className="book-now-button" onClick={handleBookNowClick}>
        Book now
      </button>
    </section>
  );
};

export default About;
