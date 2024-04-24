import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId, auth, getUserRoleFirestore } from "./firebase.js";

const About = () => {
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
      <div className="homepage">
        <header>
          <h1 className="centered">Be part of the pack.</h1>
        </header>
        <main>
          <div className="centered">
            <p>
              Dedicated to our passion and adoration for animal care, groomers
              with over 4 years of pet grooming experience who have been
              offering both on site and home grooming services since 2019. We
              pride ourselves on patience, kindness and competence — and our
              clients would agree. It’s why so many of them use our services on
              a regular basis.
            </p>

            <h3>Address</h3>
            <p>43a Agoncillo apartment Severina Avenue, Paranaque City.</p>
            {/* Embed Google Maps */}
            <iframe
              title="Paranaque City Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.0609163367874!2d121.01778641475143!3d14.47226128979967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c88f1b9aa8d3%3A0x229bfe6e0a43c11e!2s43a%20Agoncillo%20Apartment%2C%20Severina%20Ave%2C%20Paranaque%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1649552955175!5m2!1sen!2sph"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
            <br />
            <h3>Contact No.</h3>
            <p>
              0927 882 0488 <br />
              0998 889 1178
            </p>
            <br />

            <h3>Schedule</h3>
            <p>Every 9AM to 6PM Daily.</p>
          </div>
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

export default About;
