import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

const RentsManagement = () => {
  const { id } = useParams(); // Car ID from the URL
  const [rents, setRents] = useState([]);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
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
            params: { status: rent.rentStatus },
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
      <style>
        {`
          /* General Styles */
          body {
            font-family: 'Arial', sans-serif;
            background-color: #ffffff; /* White background */
            color: #333; /* Dark gray text */
          }

          h1 {
            font-weight: bold;
            color: #2c3e50; /* Dark blue heading */
            text-align: center;
            margin-bottom: 2rem;
          }

          .container {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
            background: #ffffff; /* White container */
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          /* Table Styles */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd; /* Light gray borders */
            color: #333; /* Dark gray text */
          }

          th {
            background-color: #f8f9fa; /* Light gray header background */
            color: #2c3e50; /* Dark blue text for headers */
            font-weight: bold;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9; /* Slightly lighter row background */
          }

          tr:hover {
            background-color: #f1f1f1; /* Light gray hover effect */
          }

          /* Button Styles */
          .btn {
            margin-right: 10px;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease-in-out;
          }

          .btn-primary {
            background-color: #007bff; /* Blue primary button */
            border: none;
            color: #fff; /* White text */
          }

          .btn-primary:hover {
            background-color: #0056b3; /* Darker blue */
          }

          .btn-secondary {
            background-color: #6c757d; /* Gray secondary button */
            border: none;
            color: #fff; /* White text */
          }

          .btn-secondary:hover {
            background-color: #5a6268; /* Darker gray */
          }

          .btn-success {
            background-color: #28a745; /* Green approve button */
            border: none;
            color: #fff; /* White text */
          }

          .btn-success:hover {
            background-color: #1e7e34; /* Darker green */
          }

          .btn-danger {
            background-color: #dc3545; /* Red deny button */
            border: none;
            color: #fff; /* White text */
          }

          .btn-danger:hover {
            background-color: #bd2130; /* Darker red */
          }

          /* Disabled Buttons */
          .btn.disabled {
            background-color: #adb5bd; /* Light gray disabled button */
            color: #fff; /* White text */
            cursor: not-allowed;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            table {
              font-size: 14px;
            }

            .btn {
              width: 100%;
              margin-bottom: 10px;
            }
          }
        `}
      </style>

      <h1>Rents Management</h1>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Car ID</th>
            <th>Customer ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            {authData.role === "Agency" && <th>Action</th>}
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
              {authData.role === "Agency" && (
                <td>
                  <button
                    className={`btn btn-success me-2 ${
                      rent.rentStatus === "ONGOING" || rent.rentStatus === "COMPLETED"
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => handleStatusChange(rent.id, "ONGOING")}
                    disabled={
                      rent.rentStatus === "ONGOING" || rent.rentStatus === "COMPLETED"
                    }
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
      {authData.role === "Agency" && (
        <button className="btn btn-primary mt-4" onClick={handleSubmit}>
          Submit Changes
        </button>
      )}
      <button
        className="btn btn-secondary mt-4 ms-2"
        onClick={() => navigate(authData.role === "Agency" ? `/cars/${id}` : `/`)}
      >
        Back
      </button>
    </div>
  );
};

export default RentsManagement;