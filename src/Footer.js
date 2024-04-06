import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-media">
          <a
            href="https://web.facebook.com/woofpack.ph"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} />
            <span className="social-media-label"> Facebook</span>
          </a>
          <br />
          <a
            href="https://www.instagram.com/woofpack.ph/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} />
            <span className="social-media-label"> Instagram</span>
          </a>
        </div>
        <div className="contact-info">
          <p>Contact us: 0927 882 0488 / 09988891178</p>
          <p>Email: woofpackph@gmail.com</p>
        </div>
      </div>
      <p>&copy; 2024 Pawsite. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
