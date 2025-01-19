import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

const OrdersManagement = () => {
  const { id } = useParams(); // Car ID from the URL
  const [orders, setOrders] = useState([]);
  const { authData } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersEndpoint =
          authData.role === "Agency" ? `/rent/orders/${id}/orders` : `rent/orders/customer`;
        const response = await axiosInstance.get(ordersEndpoint);
        console.log("Orders fetched:", response.data); // Debug log
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleSubmit = async () => {
    try {
      await Promise.all(
        orders.map((order) =>
          axiosInstance.put(`/rent/orders/${order.id}/status`, null, {
            params: { status: order.status },
          })
        )
      );
      alert("Order statuses updated successfully!");
      navigate(authData.role==="Agency"? `/cars/${id}`:`/`);
    } catch (err) {
      console.error("Error updating order statuses:", err);
      alert("Failed to update order statuses. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container my-4">
      <h1>Orders Management</h1>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Car ID</th>
            <th>Customer ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>PickUp Location</th>
            <th>DropOFF Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id || `order-${index}`}>
              <td>{order.carId || "N/A"}</td>
              <td>{order.customerId || "N/A"}</td>
              <td>{order.startDate || "N/A"}</td>
              <td>{order.endDate || "N/A"}</td>
              <td>{order.pickUpLocation || "N/A"}</td>
              <td>{order.dropOffLocation || "N/A"}</td>
              <td>{order.status || "N/A"}</td>
              {authData.role==="Agency" &&(
              
              <td>
                <button
                  className={`btn btn-success me-2 ${
                    order.status === "APPROVED" ? "disabled" : ""
                  }`}
                  onClick={() => handleStatusChange(order.id, "APPROVED")}
                  disabled={order.status === "APPROVED"}
                >
                  Approve
                </button>
                <button
                  className={`btn btn-danger ${
                    order.status === "DENIED" ? "disabled" : ""
                  }`}
                  onClick={() => handleStatusChange(order.id, "DENIED")}
                  disabled={order.status === "DENIED"}
                >
                  Deny
                </button>
              </td>
             )}
             {authData.role==="Customer" &&(
              
              <td>
                <button
                  className={`btn btn-success me-2 ${
                    order.status === "CANCEL" || order.status === "APPROVED" || order.status === "DENIED"? "disabled" : ""
                  }`}
                  onClick={() => handleStatusChange(order.id, "CANCEL")}
                  disabled={order.status === "CANCEL" || order.status === "APPROVED" || order.status === "DENIED"}
                >
                  Cancel
                </button>
                </td>
             )}

            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary mt-4" onClick={handleSubmit}>
        Submit Changes
      </button>
      <button
        className="btn btn-secondary mt-4 ms-2"
        onClick={() => navigate(authData.role==="Agency"? `/cars/${id}`:`/`)}
      >
        Back
      </button>
    </div>
  );
};

export default OrdersManagement;
