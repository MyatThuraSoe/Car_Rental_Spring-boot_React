import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { Table, Button, Select, Alert } from 'antd';
import AgencyVerificationDetailsModal from './AgencyVerificationDetailsModal';

const { Option } = Select;

const AgencyVerificationList = () => {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    useEffect(() => {
        fetchVerifications();
    }, [currentPage, selectedStatus]);

    const fetchVerifications = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const params = { page: currentPage, size: 10 };
            if (selectedStatus !== 'ALL') {
                params.status = selectedStatus;
            }
            const response = await axiosInstance.get('/admin/verifications/agencies/sort', { params });
            if (response.data.success) {
                const pageData = response.data.data || {};
                setVerifications(pageData.content || []); // Extract content array
                setTotalItems(pageData.totalElements || 0); // Use totalElements instead of header
                setSuccess(response.data.message);
            } else {
                setError(response.data.message || 'Failed to fetch agency verifications');
                setVerifications([]);
            }
        } catch (error) {
            console.error('Error fetching verifications:', error);
            setError(error.response?.data?.message || 'Failed to fetch agency verifications');
            setVerifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1); // Adjust for 0-based indexing
    };

    return (
        <div className="agency-verification-list">
            <h1>Agency Verifications</h1>
            {loading && <Alert message="Loading..." type="info" showIcon style={{ marginBottom: 20 }} />}
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
            {success && !loading && (
                <Alert message={success} type="success" showIcon style={{ marginBottom: 20 }} />
            )}
            <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 200, marginBottom: 20 }}
            >
                <Option value="ALL">All Statuses</Option>
                <Option value="PENDING">Pending</Option>
                <Option value="VERIFIED">Verified</Option>
                <Option value="REUPLOAD">Reupload</Option>
                <Option value="DENIED">Denied</Option>
            </Select>

            <Table
                columns={[
                    { title: 'ID', dataIndex: 'agencyId', key: 'agencyId' },
                    { title: 'Username', dataIndex: 'username', key: 'username' },
                    { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
                    { title: 'City', dataIndex: 'city', key: 'city' },
                    {
                        title: 'Status',
                        dataIndex: 'verificationStatus',
                        key: 'verificationStatus',
                    },
                    {
                        title: 'Actions',
                        render: (_, record) => (
                            <Button
                                onClick={() => {
                                    setSelectedVerification(record);
                                    setShowModal(true);
                                }}
                                disabled={loading}
                            >
                                View Details
                            </Button>
                        ),
                    },
                ]}
                dataSource={verifications}
                loading={loading}
                pagination={{
                    current: currentPage + 1,
                    total: totalItems,
                    pageSize: 10,
                    onChange: handlePageChange,
                }}
                rowKey="agencyId"
            />

            {selectedVerification && (
                <AgencyVerificationDetailsModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    verification={selectedVerification}
                    refreshList={fetchVerifications}
                />
            )}
        </div>
    );
};

export default AgencyVerificationList;