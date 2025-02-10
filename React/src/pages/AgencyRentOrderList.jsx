import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import OrderDetailsModal from './OrderDetailsModal';
import moment from 'moment';

const AgencyRentalOrdersList = () => {
    const [rentalOrders, setRentalOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const { authData } = useAuth();

    const fetchRentalOrders = async () => {
        try {
            const response = await axiosInstance.get('/rent/orders/agency');
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

    const handleApproveOrder = async (orderid) => {
        setModalLoading(true);
        try {
            console.log("Sending approve status to the server for id" + orderid);
            await axiosInstance.put(`/rent/orders/${orderid}/status?status=APPROVED`);
            fetchRentalOrders();
            handleCloseModal();
        } catch (err) {
            console.error('Error approving order:', err);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDenyOrder = async (orderId) => {
        setModalLoading(true);
        try {
            await axiosInstance.put(`/rent/orders/${orderId}/status?status=DENIED`);
            fetchRentalOrders();
            handleCloseModal();
        } catch (err) {
            console.error('Error denying order:', err);
        } finally {
            setModalLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching rental orders: {error?.message || 'Unknown error'}</div>;

    return (
        <div className='.AgencyOrderListContainer'>
            

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
                            <th>Customer ID</th>
                            <th>Name</th>
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
                                <td>{order.customerId}</td>
                                <td>{order.customerName || 'N/A'}</td>
                                <td>{order.startDate ? moment(order.startDate).format('YYYY-MM-DD') : 'N/A'}</td>
                                <td>{order.endDate ? moment(order.endDate).format('YYYY-MM-DD') : 'N/A'}</td>
                                <td>{order.pickUpLocation || 'N/A'}</td>
                                <td>{order.dropOffLocation || 'N/A'}</td>
                                <td>{order.totalPrice ? `$${order.totalPrice.toFixed(2)}` : 'N/A'}</td>
                                <td>{order.status || 'N/A'}</td>
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
            <OrderDetailsModal
                show={showModal}
                handleClose={handleCloseModal}
                order={selectedOrder}
                onApprove={handleApproveOrder}
                onDeny={handleDenyOrder}
            />

            {/* Inline Styles */}
            <style>
                {`
                    
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
                        background-color: #007bff;
                        color: white;
                        font-weight: bold;
                    }
                    tr:hover {
                        background-color: #f1f1f1;
                    }
                    .btn-primary {
                        background-color: #007bff;
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

export default AgencyRentalOrdersList;