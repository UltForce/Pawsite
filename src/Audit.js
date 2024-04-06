import React, { useEffect, useState, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Import necessary Firestore functions

const Audit = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10); // Update logsPerPage to 10
  const [filteredAuditLogs, setFilteredAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilters, setTypeFilters] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeRef = useRef(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const db = getFirestore();
        const snapshot = await getDocs(collection(db, "auditLogs"));
        const logs = snapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp
            ? data.timestamp.toDate().toLocaleString()
            : "";
          return {
            id: doc.id,
            ...data,
            timestamp: timestamp,
          };
        });
        setAuditLogs(logs);
        setFilteredAuditLogs(logs);
        sortFilteredLogs(logs);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchAuditLogs();
  }, []);

  const sortFilteredLogs = (logs) => {
    const sortedLogs = logs.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    setFilteredAuditLogs(sortedLogs);
  };

  const handleSearch = () => {
    const filtered = auditLogs.filter((log) => {
      const idMatch = log.id.toLowerCase().includes(searchTerm.toLowerCase());
      const userIdMatch = log.userId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const typeFilterMatch =
        typeFilters.length === 0 || typeFilters.includes(log.eventType);
      return (idMatch || userIdMatch) && typeFilterMatch;
    });

    setFilteredAuditLogs(filtered);
    sortFilteredLogs(filtered);
    setCurrentPage(1); // Reset current page to 1 after search
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        typeRef.current &&
        !typeRef.current.contains(event.target) &&
        !event.target.classList.contains("btn-outline-secondary")
      ) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTypeFilterChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setTypeFilters([...typeFilters, value]);
    } else {
      setTypeFilters(typeFilters.filter((filter) => filter !== value));
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Logic for pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredAuditLogs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <div className="background-image customerReport">
      <h2>Audit Logs</h2>
      <div className="search-container d-flex">
        {/* Search input */}
        <div className="form-floating">
          <input
            type="text"
            placeholder="Search by id or User ID"
            className="form-control me-sm-3 search"
            id="floatingSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label htmlFor="floatingSearch">Search by id or User ID</label>
        </div>
        {/* Type dropdown */}
        <div className="dropdown btn-group me-sm-3" ref={typeRef}>
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            id="btnGroupDrop1"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
          >
            Type
          </button>
          <div
            aria-labelledby="btnGroupDrop1"
            className={`dropdown-menu ${showTypeDropdown ? "show" : ""}`}
          >
            <label
              className="dropdown-item checkbox"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                value="Login"
                onChange={handleTypeFilterChange}
                checked={typeFilters.includes("Login")}
              />
              Login
            </label>
            <label
              className="dropdown-item checkbox"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                value="Logout"
                onChange={handleTypeFilterChange}
                checked={typeFilters.includes("Logout")}
              />
              Logout
            </label>
            <label
              className="dropdown-item checkbox"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                value="Report"
                onChange={handleTypeFilterChange}
                checked={typeFilters.includes("Report")}
              />
              Report
            </label>
            <label
              className="dropdown-item checkbox"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                value="Appointment"
                onChange={handleTypeFilterChange}
                checked={typeFilters.includes("Appointment")}
              />
              Appointment
            </label>
            <label
              className="dropdown-item checkbox"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                value="Service"
                onChange={handleTypeFilterChange}
                checked={typeFilters.includes("Service")}
              />
              Service
            </label>
            <label
              className="dropdown-item checkbox"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                value="Password"
                onChange={handleTypeFilterChange}
                checked={typeFilters.includes("Password")}
              />
              Password
            </label>
            <label
              className="dropdown-item checkbox"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                value="Register"
                onChange={handleTypeFilterChange}
                checked={typeFilters.includes("Register")}
              />
              Register
            </label>
            {/* Add more checkboxes for other types */}
          </div>
        </div>

        <button
          className="btn btn-secondary my-2 my-sm-0"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <br />
      <table className="w3-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Event Type</th>
            <th>User ID</th>
            <th>Timestamp</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.eventType}</td>
              <td>{log.userId}</td>
              <td>{log.timestamp}</td>
              <td>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <ul className="pagination">
        {filteredAuditLogs.length > logsPerPage &&
          Array.from({
            length: Math.ceil(filteredAuditLogs.length / logsPerPage),
          }).map((_, index) => (
            <li key={index} className="page-item">
              <button
                onClick={() => paginate(index + 1)}
                className={`page-link ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Audit;
