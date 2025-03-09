import { useState } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import mzpLogo from "/mzpLogo.png";
import { Dropdown } from "react-bootstrap"; // Import Bootstrap dropdown
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import AgencyNotification from "../AgencyNotification";
import CustomerNotification from "../CustomerNotification";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  // Close menu after clicking a link
  const handleCloseMenu = () => {
    setIsMobile(false);
  };

  const getLinkClassName = (path) => {
    return location.pathname === path ? "active-link-custom" : "";
  };

  const { authData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    handleCloseMenu(); // Ensure menu closes after logging out
  };

  return (
    <>
      <nav className="navbar-custom">
        <Link className="logo-custom" to="/" onClick={handleCloseMenu}>
          <img src={mzpLogo} alt="MZP Logo" width="100px" height="60px" />
        </Link>
        <div className="hamburger-custom" onClick={handleToggle}>
          <span className="bar-custom"></span>
          <span className="bar-custom"></span>
          <span className="bar-custom"></span>
        </div>
        <ul className={`nav-links-custom ${isMobile ? "active" : ""}`}>
          {/* {authData.role === "Customer" && ( */}
          <li>
            <Link
              className={getLinkClassName("/")}
              to="/"
              onClick={handleCloseMenu}
            >
              Home
            </Link>
          </li>
          {/* )} */}
          <li>
            <Link
              className={getLinkClassName("/cars")}
              to="/cars"
              onClick={handleCloseMenu}
            >
              Cars
            </Link>
          </li>
          <li>
            <Link
              className={getLinkClassName("/services")}
              to="/services"
              onClick={handleCloseMenu}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              className={getLinkClassName("/contactUs")}
              to="/contactUs"
              onClick={handleCloseMenu}
            >
              Contact Us
            </Link>
          </li>

          {!authData.token ? (
            <li className="nav-item-custom">
              <Link
                className="nav-link-custom"
                to="/account"
                onClick={handleCloseMenu}
              >
                <FontAwesomeIcon icon={faSignInAlt} className="login-icon" />{" "}
                Login
              </Link>
            </li>
          ) : (
            <li className="nav-item-custom">
              <Dropdown className="dropdown-custom">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="dropdown-toggle-custom"
                >
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-custom">
                  {authData.role === "Customer" && (
                    <>
                      <Dropdown.Item
                        as={Link}
                        to="/customer/profile"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/customer/cars/orders"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Orders
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/customer/cars/rents"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Rents
                      </Dropdown.Item>
                    </>
                  )}
                  {authData.role === "Agency" && (
                    <>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/profile"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/add-car"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Add Car
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/cars"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        My Cars
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/cars/orders"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        My Orders
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/cars/rents"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Rented Cars
                      </Dropdown.Item>
                    </>
                  )}
                  {authData.role === "Admin" && (
                    <>
                      <Dropdown.Item
                        as={Link}
                        to="/admin/manageUsers"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Manage Users
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/admin/agency-stats"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Agency Status
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/admin/feedback"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Admin Feedback
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="dropdown-item-custom"
                  >
                    {" "}
                    <span className="logout-text">Logout </span>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="logout-icon"
                    />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          )}
        </ul>
      </nav>

      {/* Add Notifications */}
      {authData.role === "Agency" && (
        <AgencyNotification agencyId={authData.user.id} />
      )}
      {authData.role === "Customer" && (
        <CustomerNotification customerId={authData.user.id} />
      )}
    </>
  );
};

export default Navbar;
