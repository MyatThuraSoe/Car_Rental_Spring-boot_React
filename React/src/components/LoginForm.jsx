import React, { useState } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/auth/login`, { email, password });
            login(response.data, response.data.token);
            if(response.data.role){
                navigate('/');
            }
            
        } catch (err) {
            setError("Invalid login credentials");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2> Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
    );
};

export default LoginForm;
