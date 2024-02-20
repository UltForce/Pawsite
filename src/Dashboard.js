// Dashboard.js

import React from "react";
import { generateReports } from "./firebase.js"; // Import the generateReports function
import './dashboard.css'

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
    <>
    <div className="centered">
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>

{/* Appointment column */}
      <div className="appointmentReport">
      <h3>Appointments</h3>
      <table class="w3-table">  

<thead>
    <tr>  
        <th>60</th>  
        <th>15</th>  
        <th>4</th>  
    </tr>  
</thead>  
   
<tbody>  
    <tr>  
        <td>Last 30 days</td>  
        <td>Last 15 days</td>  
        <td>Today</td>  
        
    </tr>  
</tbody>  
</table>
    </div>
    <br></br>
{/* Appointment Column */}

{/* New customer table */}
    <div class="customerReport">
      <h3>New Customers</h3>
        <table class="w3-table">  

            <thead>
                <tr>  
                    <td>First Name</td>  
                    <td>Last Name</td>  
                    <td>Email</td>  
                    <td>Mobile Number</td>  
                    <td>Appointment Date</td>  
                    <td>Service</td>  
                    <td>Appointment Status</td>  

                </tr>  
            </thead>  
               <br></br>
            <tbody>  
                <tr>  
                    <td>Vincent</td>  
                    <td>Vega</td>  
                    <td>vincent_vega@gmail.com</td>  
                    <td>XXXXXXXXXXX</td> 
                    <td>December 22, 2023 Friday</td>  
                    <td>Home Grooming</td>  
                    <td>Accepted</td> 
                </tr>  
                <tr>  
                    <td>Jane</td>  
                    <td>Doe</td>  
                    <td>jane_doe@outlook.com</td>  
                    <td>XXXXXXXXXXX</td> 
                    <td>December 21, 2023 Thursday</td>  
                    <td>On-Site Grooming</td>  
                    <td>Accepted</td> 
                </tr>  
                <tr>  
                    <td>Jeff</td>  
                    <td>Doe</td>  
                    <td>jeff_doe@outlook.com</td>  
                    <td>XXXXXXXXXXX</td> 
                    <td>December 20, 2023 Wednesday</td>  
                    <td>On-site Grooming</td>  
                    <td>Accepted</td> 
                </tr>  

            </tbody>  
        </table>
    </div>
    <br></br>
    {/* New customer table */}

      {/* Button to trigger report generation */}
      <button onClick={handleGenerateReports}>Generate Reports</button>
    </div>
    </>
  );
};

export default Dashboard;
