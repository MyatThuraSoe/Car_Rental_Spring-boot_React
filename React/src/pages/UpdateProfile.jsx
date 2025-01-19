import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
    const { authData } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(`/${authData.role.toLowerCase()}/${authData.user.id}`);
                // Initialize formData with fetched data and ensure name comes from authData.user
                setFormData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [authData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccess(null);
            // First, update the user details
            await axiosInstance.put(`/${authData.role.toLowerCase()}/${authData.user.id}`, formData);

          
            setSuccess("Profile updated successfully!");
            setTimeout(() => navigate("/profile"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h1>Update {authData.role} Profile</h1>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                {authData.role === "Agency" && (
                    <>
                        
                        <div className="form-group">
                            <label>Email:</label>
                            <label>{authData.user.email}</label>
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </>
                )}
                {authData.role === "Customer" && (
                    <>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Driving License</label>
                            <input
                                type="text"
                                name="drivingLiscene"
                                value={formData.drivingLiscene || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="btn btn-primary">
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;