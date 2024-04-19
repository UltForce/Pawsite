import "bootstrap";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { auth, getCurrentUserId, AuditLogger } from "./firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
} from "./firebase";
import $ from "jquery";
import "datatables.net";
// Toast configuration for displaying messages
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

function Pet() {
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

  const [formData, setFormData] = useState({
    // State for form data
    petName: "",
    species: "",
    breed: "",
    weight: "",
    age: "",
    birthdate: "",
    gender: "",
    color: "",
    vaccination: "",
    vaccinationDate: "N/A",
    firstGrooming: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false); // State for controlling form visibility
  const [termsChecked, setTermsChecked] = useState(false); // State for tracking if terms are checked
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pets, setPets] = useState([]);

  const PetNameInputRef = useRef(null);
  const SpeciesInputRef = useRef(null);
  const BreedNumberInputRef = useRef(null);
  const WeightInputRef = useRef(null);
  const AgeInputRef = useRef(null);
  const ColorInputRef = useRef(null);
  // Handle terms checkbox change
  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked); // Set terms checked
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Check if the pressed key is Enter
      if (event.target.id === "floatingPet") {
        SpeciesInputRef.current.focus();
      } else if (event.target.id === "floatingSpecies") {
        BreedNumberInputRef.current.focus();
      } else if (event.target.id === "floatingBreed") {
        WeightInputRef.current.focus();
      } else if (event.target.id === "floatingWeight") {
        AgeInputRef.current.focus();
      } else if (event.target.id === "floatingAge") {
        ColorInputRef.current.focus();
      }
    }
  };
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const pets = await getAllPets();
        setPets(pets);
      } catch (error) {
        console.error("Error fetching pets:", error.message);
      }
    };

    fetchPets();
  }, []);

  // Define handleVaccinationChange function to update vaccination status and date in formData state
  const handleVaccinationChange = (e) => {
    const vaccinationStatus = e.target.value;

    // Update vaccination status
    setFormData({ ...formData, vaccination: vaccinationStatus });

    // If vaccination status is "no", set vaccination date to "N/A"
    if (vaccinationStatus === "no") {
      setFormData({ ...formData, vaccination: "no", vaccinationDate: "" });
    } else if (formData.vaccination === "no") {
      // If changing from "no" to "yes", clear vaccination date
      setFormData({ ...formData, vaccinationDate: "" });
    }
  };

  // Define handleBirthdateChange function to update birthdate in formData state
  const handleBirthdateChange = (e) => {
    const selectedDate = e.target.value;
    // Check if selected date is not in the future
    if (selectedDate <= new Date().toISOString().split("T")[0]) {
      setFormData({ ...formData, birthdate: selectedDate });
    } else {
      Toast.fire({
        icon: "error",
        title: "Birthdate cannot be in the future",
      });
    }
  };

  // Define handleVaccinationDateChange function to update vaccination date in formData state
  const handleVaccinationDateChange = (e) => {
    const selectedDate = e.target.value;
    const petBirthdate = formData.birthdate; // Get pet's birthdate from formData state

    if (!petBirthdate) {
      // Check if pet's birthdate is not set
      Toast.fire({
        icon: "error",
        title: "Please set the pet's birthdate first",
      });
      return; // Exit function early
    }

    // Check if selected date is not in the future
    if (selectedDate <= new Date().toISOString().split("T")[0]) {
      // Check if selected date is later than pet's birthdate
      if (selectedDate >= petBirthdate) {
        setFormData({ ...formData, vaccinationDate: selectedDate });
      } else {
        Toast.fire({
          icon: "error",
          title: "Vaccination date cannot be earlier than pet's birthdate",
        });
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Vaccination date cannot be in the future",
      });
    }
  };
  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
    };

    if (
      !updatedFormData.petName ||
      !updatedFormData.species ||
      !updatedFormData.breed ||
      !updatedFormData.weight ||
      !updatedFormData.age ||
      !updatedFormData.birthdate ||
      !updatedFormData.gender ||
      !updatedFormData.color ||
      !updatedFormData.vaccination ||
      (updatedFormData.vaccination === "yes" &&
        !updatedFormData.vaccinationDate) ||
      !updatedFormData.firstGrooming
    ) {
      Toast.fire({
        icon: "error",
        title: "Please fill in all the fields.",
      });
      return; // Exit early if fields are empty
    }

    const loggedInUserId = getCurrentUserId();

    if (formData.petId) {
      // Update appointment
      Swal.fire({
        icon: "question",
        title: "Do you want to edit this pet?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updatePet(loggedInUserId, formData.petId, {
            petName: formData.petName,
            species: formData.species,
            breed: formData.breed,
            weight: formData.weight,
            age: formData.age,
            birthdate: formData.birthdate,
            gender: formData.gender,
            color: formData.color,
            vaccination: formData.vaccination,
            vaccinationDate: formData.vaccinationDate,
            firstGrooming: formData.firstGrooming,
          });
          const event = {
            type: "Pet", // Type of event
            userId: loggedInUserId, // User ID associated with the event
            details: "User edited an existing pet", // Details of the event
          };

          // Call the AuditLogger function with the event object
          AuditLogger({ event });
          setFormData({
            petName: "",
            species: "",
            breed: "",
            weight: "",
            age: "",
            birthdate: "",
            gender: "",
            color: "",
            vaccination: "",
            vaccinationDate: "N/A",
            firstGrooming: "",
          });
          // Show success message
          Swal.fire({
            title: "success",
            text: "Pet updated successfully",
            icon: "success",
            heightAuto: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              Toast.fire({
                icon: "success",
                title: "Pet updated successfully",
              });
            }
          });
          getAllPets(); // Fetch appointments
        }
      });
    } else {
      // Create new appointment
      Swal.fire({
        icon: "question",
        title: "Do you want to create this pet?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await createPet(loggedInUserId, {
            userId: loggedInUserId,
            petName: formData.petName,
            species: formData.species,
            breed: formData.breed,
            weight: formData.weight,
            age: formData.age,
            birthdate: formData.birthdate,
            gender: formData.gender,
            color: formData.color,
            vaccination: formData.vaccination,
            vaccinationDate: formData.vaccinationDate,
            firstGrooming: formData.firstGrooming,
          });
          setFormData({
            petName: "",
            species: "",
            breed: "",
            weight: "",
            age: "",
            birthdate: "",
            gender: "",
            color: "",
            vaccination: "",
            vaccinationDate: "N/A",
            firstGrooming: "",
          });
          // Show success message
          Swal.fire({
            title: "success",
            text: "Pet created successfully",
            icon: "success",
            heightAuto: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              Toast.fire({
                icon: "success",
                title: "Pet created successfully",
              });
            }
          });
          const event = {
            type: "Pet", // Type of event
            userId: loggedInUserId, // User ID associated with the event
            details: "User created a new pet", // Details of the event
          };

          // Call the AuditLogger function with the event object
          AuditLogger({ event });
        }
      });
    }
  };

  useEffect(() => {
    if (pets.length > 0) {
      if (!$.fn.DataTable.isDataTable("#petsTable")) {
        $("#petsTable").DataTable({
          lengthMenu: [10, 25, 50, 75, 100],
          pagingType: "full_numbers",
          order: [],
          columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: 1, type: "date-euro" }, // Specify the type of date sorting
          ],
          drawCallback: function () {
            $(this.api().table().container())
              .find("td")
              .css("border", "1px solid #ddd");
          },
          rowCallback: function (row, data, index) {
            $(row).hover(
              function () {
                $(this).addClass("hover");
              },
              function () {
                $(this).removeClass("hover");
              }
            );
          },
          stripeClasses: ["stripe1", "stripe2"],
        });
      }
    }
  }, [pets]);

  const vaccinationformatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    // Check if dateTimeString is not applicable
    if (!dateTimeString) {
      return "N/A";
    }
    // Extract date, day of the week, and hour
    const year = dateTime.getFullYear();
    const month = ("0" + (dateTime.getMonth() + 1)).slice(-2); // Adding leading zero for single digit months
    const day = ("0" + dateTime.getDate()).slice(-2); // Adding leading zero for single digit days
    const dayOfWeek = dateTime.toLocaleDateString("en-US", { weekday: "long" });

    // Format date string with spaces and without minutes and seconds
    return `${year}-${month}-${day} ${dayOfWeek}`;
  };

  return (
    <section className="background-image">
      <div className="centered">
        <div>
          <h2>Pet List</h2>
          <table id="petsTable" className="display">
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Pet Species</th>
                <th>Pet Breed</th>
                <th>Pet Weight (kg)</th>
                <th>Pet Age</th>
                <th>Pet Color</th>
                <th>Pet Birthdate</th>
                <th>Pet Gender</th>
                <th>Vaccination</th>
                <th>Vaccination Date</th>
                <th>First Grooming</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.petId}>
                  <td>{pet.petName}</td>
                  <td>{pet.species}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.weight}</td>
                  <td>{pet.age}</td>
                  <td>{pet.color}</td>
                  <td>{vaccinationformatDateTime(pet.birthdate)}</td>
                  <td>{pet.gender}</td>
                  <td>{pet.vaccination}</td>
                  <td>{vaccinationformatDateTime(pet.vaccinationDate)}</td>
                  <td>{pet.firstGrooming}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <center>
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={() => setIsFormOpen(true)}
            >
              Add Pets
            </button>
          </center>
          <div
            className={`offcanvas offcanvas-start ${isFormOpen ? "show" : ""}`}
            tabIndex="-1"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasExampleLabel">
                Pet Form
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                onClick={() => setIsFormOpen(false)}
              ></button>
            </div>
            <div className="offcanvas-body">
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingPet"
                  >
                    Pet Name:
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Name"
                    id="floatingPet"
                    value={formData.petName}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 128) {
                        setFormData({ ...formData, petName: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={PetNameInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingSpecies"
                  >
                    Pet Species:
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Species"
                    id="floatingSpecies"
                    value={formData.species}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 128) {
                        setFormData({ ...formData, species: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={SpeciesInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingBreed"
                  >
                    Pet Breed:
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Breed"
                    id="floatingBreed"
                    value={formData.breed}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 128) {
                        setFormData({ ...formData, breed: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={BreedNumberInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingWeight"
                  >
                    Pet Weight: (kg)
                  </label>
                  <input
                    type="number"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Weight"
                    id="floatingWeight"
                    value={formData.weight}
                    onChange={(e) => {
                      const weightValue = e.target.value;
                      if (weightValue >= 0 && weightValue.length <= 4) {
                        // Check if the value is positive or zero
                        setFormData({ ...formData, weight: weightValue });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={WeightInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingAge"
                  >
                    Pet Age:
                  </label>
                  <input
                    type="number"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Age"
                    id="floatingAge"
                    value={formData.age}
                    onChange={(e) => {
                      const ageValue = e.target.value;
                      if (ageValue >= 0 && ageValue.length <= 3) {
                        // Check if the value is positive or zero
                        setFormData({ ...formData, age: ageValue });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={AgeInputRef}
                  />
                </div>

                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingColor"
                  >
                    Pet Color:
                  </label>
                  <input
                    type="text"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Color"
                    id="floatingColor"
                    value={formData.color}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 128) {
                        setFormData({ ...formData, color: e.target.value });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    ref={ColorInputRef}
                  />
                </div>
                <div>
                  <label
                    class="col-form-label col-form-label-sm"
                    for="floatingBirthdate"
                  >
                    Pet Birthdate:
                  </label>
                  <input
                    type="date"
                    class="form-control form-control-sm booking-form"
                    placeholder="Pet Birthdate"
                    id="floatingBirthdate"
                    value={formData.birthdate}
                    onChange={handleBirthdateChange}
                  />
                </div>
                <div>
                  <label
                    className="col-form-label col-form-label-sm"
                    for="genderOptions"
                  >
                    Pet Gender:
                  </label>
                  <div id="genderOptions">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="male"
                        value="male"
                        checked={formData.gender === "male"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      />
                      <label className="form-check-label" for="male">
                        Male
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="female"
                        value="female"
                        checked={formData.gender === "female"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      />
                      <label className="form-check-label" for="female">
                        Female
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="col-form-label col-form-label-sm"
                    htmlFor="vaccinationOptions"
                  >
                    Vaccination:
                  </label>
                  <div id="vaccinationOptions">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="vaccination"
                        id="vaccinationyes"
                        value="yes"
                        checked={formData.vaccination === "yes"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vaccination: e.target.value,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="vaccinationyes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="vaccination"
                        id="vaccinationno"
                        value="no"
                        checked={formData.vaccination === "no"}
                        onChange={handleVaccinationChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="vaccinationno"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
                {formData.vaccination === "yes" && ( // Conditionally render if vaccination is yes
                  <div>
                    <label
                      className="col-form-label col-form-label-sm"
                      htmlFor="vaccinationDate"
                    >
                      Vaccination Date:
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm booking-form"
                      id="vaccinationDate"
                      value={formData.vaccinationDate}
                      onChange={handleVaccinationDateChange}
                    />
                  </div>
                )}

                <div>
                  <label
                    className="col-form-label col-form-label-sm"
                    for="groomingOptions"
                  >
                    First Grooming:
                  </label>
                  <div id="groomingOptions">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="grooming"
                        id="groomingyes"
                        value="yes"
                        checked={formData.firstGrooming === "yes"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstGrooming: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" for="groomingyes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="grooming"
                        id="groomingno"
                        value="no"
                        checked={formData.firstGrooming === "no"} // Check if gender is male
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstGrooming: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" for="groomingno">
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <br />
                <div>
                  <input
                    type="checkbox"
                    checked={termsChecked}
                    onChange={handleTermsChange}
                  />
                  <label htmlFor="terms">
                    I agree to the <a href="/terms">Terms and Conditions</a>.
                  </label>
                </div>
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  disabled={!termsChecked}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <br />
    </section>
  );
}

export default Pet;
