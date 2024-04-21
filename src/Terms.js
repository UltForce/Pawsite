// Terms.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId, auth, getUserRoleFirestore } from "./firebase.js";
const Terms = () => {
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

  const [isVisible, setIsVisible] = useState(false);
  const handleBookNowClick = () => {
    navigate("/booking"); // Redirect to booking page when "Book now" button is clicked
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  window.addEventListener("scroll", toggleVisibility);
  return (
    <section className="background-image">
      <div className="centered">
        <div>
          <h1 className="page-title">Terms and Conditions</h1>
        </div>
        <div className="accordion-container centered">
          <div className="accordion" id="faqsAccordion">
            <div className="row">
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      Appointment Scheduling
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      A customer can only schedule one appointment at a time
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Cancellation and rescheduling
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingTwo"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      A customer can only request cancellation on appointments
                      not yet approved by the administrators. In the case that
                      the customer wishes to cancel or reschedule an already
                      approved appointment, please contact 0927 882 0488 /
                      09988891178 directly.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Pet Information
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingThree"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      The customers must be able to give accurate information on
                      their pet like species, breed, and their sizes as this may
                      affect the prices of the appointment.
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      Vaccination
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingFour"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      The customers may be requested to show their vaccinations
                      for their pets as part of their health policies.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFive">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFive"
                      aria-expanded="false"
                      aria-controls="collapseFive"
                    >
                      Grooming services
                    </button>
                  </h2>
                  <div
                    id="collapseFive"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingFive"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      The groomer will only provide the grooming services stated
                      in the scheduled appointment. In the case that the
                      customer wishes to request more services, the customer and
                      groomer must both agree to the conditions and the customer
                      will have added costs.
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingSix">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseSix"
                      aria-expanded="false"
                      aria-controls="collapseSix"
                    >
                      Latecomers
                    </button>
                  </h2>
                  <div
                    id="collapseSix"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingSix"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      Customers and Groomers must be able to come at the
                      scheduled time. Latecomers may incur additional charges or
                      their appointment canceled.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingSeven">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseSeven"
                      aria-expanded="false"
                      aria-controls="collapseSeven"
                    >
                      Liability
                    </button>
                  </h2>
                  <div
                    id="collapseSeven"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingSeven"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      The grooming shop will take reasonable care for the
                      customer's pet but will not be liable for any pre-existing
                      conditions. The customers are liable for any damage or
                      injuries that their pet may have caused.
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingEight">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseEight"
                      aria-expanded="false"
                      aria-controls="collapseEight"
                    >
                      Photography and Social Media
                    </button>
                  </h2>
                  <div
                    id="collapseEight"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingEight"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      Customers may be asked by the grooming shop to take
                      pictures of their pets for marketing purposes. The
                      customer may choose to refuse.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingNine">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseNine"
                      aria-expanded="false"
                      aria-controls="collapseNine"
                    >
                      Privacy Policy
                    </button>
                  </h2>
                  <div
                    id="collapseNine"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingNine"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      Customer and Pet information will be kept confidential and
                      will not be shared with third parties.
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTen">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTen"
                      aria-expanded="false"
                      aria-controls="collapseTen"
                    >
                      Changes to Terms and Conditions
                    </button>
                  </h2>
                  <div
                    id="collapseTen"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingTen"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      The grooming shop reserves the right to modify these terms
                      and conditions as needed. Customers will be notified of
                      any changes.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingEleven">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseEleven"
                      aria-expanded="false"
                      aria-controls="collapseEleven"
                    >
                      Refusal of Service
                    </button>
                  </h2>
                  <div
                    id="collapseEleven"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingEleven"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      The grooming shop reserves the right to refuse service to
                      any client for any reason.
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwelve">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwelve"
                      aria-expanded="false"
                      aria-controls="collapseTwelve"
                    >
                      Payment
                    </button>
                  </h2>
                  <div
                    id="collapseTwelve"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingTwelve"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      Payment can only be made onsite of the grooming shop.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThirteen">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThirteen"
                      aria-expanded="false"
                      aria-controls="collapseThirteen"
                    >
                      Walk-ins
                    </button>
                  </h2>
                  <div
                    id="collapseThirteen"
                    className="accordion-collapse collapse  "
                    aria-labelledby="headingThirteen"
                    data-bs-parent="#faqsAccordion"
                  >
                    <div className="accordion-body">
                      For walk-ins, appointments made in the website will be
                      prioritized in the case that a walk-in and online
                      appointment are in the same time slot. In the case that
                      the appointment is canceled or a no show, the walk-in
                      appointment can take ove the time slot.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        {isVisible && (
          <button className="back-to-top" onClick={scrollToTop}>
            Back to Top
          </button>
        )}
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

export default Terms;
