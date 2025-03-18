import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
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
    available: "",
  });

  const [imageFiles, setImageFiles] = useState({
    main: null,
    first: null,
    second: null,
    third: null,
  });

  const [previewImages, setPreviewImages] = useState({
    main: null,
    first: null,
    second: null,
    third: null,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axiosInstance.get(`/agency/cars/${id}`);
        const car = response.data;
        setCarData(car);

        const convertToBase64 = (data, type) =>
          data ? `data:${type};base64,${data}` : null;

        setPreviewImages({
          main: convertToBase64(car.imageData, car.imageType),
          first: convertToBase64(car.firstImageData, car.firstImageType),
          second: convertToBase64(car.secondImageData, car.secondImageType),
          third: convertToBase64(car.thirdImageData, car.thirdImageType),
        });
      } catch (err) {
        setError("Failed to fetch car details.");
      }
    };
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({ ...prev, [imageType]: reader.result }));
        setImageFiles((prev) => ({ ...prev, [imageType]: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(carData).forEach(([key, value]) => formData.append(key, value));
    if (imageFiles.main) formData.append("imageFile", imageFiles.main);
    if (imageFiles.first) formData.append("firstImage", imageFiles.first);
    if (imageFiles.second) formData.append("secondImage", imageFiles.second);
    if (imageFiles.third) formData.append("thirdImage", imageFiles.third);

    try {
      await axiosInstance.put(`/agency/cars/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Car updated successfully!");
      navigate(`/cars/${id}`);
    } catch (err) {
      alert("Failed to update car.");
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
      

      <h1 className="title">Update Car</h1>
      <form onSubmit={handleSubmit} className="form">
        {/* Car Info Section */}
        <section className="section">
          <h2 className="subtitle">Car Details</h2>
          <div className="grid">
            {[
              { label: "Brand", name: "brand", type: "text" },
              { label: "Model", name: "model", type: "text" },
              { label: "Year", name: "year", type: "number" },
              { label: "License Plate", name: "licensePlate", type: "text" },
              { label: "VIN", name: "vin", type: "text" },
              { label: "Mileage", name: "mileage", type: "number" },
              { label: "Color", name: "color", type: "text" },
              { label: "Category", name: "category", type: "text" },
              { label: "Fuel Type", name: "fuelType", type: "text" },
              { label: "Transmission", name: "transmission", type: "text" },
              { label: "Seats", name: "seats", type: "number" },
              { label: "Price Per Day", name: "pricePerDay", type: "number" },
            ].map((field) => (
              <div key={field.name} className="input-group">
                <label className="label">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={carData[field.name]}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            ))}
            <div className="input-group">
              <label className="label">Features</label>
              <input
                type="text"
                name="features"
                value={carData.features}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="input-group-full">
              <label className="label">Description</label>
              <textarea
                name="description"
                value={carData.description}
                onChange={handleChange}
                className="textarea"
                required
              />
            </div>
            <div>
                <label>Available</label>
                <input 
                    type="checkbox" 
                    name="available" 
                    checked={carData.available} 
                    onChange={(e) => setCarData({...carData, available: e.target.checked})} 
                />
            </div>
          </div>
        </section>

        {/* Image Upload Section */}
        <section className="section">
          <h2 className="subtitle">Images</h2>
          <div className="image-grid">
            {["main", "first", "second", "third"].map((type) => (
              <div key={type} className="image-group">
                <label className="label">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, type)}
                  className="file-input"
                />
                {previewImages[type] && (
                  <img
                    src={previewImages[type]}
                    alt={`${type} Preview`}
                    className="preview-image"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="button">
          Update Car
        </button>
      </form>

      <style>{`
        .container {
          background-color: #fff;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .title {
          color: #000;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 30px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 6px;
        }

        .subtitle {
          color: #000;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
          border-bottom: 2px solid #ffd700;
          display: inline-block;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group-full {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
        }

        .label {
          color: #000;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .input {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          color: #000;
          outline: none;
          transition: border-color 0.3s;
        }

        .input:focus {
          border-color: #ffd700;
        }

        .textarea {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          color: #000;
          min-height: 100px;
          resize: vertical;
          outline: none;
          transition: border-color 0.3s;
        }

        .textarea:focus {
          border-color: #ffd700;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .image-group {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .file-input {
          margin-bottom: 10px;
          font-size: 14px;
          color: #000;
        }

        .preview-image {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          border: 1px solid #ffd700;
          margin-top: 10px;
        }

        .button {
          background-color: #ffd700;
          color: #000;
          padding: 12px 20px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          align-self: center;
        }

        .button:hover {
          background-color: #e6c200;
        }

        .error {
          color: #ff0000;
          text-align: center;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default UpdateCarForm;