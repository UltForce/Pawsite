import React from "react";
import "./styles.css"; // Import CSS file for styling
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "./firebase.js";
import { useEffect } from "react";
// Import images
import gallery1 from "./image/gallery1.jpg";
import gallery2 from "./image/gallery2.jpg";
import gallery3 from "./image/gallery3.jpg";
import gallery4 from "./image/gallery4.jpg";
import gallery5 from "./image/gallery5.jpg";
import gallery6 from "./image/gallery6.jpg";

const Gallery = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <section className="background-shadow">
      <div /*className="homepage"*/>
        <main>
          <div /*className="gallery-container"*/ className="row">
            <center>
              <h1>Dogs</h1>
            </center>
            <div /*className="gallery-row"*/ className="col-md-6">
              <center>
                <img src={gallery2} alt="Gallery 2" className="image" />
              </center>
            </div>
            <div /*className="gallery-row"*/ className="col-md-6">
              <center>
                <img src={gallery3} alt="Gallery 3" className="image" />
              </center>
            </div>
          </div>
          <div /*className="gallery-row"*/ className="row">
            <div /*className="gallery-row"*/ className="col-md-4">
              <center>
                <img src={gallery4} alt="Gallery 4" className="image" />
              </center>
            </div>
            <div /*className="gallery-row"*/ className="col-md-4">
              <center>
                <img src={gallery5} alt="Gallery 5" className="image" />
              </center>
            </div>
            <div /*className="gallery-row"*/ className="col-md-4">
              <center>
                <img src={gallery6} alt="Gallery 6" className="image" />
              </center>
            </div>
          </div>
          <div /*className="gallery-container"*/ className="row">
            <center>
              <h1>Cats</h1>
            </center>
            <div /*className="gallery-row"*/ className="col-md-12">
              <center>
                <img src={gallery1} alt="Gallery 1" className="image" />
              </center>
            </div>
          </div>
        </main>
      </div>
      <br />
    </section>
  );
};

export default Gallery;
