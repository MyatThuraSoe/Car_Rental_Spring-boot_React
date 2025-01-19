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

    const handleApproveOrder = async (orderId) => {
        setModalLoading(true);
        try {
            await axiosInstance.put(`/rent/orders/${orderId}/status`, { status: 'APPROVED' });
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
            await axiosInstance.put(`/rent/orders/${orderId}/status`, { status: 'DENIED' });
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
        <div>
            <h2>Rental Orders</h2>
            {rentalOrders.length === 0 ? (
                <p>No rental orders found.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Car</th>
                            <th>Customer</th>
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
                                <td>{order.car ? `${order.car.brand} ${order.car.model}` : 'N/A'}</td>
                                <td>{order.customer ? order.customer.username : 'N/A'}</td>
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
        </div>
    );
};

export default AgencyRentalOrdersList;
