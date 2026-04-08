import React, { useState, useEffect } from "react";
import "./ComplaintTable.css";

const ComplaintTable = () => {

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/complaints")
      .then((response) => response.json())
      .then((res) => {
        console.log(res)
        setComplaints(res.data);
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error);
      })
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic update
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint.complaintId === id ? { ...complaint, status: newStatus } : complaint
      )
    );

    try {
      console.log(`Updating complaint ${id} to status: ${newStatus}`);
      const response = await fetch(`http://localhost:3000/api/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log(`Response status: ${response.status}`);
      const responseData = await response.json();
      console.log(`Response data:`, responseData);

      if (!response.ok) {
        throw new Error(`Failed to update status: ${responseData.message || response.statusText}`);
      }
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="complaint-table-container">
      <h2>Complaint Logs</h2>
      {complaints.length === 0 ? <div>Loading....</div> : <table className="complaint-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Complaint</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id || complaint.complaintId}>
              <td>{complaint.complaintId}</td>
              <td>{formatDate(complaint.createdAt)}</td>
              <td>{complaint.description}</td>
              <td>
                <select
                  className={`status-select status-${complaint.status.toLowerCase().replace(" ", "-")}`}
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint.complaintId, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
};

export default ComplaintTable;
