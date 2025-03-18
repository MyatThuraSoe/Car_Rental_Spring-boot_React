import React, { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ role }) => {
    const [formData, setFormData] = useState({ email: "", password: "", name: "" });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(""); // State to store error message
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous error messages
        try {
            const resp = await axiosInstance.post(`/auth/register`, { ...formData, role });

            if (resp.data.statusCode === 200) {
                setSuccess(true);
                alert(resp.data.message);

                // Navigate to login page based on role
                if (role.toUpperCase() === "CUSTOMER") {
                    navigate("/customer/login");
                } else if (role.toUpperCase() === "AGENCY") {
                    navigate("/agency/login");
                } else if (role.toUpperCase() === "ADMIN") {
                    navigate("/admin/login");
                }
            } else if (resp.data.statusCode === 400) {
                setError(resp.data.message); // Set error message
                setFormData({ ...formData, email: "" }); // Reset email field
            }
        } catch (err) {
            console.error("Registration failed:", err);
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h2>{role} Register</h2>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
            {success && <p>Registration successful!</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button type="submit" className="btn btn-primary">Register</button>
                <style>
//             {`
            /* General Styles */
            body {
                font-family: 'Arial', sans-serif;
                background-color: #ffffff; /* White background */
                color: #333; /* Dark gray text */
            }

            .container {
                max-width: 500px;
                margin: auto;
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

            input[type="text"],
            input[type="email"],
            input[type="password"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd; /* Light gray border */
                border-radius: 5px;
                font-size: 1rem;
                transition: border-color 0.3s ease-in-out;
            }

            input[type="text"]:focus,
            input[type="email"]:focus,
            input[type="password"]:focus {
                border-color: #007bff; /* Blue border on focus */
                outline: none;
            }

            /* Success Alert */
            .alert-success {
                background-color: #d4edda; /* Light green background */
                color: #155724; /* Dark green text */
                padding: 10px;
                border: 1px solid #c3e6cb; /* Green border */
                border-radius: 5px;
                margin-bottom: 1rem;
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

                input[type="text"],
                input[type="email"],
                input[type="password"] {
                font-size: 0.9rem;
                }
            }
            `}
//         </style>
            </form>
        </div>
    );
};

export default RegisterForm;
