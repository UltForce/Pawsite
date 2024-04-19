// homepage.js
import services1 from "./image/product1.jpg";
import services2 from "./image/product2.jpg";
import React, { useEffect } from "react";
import "./styles.css"; // Import CSS file for styling
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "./firebase.js";
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

  return (
    <section className="background-image">
      <div /*className="homepage"*/>
        <main>
          <div /*className="gallery-container"*/ className="row">
            <div /*className="gallery-row"*/ className="col-md-6">
              <center>
                <img src={services1} alt="Gallery 1" className="image" />
              </center>
            </div>
            <div /*className="gallery-row"*/ className="col-md-6">
              <center>
                <img src={services2} alt="Gallery 2" className="image" />
              </center>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Services;