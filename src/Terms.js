import React from "react";

const Terms = () => {
  return (
    <div className="centered">
      <div>
        <h2>Terms and Conditions</h2>
      </div>
      <div>
        <div>
          <h2>1. Appointment Scheduling</h2>
          <p>A customer can only schedule one appointment at a time</p>
        </div>
        <div>
          <h2>2. Cancellation</h2>
          <p>
            A customer can only request cancellation on appointments schedule
            within 3 days
          </p>
        </div>
        <div>
          <h2>3. Automatic Scheduling</h2>
          <p>
            Any appointments that are not accepted within 3 days will be
            automatically canceled.
          </p>
          <p>
            In the case that a customer wants to push through an already
            cancelled appointment by the system, the customer has to contact the
            administrators directly.
          </p>
        </div>
        <div>
          <h2>4. Pet Information</h2>
          <p>
            The customers must be able to give accurate information on their pet
            like species, breed, and their sizes as this may affect the prices
            of the appointment.
          </p>
        </div>
        <div>
          <h2>5. Vaccination</h2>
          <p>
            The customers may be requested to show their vaccinations for their
            pets as part of their health policies.
          </p>
        </div>
        <div>
          <h2>6. Grooming services</h2>
          <p>
            The groomer will only provide the grooming services stated in the
            scheduled appointment.
          </p>
          <p>
            In the case that the customer wishes to request more services, the
            customer and groomer must both agree to the conditions and the
            customer will have added costs.
          </p>
        </div>
        <div>
          <h2>7. Latecomers</h2>
          <p>
            Customers and Groomers must be able to come at the scheduled time.
          </p>
          <p>
            Latecomers may incur additional charges or their appointment
            canceled.
          </p>
        </div>
        <div>
          <h2>8. Liability</h2>
          <p>
            The grooming shop will take reasonable care for the customer's pet
            but will not be liable for any pre-existing conditions.
          </p>
          <p>
            The customers are liable for any damage or injuries that their pet
            may have caused.
          </p>
        </div>
        <div>
          <h2>9. Photography and Social Media</h2>
          <p>
            Customers may be asked by the grooming shop to take pictures of
            their pets for marketing purposes. The customer may choose to
            refuse.
          </p>
        </div>
        <div>
          <h2>10. Privacy Policy</h2>
          <p>
            Customer and Pet information will be kept confidential and will not
            be shared with third parties.
          </p>
        </div>
        <div>
          <h2>11. Changes to Terms and Conditions</h2>
          <p>
            The grooming shop reserves the right to modify these terms and
            conditions as needed.
          </p>
          <p>Customers will be notified of any changes.</p>
        </div>
        <div>
          <h2>11. Refusal of Service</h2>
          <p>
            The grooming shop reserves the right to refuse service to any client
            for any reason.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
