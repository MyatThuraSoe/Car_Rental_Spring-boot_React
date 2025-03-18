import React, { useState } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const { login } = useAuth(); // Access login function from AuthContext
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(""); // State to store error messages
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            // Send login request to the backend
            const response = await axiosInstance.post(`/auth/login`, formData);

            // Handle successful login
            if (response.data.statusCode === 200) {
                login(response.data, response.data.token); // Save user data and token
                alert(response.data.message || "Login successful!");

                // Navigate to the home page or dashboard
                navigate("/");
            } else {
                setError(response.data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Login failed:", err);

            // Handle error response from the backend
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Invalid email or password.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>

            {/* Embedded CSS for Styling */}
            <style>
                {`
                  /* General Styles */
                  body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f8f9fa; /* Light gray background */
                    color: #333; /* Dark gray text */
                    margin: 0;
                    padding: 0;
                  }

                  .container {
                    max-width: 400px;
                    margin: 50px auto;
                    padding: 20px;
                    background: #ffffff; /* White container */
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  }

                  h2 {
                    font-weight: bold;
                    color: #2c3e50; /* Dark blue heading */
                    text-align: center;
                    margin-bottom: 1.5rem;
                  }

                  /* Form Styles */
                  form {
                    display: flex;
                    flex-direction: column;
                  }

                  .mb-3 {
                    margin-bottom: 1rem;
                  }

                  label {
                    font-weight: bold;
                    color: #2c3e50; /* Dark blue labels */
                    margin-bottom: 0.5rem;
                    display: block;
                  }

                  input[type="email"],
                  input[type="password"] {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd; /* Light gray border */
                    border-radius: 5px;
                    font-size: 1rem;
                    transition: border-color 0.3s ease-in-out;
                  }

                  input[type="email"]:focus,
                  input[type="password"]:focus {
                    border-color: #007bff; /* Blue border on focus */
                    outline: none;
                  }

                  /* Alert Messages */
                  .alert {
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 1rem;
                  }

                  .alert-danger {
                    background-color: #f8d7da; /* Light red background */
                    color: #721c24; /* Dark red text */
                    border: 1px solid #f5c6cb; /* Red border */
                  }

                  /* Button Styles */
                  .btn {
                    padding: 10px;
                    border-radius: 5px;
                    font-weight: bold;
                    transition: background-color 0.3s ease-in-out;
                  }

                  .btn-primary {
                    background-color: #007bff; /* Blue primary button */
                    border: none;
                    color: #fff; /* White text */
                  }

                  .btn-primary:hover {
                    background-color: #0056b3; /* Darker blue */
                  }

                  /* Responsive Design */
                  @media (max-width: 768px) {
                    .container {
                      padding: 15px;
                    }

                    input[type="email"],
                    input[type="password"] {
                      font-size: 0.9rem;
                    }
                  }
                `}
            </style>
        </div>
    );
};

export default LoginForm;