import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import OrderDetailsModalForCustomer from './OrderDetailsModalForCustomer';

const OrderListForCustomer = () => {
    const [rentalOrders, setRentalOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const { authData } = useAuth();

    const fetchRentalOrders = async () => {
        try {
            const rolePath = authData.role.toLowerCase();
            const response = await axiosInstance.get(`/rent/orders/${rolePath === "agency" ? "agency" : "customer"}`);
            console.log('Fetched Rental Orders:', response.data);
            setRentalOrders(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentalOrders();
    }, [authData]);

    const handleOrderClick = (order) => {
        console.log('Selected Order:', order);
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleCancelOrder = async (orderId) => {
        setModalLoading(true);
        try {
            await axiosInstance.put(`/rent/orders/${orderId}/status?status=CANCEL`);
            fetchRentalOrders();
            handleCloseModal();
        } catch (err) {
            console.error('Error denying order:', err);
        } finally {
            setModalLoading(false);
        }
    };

    // Function to determine the background color based on the order status
    const getStatusStyle = (status) => {
        switch (status) {
            case 'CANCEL':
                return { backgroundColor: '#f8d7da', color: '#721c24' }; // Red for Cancelled
            case 'PENDING':
                return { backgroundColor: '#fff3cd', color: '#856404' }; // Yellow for Pending
            case 'APPROVED':
                return { backgroundColor: '#d4edda', color: '#155724' }; // Green for Approved
            case 'DENIED':
                return { backgroundColor: '#f5c6cb', color: '#721c24' }; // Light Red for Denied
            default:
                return { backgroundColor: '#e9ecef', color: '#333' }; // Grey for Unknown
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching rental orders: {error?.message || 'Unknown error'}</div>;

    return (
        <div className="AgencyOrderListContainer">
            <h2>Rental Orders</h2>
            {rentalOrders.length === 0 ? (
                <p>No rental orders found.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Car Brand</th>
                            <th>Model</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Pick-Up Location</th>
                            <th>Drop-Off Location</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentalOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.carBrand}</td>
                                <td>{order.carModel}</td>
                                <td>{order.startDate ? moment(order.startDate).format('YYYY-MM-DD') : 'N/A'}</td>
                                <td>{order.endDate ? moment(order.endDate).format('YYYY-MM-DD') : 'N/A'}</td>
                                <td>{order.pickUpLocation || 'N/A'}</td>
                                <td>{order.dropOffLocation || 'N/A'}</td>
                                <td>{order.totalPrice ? `$${order.totalPrice.toFixed(2)}` : 'N/A'}</td>
                                <td style={getStatusStyle(order.status)}>{order.status || 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleOrderClick(order)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <OrderDetailsModalForCustomer
                show={showModal}
                handleClose={handleCloseModal}
                order={selectedOrder}
                onCancel={handleCancelOrder}
            />
            {/* Inline Styles */}
            <style>
                {`
                    .AgencyOrderListContainer {
                        padding: 20px;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        margin: 20px;
                    }
                    h2 {
                        color: #333;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                        background-color: #fff;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    th, td {
                        padding: 12px 15px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: black;
                        color: white;
                        font-weight: bold;
                    }
                    tr:hover {
                        background-color: #f1f1f1;
                    }
                    .btn-primary {
                        background-color: navy;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }
                    .btn-primary:hover {
                        background-color: #0056b3;
                    }
                    p {
                        text-align: center;
                        color: #6c757d;
                        font-size: 18px;
                    }
                `}
            </style>
        </div>
    );
};

export default OrderListForCustomer;