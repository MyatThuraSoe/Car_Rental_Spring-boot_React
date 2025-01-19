import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import "./MyAccount.css";

const MyAccount = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [accountInfo, setAccountInfo] = useState({ name: "", email: "", password: "" });
  const [feedback, setFeedback] = useState("");

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (accountInfo.email === "user@example.com" && accountInfo.password === "password" && accountInfo.name === "user") {
      setIsLoggedIn(true);
      setFeedback("Login successful!");
    } else {
      setFeedback("Invalid email or password.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    setFeedback("Registration successful! Please log in.");
    setIsRegistering(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFeedback("You have been logged out.");
    setAccountInfo({ email: "", password: "" });
  };

  return (
    <>

    <div className="my-account">
    <div className="loginBg"></div>
      <div>
        {!isLoggedIn ? (
          <div className="auth-container">
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              {isRegistering && (
                  <>
                  <label htmlFor="name">Name:</label>
                  <input
                      type="text"
                      id="name"
                      name="name"
                      value={accountInfo.name || ""}
                      onChange={handleAccountChange}
                      required
                  />
                  </>
              )}
              <label htmlFor="email">Email:</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={accountInfo.email}
                  onChange={handleAccountChange}
                  required
              />
              <label htmlFor="password">Password:</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={accountInfo.password}
                  onChange={handleAccountChange}
                  required
              />
              <button type="submit">{isRegistering ? "Register" : "Login"}</button>
              </form>
              <p>
                  {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}

                  <button className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
                      {isRegistering ? "Login" : "Register"}
                  </button>
              </p>
              {feedback && <p className="feedback-message">{feedback}</p>}
          </div>
          ) : (
          <div className="logged-in-container">
            <FaUser className="user-icon" />
            <p>Welcome, {accountInfo.name}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
    </div>
    </div>
    </>
    
  );
};

export default MyAccount;

