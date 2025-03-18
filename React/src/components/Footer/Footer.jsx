import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"; 
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                
                <div className="footer-section">
                    <h3>Car Rentals</h3>
                    <p>Your trusted partner for affordable and reliable car rentals.</p>
                </div>

                
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/terms">Terms & Conditions</a></li>
                    </ul>
                </div>

                
                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="footer-socials">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>

            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Car Rentals. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
