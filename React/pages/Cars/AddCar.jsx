import React, { useState } from "react";
import axiosInstance from "../../api/axios";
import './AddCar.css';  // Import your CSS file here

const AddCar = () => {
    const [carData, setCarData] = useState({
        brand: "Toyota",
        model: "Vitz",
        year: "2010",
        licensePlate: "9P/1234",
        vin: "65473",
        mileage: "100000",
        color: "White",
        category: "SEDAN",
        fuelType: "PETROL",
        transmission: "AUTOMATIC",
        seats: "4",
        features: "Aircons",
        description: "Nice",
        pricePerDay: "80",
        driverFeePerDay: "50"
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            const blob = new Blob([selectedImage], { type: selectedImage.type });
            setImageFiles(blob);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            for (const key in carData) {
                formData.append(key, carData[key]);
            }

            if (imageFiles) {
                formData.append("imageFile", imageFiles, "image.jpg");
            }

            await axiosInstance.post("/agency/cars", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Car added successfully!");
            setCarData({
                brand: "Toyota",
                model: "Vitz",
                year: "2010",
                licensePlate: "9P/1234",
                vin: "65473",
                mileage: "100000",
                color: "White",
                category: "SEDAN",
                fuelType: "PETROL",
                transmission: "AUTOMATIC",
                seats: "4",
                features: "Aircons",
                description: "Nice",
                pricePerDay: "80",
                driverFeePerDay: "50"
            });
            setImageFiles([]);
            setImagePreviews([]); // Clear previews after submit
        } catch (error) {
            console.error("Error adding car:", error);
            alert("Error adding car. Please try again.");
        }
    };

    return (
        <form className="add-car-form-container" onSubmit={handleSubmit}>
            <h2>Add Car</h2>
            <div className="form-group">
                <label>Brand</label>
                <input type="text" className="add-car-form-control" name="brand" value={carData.brand} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Model</label>
                <input type="text" className="add-car-form-control" name="model" value={carData.model} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Year</label>
                <input type="number" className="add-car-form-control" name="year" value={carData.year} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>License Plate</label>
                <input type="text" className="add-car-form-control" name="licensePlate" value={carData.licensePlate} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>VIN</label>
                <input type="text" className="add-car-form-control" name="vin" value={carData.vin} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Mileage</label>
                <input type="number" className="add-car-form-control" name="mileage" value={carData.mileage} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Color</label>
                <input type="text" className="add-car-form-control" name="color" value={carData.color} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Category</label>
                <select className="add-car-form-control" name="category" value={carData.category} onChange={handleChange}>
                    {["SUV", "HATCHBACK", "SEDAN", "COUPE", "CONVERTIBLE", "TRUCK", "VAN", "OTHER"].map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Fuel Type</label>
                <select className="add-car-form-control" name="fuelType" value={carData.fuelType} onChange={handleChange}>
                    {["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "OTHER"].map(fuel => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Transmission</label>
                <select className="add-car-form-control" name="transmission" value={carData.transmission} onChange={handleChange}>
                    {["AUTOMATIC", "MANUAL"].map(transmission => (
                        <option key={transmission} value={transmission}>{transmission}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Seats</label>
                <input type="number" className="add-car-form-control" name="seats" value={carData.seats} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Features (comma separated)</label>
                <input type="text" className="add-car-form-control" name="features" value={carData.features} onChange={handleChange} placeholder="Air Conditioning, Navigation System" required />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea className="add-car-form-control" name="description" value={carData.description} onChange={handleChange} rows="3"></textarea>
            </div>
            <div className="form-group">
                <label>Price per Day</label>
                <input type="number" step="0.01" className="add-car-form-control" name="pricePerDay" value={carData.pricePerDay} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Driver Fee per Day</label>
                <input type="number" step="0.01" className="add-car-form-control" name="driverFeePerDay" value={carData.driverFeePerDay} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Car Images</label>
                <input type="file" multiple className="add-car-form-control" onChange={handleImageChange} />
            </div>

            {imagePreviews.length > 0 && (
                <div className="form-group">
                    {imagePreviews.map((preview, index) => (
                        <img
                            key={index}
                            src={preview}
                            alt={`Car Preview ${index + 1}`}
                            className="image-preview"
                        />
                    ))}
                </div>
            )}

            <button type="submit" className="submit-btn">
                Add Car
            </button>
        </form>
    );
};

export default AddCar;
