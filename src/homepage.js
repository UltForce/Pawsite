// homepage.js

import React from "react";

const Homepage = () => {
  return (
    <div className="homepage">
      <header>
        <h1>Welcome to Our Website</h1>
      </header>
      <main>
        <section className="hero">
          <h2>Discover Something Amazing</h2>
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
      <footer>
        <p>&copy; 2024 Pawsite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
