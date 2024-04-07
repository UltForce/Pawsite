// FAQs.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "./firebase.js";
const FAQs = () => {
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
  const [isVisible, setIsVisible] = useState(false);

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
      <div>
        <div>
          <h1 className="page-title centered">Frequently Asked Questions</h1>
        </div>
        <div className="accordion-container centered">
          <div className="accordion" id="faqsAccordion">
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
                  How can I schedule an appointment?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  You can schedule an appointment by calling us, visiting our
                  website, or using our online appointment booking system.
                </div>
              </div>
            </div>
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
                  Can these products be delivered on my home?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse  "
                aria-labelledby="headingTwo"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  The products are only for promotion and must be bought onsite
                  on the grooming shop itself.
                </div>
              </div>
            </div>

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
                  Can I schedule more than 2 appointments?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse  "
                aria-labelledby="headingThree"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  Through the website, a customer can't schedule more than 2
                  appointments until the first one has been finished, if the
                  customer wishes to schedule multiple appointments, the
                  customer has to contact the administrators directly.
                </div>
              </div>
            </div>

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
                  What services do you provide?
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse  "
                aria-labelledby="headingFour"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  We are able to groom Dogs and Cats all breeds, ages and coats.
                  We have a range of services that include,full grooming, basic
                  grooming and single services.
                </div>
              </div>
            </div>

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
                  Is scheduling an appointment through the website necessary?
                </button>
              </h2>
              <div
                id="collapseFive"
                className="accordion-collapse collapse  "
                aria-labelledby="headingFive"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  While appointments are recommended, we do accept walk-ins
                  based on availability. To ensure your preferred time, it's
                  best to schedule in advance.
                </div>
              </div>
            </div>

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
                  What vaccinations does my pet need for grooming?
                </button>
              </h2>
              <div
                id="collapseSix"
                className="accordion-collapse collapse  "
                aria-labelledby="headingSix"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  We require pets to be up-to-date on core vaccinations. Please
                  provide proof of vaccinations, including rabies, when you
                  schedule your appointment.
                </div>
              </div>
            </div>

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
                  How long does a grooming session take?
                </button>
              </h2>
              <div
                id="collapseSeven"
                className="accordion-collapse collapse  "
                aria-labelledby="headingSeven"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  The duration varies based on the size and breed of your pet,
                  as well as the services requested. On average, a grooming
                  session takes 1 to 3 hours.
                </div>
              </div>
            </div>

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
                  Can I stay with my pet during the grooming process?
                </button>
              </h2>
              <div
                id="collapseEight"
                className="accordion-collapse collapse  "
                aria-labelledby="headingEight"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  For the safety of our staff and pets, we generally do not
                  allow owners to stay in the grooming area. However, you can
                  discuss any concerns or specific instructions with our
                  groomers.
                </div>
              </div>
            </div>

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
                  What if my pet has special needs or medical conditions?
                </button>
              </h2>
              <div
                id="collapseNine"
                className="accordion-collapse collapse  "
                aria-labelledby="headingNine"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  Please inform us of any special needs or medical conditions
                  when scheduling your appointment. Our groomers will take extra
                  care to accommodate your pet's requirements.
                </div>
              </div>
            </div>

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
                  What products do you use for grooming?
                </button>
              </h2>
              <div
                id="collapseTen"
                className="accordion-collapse collapse  "
                aria-labelledby="headingTen"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  We use high-quality, pet-friendly grooming products. If your
                  pet has allergies or specific product preferences, please let
                  us know, and we'll do our best to accommodate.
                </div>
              </div>
            </div>

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
                  Do you offer discounts?
                </button>
              </h2>
              <div
                id="collapseEleven"
                className="accordion-collapse collapse  "
                aria-labelledby="headingEleven"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  Yes, we offer discounts. Check our website or contact us for
                  information on current specials.
                </div>
              </div>
            </div>

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
                  Do you have a grooming salon?
                </button>
              </h2>
              <div
                id="collapseTwelve"
                className="accordion-collapse collapse  "
                aria-labelledby="headingTwelve"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  Yes we do! We are located at 43a Agoncillo apartment Severina
                  Avenue, Paranaque City. Come by and join the pack!
                </div>
              </div>
            </div>

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
                  What are your operating salon hours and days?
                </button>
              </h2>
              <div
                id="collapseThirteen"
                className="accordion-collapse collapse  "
                aria-labelledby="headingThirteen"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  Our groomers provide grooming services from 9am - 6pm daily.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFourteen">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFourteen"
                  aria-expanded="false"
                  aria-controls="collapseFourteen"
                >
                  What do I have to inform the groomer before my appointment?
                </button>
              </h2>
              <div
                id="collapseFourteen"
                className="accordion-collapse collapse  "
                aria-labelledby="headingFourteen"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  Please inform our groomers of any illnesses, injury/wounds or
                  aggressive/unpredictable tendencies that your pet might have,
                  vaccinated or not.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFifteen">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFifteen"
                  aria-expanded="false"
                  aria-controls="collapseFifteen"
                >
                  How do I make a booking?
                </button>
              </h2>
              <div
                id="collapseFifteen"
                className="accordion-collapse collapse  "
                aria-labelledby="headingFifteen"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  Bookings can be made conveniently through our online booking
                  portal
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSixteen">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSixteen"
                  aria-expanded="false"
                  aria-controls="collapseSixteen"
                >
                  How long in advance should I make my appointment?
                </button>
              </h2>
              <div
                id="collapseSixteen"
                className="accordion-collapse collapse  "
                aria-labelledby="headingSixteen"
                data-bs-parent="#faqsAccordion"
              >
                <div className="accordion-body">
                  We encourage booking your appointment with us at least 1 day
                  in advance.
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
    </section>
  );
};

export default FAQs;
