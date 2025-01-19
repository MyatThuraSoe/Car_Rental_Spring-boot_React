import React from 'react';
import { useState } from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
    const carLogos = [
        "./popular-brands-image/toyota.png",
        "./popular-brands-image/honda.png",
        "./popular-brands-image/byd.png",
        "./popular-brands-image/chevrolet.png",
        "./popular-brands-image/mercedes.png",
        "./popular-brands-image/lexus.png",
        "./popular-brands-image/mazda.png",
    ];

    const [pickUpDate, setPickUpDate] = useState("");
    const [dropOffDate, setDropOffDate] = useState("");

    const handlePickUpDateChange = (e) => {
        const today = new Date().toISOString().split("T")[0];
        const selectedDate = e.target.value;
        if (selectedDate >= today) {
            setPickUpDate(selectedDate);
            if (dropOffDate && selectedDate > dropOffDate) {
                setDropOffDate("");
            }
        } 
    };

    const handleDropOffDateChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate > pickUpDate) {
            setDropOffDate(selectedDate);
        } 
    };

    return (
        <>
        <div className="hero-banner" style={{ backgroundImage: `url('./porsche.jpg')` }}>
            <div className="search-section">
                <div className='title'>
                    <h2>Pick up and drop off</h2>
                    <span>Need help? Call: <a href="tel:5554280940">555–428–0940</a></span>
                </div>
                <div className="search-fields">
                    <input type="text" placeholder="City, airport, train station..." className="location-input" />
                    <div className="date-time">
                        <div className="date-input">
                            <label>Pick up day</label>
                            <input 
                                type="date" 
                                value={pickUpDate} 
                                onChange={handlePickUpDateChange} 
                                min={new Date().toISOString().split("T")[0]} 
                            />
                            <input type="time" />
                        </div>
                        <div className="date-input">
                            <label>Drop off day</label>
                            <input 
                                type="date" 
                                value={dropOffDate} 
                                onChange={handleDropOffDateChange} 
                                min={pickUpDate || new Date().toISOString().split("T")[0]} 
                                disabled={!pickUpDate} 
                            />
                            <input type="time" />
                        </div>
                    </div>
                    <div className="options">
                        <label>
                            <input type="checkbox" /> Need a driver?
                        </label>
                        <label>
                            Driver's age <select>
                                <option>18 - 24</option>
                                <option>25 - 75</option>
                                <option>76+</option>
                            </select>
                        </label>
                    </div>
                    <button className="search-button">Search</button>
                </div>
            </div>
        </div>

        <div className="pupular-brands">
            <h2>Pupular Brands</h2>
                <div className="car-logos">
                    {carLogos.map((logo, index) => (
                        <div key={index} className="car-logo-container">
                            <img key={index} src={logo} alt={`Car logo ${index + 1}`} className="car-logo" />
                        </div>
                    ))}
                </div>
        </div>
         </>
    );
};

export default HeroBanner;



