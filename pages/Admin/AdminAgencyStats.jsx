import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAgencyStats = () => {
    const [agencyStats, setAgencyStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAgencyStats();
    }, []);

    const fetchAgencyStats = async () => {
        try {
            const response = await axiosInstance.get('/admin/stats');
            setAgencyStats(response.data || []); // Ensure it's an array
        } catch (error) {
            console.error('Error fetching agency stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading agency stats...</div>;

    return (
        <div>
            <h2>Agency Statistics</h2>

            {/* Table View */}
            <table>
                <thead>
                    <tr>
                        <th>Agency ID</th>
                        <th>Agency Name</th>
                        <th>Total Orders</th>
                        <th>Total Rents</th>
                    </tr>
                </thead>
                <tbody>
                    {agencyStats.map((agency) => (
                        <tr key={agency.agencyId}>
                            <td>{agency.agencyId}</td>
                            <td>{agency.agencyName}</td>
                            <td>{agency.totalOrders}</td>
                            <td>{agency.totalRents}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Bar Chart */}
            <h3>Orders and Rents Per Agency</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agencyStats}>
                    <XAxis dataKey="agencyName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalOrders" fill="#8884d8" name="Total Orders" />
                    <Bar dataKey="totalRents" fill="#82ca9d" name="Total Rents" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AdminAgencyStats;

