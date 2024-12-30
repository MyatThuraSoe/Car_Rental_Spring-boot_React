import React, { useState } from "react";
import axiosInstance from "../api/axios";

const RegisterForm = ({ role }) => {
    const [formData, setFormData] = useState({ email: "", password: "", name: "" });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/auth/register`, { ...formData, role });
            setSuccess(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{role} Register</h2>
            {success && <div className="alert alert-success">Registration successful!</div>}
            <div className="mb-3">
                <label>Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Password</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
        </form>
    );
};

export default RegisterForm;
