import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { Table, Button, Select } from 'antd';
import CustomerVerificationDetailsModal from './CustomerVerificationDetailsModal';

const { Option } = Select;

const CustomerVerificationList = () => {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("ALL"); // Default is ALL

    useEffect(() => {
        fetchVerifications();
    }, [currentPage, selectedStatus]);

    const fetchVerifications = async () => {
        try {
            const response = await axiosInstance.get(`/admin/verifications/customers/sort`, {
                params: { page: currentPage, status: selectedStatus }
            });
            setVerifications(response.data);
            setTotalPages(parseInt(response.headers['x-total-count'], 10));
        } catch (error) {
            console.error('Error fetching verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        setCurrentPage(0); // Reset to first page on filter change
    };

    const columns = [
        { title: 'ID', dataIndex: 'customerId', key: 'customerId' },
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'NRC', dataIndex: 'nrc', key: 'nrc' },
        { title: 'Verification Status', dataIndex: 'verificationStatusDescription', key: 'verificationStatusDescription' },
        {
            title: 'Profile Image',
            dataIndex: 'profileImage',
            key: 'profileImage',
            render: (profileImage) =>
                profileImage ? (
                    <img src={`data:image/jpeg;base64,${profileImage}`} alt="Profile" width="50" />
                ) : "N/A",
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button onClick={() => {
                    setSelectedVerification(record);
                    setShowModal(true);
                }}>
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1>Customer Verifications</h1>

            {/* ✅ Sorting Dropdown */}
            <Select defaultValue="ALL" onChange={handleStatusChange} style={{ width: 200, marginBottom: 20 }}>
                <Option value="ALL">All</Option>
                <Option value="VERIFIED">Verified</Option>
                <Option value="REUPLOAD">Reupload</Option>
                <Option value="DENIED">Denied</Option>
                <Option value="PENDING">Pending</Option>
            </Select>

            <Table
                columns={columns}
                dataSource={verifications}
                loading={loading}
                rowKey="customerId"
                pagination={{
                    current: currentPage + 1,
                    total: totalPages,
                    onChange: handlePageChange
                }}
            />

            {selectedVerification && (
                <CustomerVerificationDetailsModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    verification={selectedVerification}
                    setVerifications={setVerifications}
                />
            )}
        </div>
    );
};

export default CustomerVerificationList;
