import React, { useState } from "react";
import axiosInstance from "../api/axios";

const AddCar = () => {
    const [carData, setCarData] = useState({
        brand: "", model: "", year: "", licensePlate: "", pricePerDay: ""
    });

    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/agency/cars", carData);
            alert("Car added successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Car</h2>
            <div className="mb-3">
                <label>Brand</label>
                <input type="text" className="form-control" name="brand" value={carData.brand} onChange={handleChange} required />
            </div>
            {/* Repeat for other fields */}
            <button type="submit" className="btn btn-primary">Add Car</button>
        </form>
    );
};

export default AddCar;
