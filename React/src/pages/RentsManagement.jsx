import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

const RentsManagement = () => {
  const { id } = useParams(); // Car ID from the URL
  const [rents, setRents] = useState([]);
  const [error, setError] = useState(null);
  const {authData}=useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRents = async () => {
      try {
        const rentsEndpoint =
          authData.role === "Agency" ? `/api/rents/${id}/rents` : `/api/rents/customer`;
        const response = await axiosInstance.get(rentsEndpoint);
        console.log("Rents fetched:", response.data); // Debug log
        setRents(response.data);
      } catch (err) {
        console.error("Error fetching rents:", err);
        setError("Failed to fetch rents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRents();
  }, [id]);

  const handleStatusChange = (rentId, newRentStatus) => {
    setRents((prevRents) =>
      prevRents.map((rent) =>
        rent.id === rentId ? { ...rent, rentStatus: newRentStatus } : rent
      )
    );
  };

  const handleSubmit = async () => {
    try {
      await Promise.all(
        rents.map((rent) =>
          axiosInstance.put(`/api/rents/${rent.id}/status`, null, {
            params: { status: rent.rentStatus},
          })
        )
      );
      alert("Rents statuses updated successfully!");
      navigate(`/cars/${id}`);
    } catch (err) {
      console.error("Error updating rent statuses:", err);
      alert("Failed to update rent statuses. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading rents...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container my-4">
      <h1>Rents Management</h1>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Car ID</th>
            <th>Customer ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            {authData.role ==="Agency" &&(
            <th>Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rents.map((rent, index) => (
            <tr key={rent.id || `rent-${index}`}>
              <td>{rent.carId || "N/A"}</td>
              <td>{rent.customerId || "N/A"}</td>
              <td>{rent.startDate || "N/A"}</td>
              <td>{rent.endDate || "N/A"}</td>
              <td>{rent.rentStatus || "N/A"}</td>
              {authData.role ==="Agency" &&(
              <td>
                <button
                  className={`btn btn-success me-2 ${
                    rent.rentStatus === "ONGOING" || rent.rentStatus === "COMPLETED"? "disabled" : ""
                  }`}
                  onClick={() => handleStatusChange(rent.id, "ONGOING")}
                  disabled={rent.rentStatus === "ONGOING" || rent.rentStatus === "COMPLETED"}
                >
                  Ongoing
                </button>
                <button
                  className={`btn btn-danger ${
                    rent.rentStatus === "COMPLETED" ? "disabled" : ""
                  }`}
                  onClick={() => handleStatusChange(rent.id, "COMPLETED")}
                  disabled={rent.rentStatus === "COMPLETED"}
                >
                  Complete
                </button>
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {authData.role ==="Agency" &&(
      <button className="btn btn-primary mt-4" onClick={handleSubmit}>
        Submit Changes
      </button>
      )}
      <button
        className="btn btn-secondary mt-4 ms-2"
        onClick={() => navigate(authData.role==="Agency"?`/cars/${id}`:`/`)}
      >
        Back
      </button>
    </div>
  );
};

export default RentsManagement;
