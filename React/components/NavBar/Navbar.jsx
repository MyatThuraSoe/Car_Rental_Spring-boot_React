import { useState } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import mzpLogo from '/mzpLogo.png';
import AgencyNotification from "../AgencyNotification"; 
import CustomerNotification from "../CustomerNotification";

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();  // Access current route location

    const handleToggle = () => {
        setIsMobile(!isMobile);
    };

    const getLinkClassName = (path) => {
        return location.pathname === path ? 'active-link' : '';  // Add 'active-link' for the current path
    };

    const { authData, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (

        <>
        <nav className="navbar">
            <Link className="logo" to="/">
                <img src={mzpLogo} alt="MZP Logo" width="100px" height="60px" />
            </Link>
            <div className="hamburger" onClick={handleToggle}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
            <ul className={`nav-links ${isMobile ? 'active' : ''}`}>
                <li><Link className={getLinkClassName('/')} to="/">Home</Link></li>
                <li><Link className={getLinkClassName('/cars')} to="/cars">Cars</Link></li>
                <li><Link className={getLinkClassName('/services')} to="/services">Services</Link></li>
                <li><Link className={getLinkClassName('/contactUs')} to="/contactUs">Contact Us</Link></li>
                <li><Link className={getLinkClassName('/account')} to="/account">My Account</Link></li>

                {!authData.token ? (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/customer/register">Customer Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/agency/register">Agency Register</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="nav-item">
                            <span style={{ fontSize: "18px", color: "orange", marginRight: "15px" }}>
                                You are logged in as: {authData.role || "Unknown Role"}
                            </span>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                        </li>
                        {authData.role == "Agency" &&
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/agency/add-car">Add Car</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/agency/cars">My Cars</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/agency/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/agency/cars/orders">Orders</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/agency/cars/rents">Rents</Link>
                                </li>
                            </>
                        }
                        {authData.role == "Customer" &&
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/browse">Browse Cars</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/customer/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/customer/cars/orders">Orders</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/customer/cars/rents">Rents</Link>
                                </li>
                            </>
                        }

                    </>
                )
                }
            </ul>
            
        </nav>
            
            {authData.role === "Agency" && <AgencyNotification agencyId={authData.user.id} />}
            {authData.role === "Customer" && <CustomerNotification customerId={authData.user.id} />}

        </>
        
    );
};

export default Navbar;
