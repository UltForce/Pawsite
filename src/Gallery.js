import React from "react";
import "./styles.css"; // Import CSS file for styling

// Import images
import gallery1 from "./image/gallery1.jpg";
import gallery2 from "./image/gallery2.jpg";
import gallery3 from "./image/gallery3.jpg";
import gallery4 from "./image/gallery4.jpg";
import gallery5 from "./image/gallery5.jpg";
import gallery6 from "./image/gallery6.jpg";

const Gallery = () => {
  return (
    <section className="background-image">
      <div className="homepage">
        <main>
          <div className="gallery-container">
            <div className="gallery-row">
              <img src={gallery1} alt="Gallery 1" />
              <img src={gallery2} alt="Gallery 2" />
              <img src={gallery3} alt="Gallery 3" />
            </div>
            <div className="gallery-row">
              <img src={gallery4} alt="Gallery 4" />
              <img src={gallery5} alt="Gallery 5" />
              <img src={gallery6} alt="Gallery 6" />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Gallery;
