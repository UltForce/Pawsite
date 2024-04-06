// homepage.js
import shop1 from "./image/product1.jpg";
import shop2 from "./image/product2.jpg";
import React from "react";
import "./styles.css"; // Import CSS file for styling
const Shop = () => {
  return (
    <section className="background-image">
      <div className="homepage">
        <main>
          <div className="gallery-container shop">
            <div className="gallery-row">
              <img src={shop1} alt="Shop 1" />
              <img src={shop2} alt="Shop 2" />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Shop;
