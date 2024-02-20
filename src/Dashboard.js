// Dashboard.js

import React from "react";
import { generateReports } from "./firebase.js"; // Import the generateReports function

const Dashboard = () => {
  const handleGenerateReports = async () => {
    try {
      // Call the generateReports function
      await generateReports();
      alert("Reports generated successfully!");
    } catch (error) {
      console.error("Error generating reports:", error.message);
      alert("An error occurred while generating reports.");
    }
  };

  return (
    <div className="centered">
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
      {/* Button to trigger report generation */}
      <button onClick={handleGenerateReports}>Generate Reports</button>
    </div>
  );
};

export default Dashboard;
