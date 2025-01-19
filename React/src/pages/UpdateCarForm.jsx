import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCarForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [carData, setCarData] = useState({
        brand: "",
        model: "",
        year: "",
        licensePlate: "",
        vin: "",
        mileage: "",
        color: "",
        category: "",
        fuelType: "",
        transmission: "",
        seats: "",
        features: "",
        description: "",
        pricePerDay: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axiosInstance.get(`/agency/cars/${id}`);
                setCarData(response.data);

                const imageResponse = await axiosInstance.get(`/view/cars/${id}/image`, {
                    responseType: "blob",
                });
                setPreviewImage(URL.createObjectURL(imageResponse.data));
            } catch (err) {
                setError("Failed to fetch car details.");
            }
        };
        fetchCar();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file)); // Show preview of the selected image
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(carData).forEach((key) => formData.append(key, carData[key]));
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        try {
            await axiosInstance.put(`/agency/cars/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Car updated successfully!");
            navigate(`/agency/cars/${id}`);
        } catch (err) {
            alert("Failed to update car.");
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Update Car</h1>
            <div>
                <label>Brand</label>
                <input name="brand" value={carData.brand} onChange={handleChange} required />
            </div>
            <div>
                <label>Model</label>
                <input name="model" value={carData.model} onChange={handleChange} required />
            </div>
            <div>
                <label>Year</label>
                <input type="number" name="year" value={carData.year} onChange={handleChange} required />
            </div>
            <div>
                <label>License Plate</label>
                <input name="licensePlate" value={carData.licensePlate} onChange={handleChange} required />
            </div>
            <div>
                <label>VIN</label>
                <input name="vin" value={carData.vin} onChange={handleChange} required />
            </div>
            <div>
                <label>Mileage (km)</label>
                <input type="number" name="mileage" value={carData.mileage} onChange={handleChange} required />
            </div>
            <div>
                <label>Color</label>
                <input name="color" value={carData.color} onChange={handleChange} required />
            </div>
            <div>
                <label>Category</label>
                <input name="category" value={carData.category} onChange={handleChange} required />
            </div>
            <div>
                <label>Fuel Type</label>
                <input name="fuelType" value={carData.fuelType} onChange={handleChange} required />
            </div>
            <div>
                <label>Transmission</label>
                <input name="transmission" value={carData.transmission} onChange={handleChange} required />
            </div>
            <div>
                <label>Seats</label>
                <input type="number" name="seats" value={carData.seats} onChange={handleChange} required />
            </div>
            <div>
                <label>Features</label>
                <input name="features" value={carData.features} onChange={handleChange} />
            </div>
            <div>
                <label>Description</label>
                <textarea name="description" value={carData.description} onChange={handleChange} required />
            </div>
            <div>
                <label>Price Per Day</label>
                <input type="number" name="pricePerDay" value={carData.pricePerDay} onChange={handleChange} required />
            </div>
            <div>
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && <img src={previewImage} alt="Preview" style={{ width: "200px", marginTop: "10px" }} />}
            </div>
            <button type="submit">Update</button>
        </form>
    );
};

export default UpdateCarForm;
