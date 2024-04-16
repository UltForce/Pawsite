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
