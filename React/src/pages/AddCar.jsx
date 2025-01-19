import React, { useState } from "react";
import axiosInstance from "../api/axios";

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
          // You can create a Blob directly from the selected image if necessary
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
    
         
          // Append image as a Blob
          if (imageFiles) {
            formData.append("imageFile", imageFiles, "image.jpg"); // You can set the filename as needed
          }
    
          await axiosInstance.post("/agency/cars", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log(formData.stringify);
    
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
        <form onSubmit={handleSubmit}>
            <h2>Add Car</h2>
            <div className="mb-3">
                <label>Brand</label>
                <input type="text" className="form-control" name="brand" value={carData.brand} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Model</label>
                <input type="text" className="form-control" name="model" value={carData.model} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Year</label>
                <input type="number" className="form-control" name="year" value={carData.year} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>License Plate</label>
                <input type="text" className="form-control" name="licensePlate" value={carData.licensePlate} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>VIN</label>
                <input type="text" className="form-control" name="vin" value={carData.vin} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Mileage</label>
                <input type="number" className="form-control" name="mileage" value={carData.mileage} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Color</label>
                <input type="text" className="form-control" name="color" value={carData.color} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Category</label>
                <select className="form-control" name="category" value={carData.category} onChange={handleChange}>
                    {["SUV", "HATCHBACK", "SEDAN", "COUPE", "CONVERTIBLE", "TRUCK", "VAN", "OTHER"].map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label>Fuel Type</label>
                <select className="form-control" name="fuelType" value={carData.fuelType} onChange={handleChange}>
                    {["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "OTHER"].map(fuel => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label>Transmission</label>
                <select className="form-control" name="transmission" value={carData.transmission} onChange={handleChange}>
                    {["AUTOMATIC", "MANUAL"].map(transmission => (
                        <option key={transmission} value={transmission}>{transmission}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label>Seats</label>
                <input type="number" className="form-control" name="seats" value={carData.seats} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Features (comma separated)</label>
                <input type="text" className="form-control" name="features" value={carData.features} onChange={handleChange} placeholder="Air Conditioning, Navigation System" required />
            </div>
            <div className="mb-3">
                <label>Description</label>
                <textarea className="form-control" name="description" value={carData.description} onChange={handleChange} rows="3"></textarea>
            </div>
            <div className="mb-3">
                <label>Price per Day</label>
                <input type="number" step="0.01" className="form-control" name="pricePerDay" value={carData.pricePerDay} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Driver Fee per Day</label>
                <input type="number" step="0.01" className="form-control" name="driverFeePerDay" value={carData.driverFeePerDay} onChange={handleChange} required />
            </div>
            

            <div className="mb-3">
                <label>Car Images</label>
                    <input type="file" multiple className="form-control" onChange={handleImageChange} />
            </div>

        {imagePreviews.length > 0 && (
            <div className="mb-3">
            {imagePreviews.map((preview, index) => (
                <img
                key={index}
                src={preview}
                alt={`Car Preview ${index + 1}`}
                style={{ maxWidth: "200px", marginRight: "10px", marginBottom: "10px" }}
                />
            ))}
            </div>
        )}

        <button type="submit" className="btn btn-primary">
            Add Car
        </button>
        </form>
    );
};

export default AddCar;
