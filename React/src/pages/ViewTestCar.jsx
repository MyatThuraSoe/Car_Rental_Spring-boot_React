import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const ViewTestCar = () => {
    const [carData, setCarData] = useState(null);
    const [error, setError] = useState(null);
    const carId = 1; // Assuming you want to fetch the car with ID 1 for testing

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await axiosInstance.get(`/view/cars/test/${carId}`);
                setCarData(response.data);
            } catch (err) {
                setError("Error fetching car data");
                console.error(err);
            }
        };

        fetchCarData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!carData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Test Car Details</h2>
            <p><strong>Brand:</strong> {carData.brand}</p>
            <p><strong>Model:</strong> {carData.model}</p>
            <p><strong>Year:</strong> {carData.year}</p>
            <p><strong>License Plate:</strong> {carData.licensePlate}</p>
            <p><strong>Price per Day:</strong> ${carData.pricePerDay}</p>
            <img src={carData.imageUrls[0]} alt={carData.model} style={{ width: "200px", height: "auto" }} />
            <h3>Description</h3>
            <p>{carData.description}</p>
        </div>
    );
};

export default ViewTestCar;
