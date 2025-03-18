import React, { useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      await axiosInstance.post("/auth/send-otp", { email });
      toast.success("OTP sent to your email 📩");
      setStep(2);
    } catch (error) {
      toast.error("Failed to send OTP ❌");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axiosInstance.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified ✅");
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP ❌");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.post("/auth/reset-password", { email, newPassword });
      toast.success("Password reset successful! 🎉");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Failed to reset password ❌");
    }
  };

  return (
    <div className="forgot-password-page">
      <style>
        {`
          .forgot-password-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f3f4f6;
          }

          .forgot-password-container {
            max-width: 28rem;
            width: 100%;
            margin: 1rem;
            padding: 1.5rem;
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .form-section {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          h2 {
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }

          p {
            text-align: center;
            color: #4b5563;
            margin-bottom: 1rem;
          }

          input {
            width: 100%;
            padding: 0.5rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
          }

          button {
            width: 100%;
            padding: 0.5rem;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #1d4ed8;
          }
        `}
      </style>

      <Toaster richColors position="top-right" />
      <div className="forgot-password-container">
        {step === 1 && (
          <div className="form-section">
            <h2>Forgot Password?</h2>
            <p>Enter your email to receive an OTP.</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleSendOTP}>Send OTP</button>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h2>Enter OTP</h2>
            <p>Check your email for the OTP.</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button onClick={handleVerifyOTP}>Verify OTP</button>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h2>Reset Password</h2>
            <p>Enter your new password.</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;