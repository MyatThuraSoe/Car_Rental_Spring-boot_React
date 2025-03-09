import React, { useState } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import "./MyAccount.css";

const MyAccount = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Show loading animation

    try {
      const response = await axiosInstance.post(`/auth/login`, {
        email: accountInfo.email,
        password: accountInfo.password,
      });

      login(response.data, response.data.token);
      toast.success("Login successful! 🎉", { duration: 2000 });

      setTimeout(() => {
        setIsLoggingIn(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      setIsLoggingIn(false);
      toast.error("Invalid login credentials ❌");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/auth/register`, accountInfo);
      toast.success("Registration successful! Please log in. ✅", {
        duration: 2000,
      });
      setIsRegistering(false);
      setTimeout(() => {
        if (accountInfo.role === "Customer") {
          navigate("/customer/login");
        } else if (accountInfo.role === "Agency") {
          navigate("/agency/login");
        }
      }, 2000);
    } catch (err) {
      toast.error("Registration failed. Please try again. ❌");
    }
  };

  return (
    <div className="my-account">
      <Toaster richColors position="top-right" /> {/* Sonner Toaster */}
      <div className="loginBg"></div>
      <div>
        <div className="auth-container">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <>
                <div className="form-group">
                  <label htmlFor="role">Role:</label>
                  <select
                    id="role"
                    name="role"
                    value={accountInfo.role}
                    onChange={handleAccountChange}
                    required
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value="Customer">Customer</option>
                    <option value="Agency">Agency</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    placeholder="John Doe"
                    type="text"
                    id="name"
                    name="name"
                    value={accountInfo.name}
                    onChange={handleAccountChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                placeholder="johndoe@gmail.com"
                type="email"
                id="email"
                name="email"
                value={accountInfo.email}
                onChange={handleAccountChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={accountInfo.password}
                onChange={handleAccountChange}
                required
              />
            </div>

            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <div className="spinner"></div> // Show spinner during login
              ) : isRegistering ? (
                "Register"
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="toggle-auth-container">
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              className="toggle-auth"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
