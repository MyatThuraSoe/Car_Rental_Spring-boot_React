import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "../components/CarCard";
import axiosInstance from "../api/axios";

export const fetchAllCars = async () => {
  try {
    const response = await axiosInstance.get("/view/cars");
    return response.data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return []; // Return an empty array in case of error
  }
};

const ViewCars = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchAllCars();
        setCars(data);
      } catch (err) {
        setError("Failed to load cars");
      }
    };
    loadCars();
  }, []);

  const handleCarClick = (id) => {
    navigate(`/view/cars/${id}`); // Navigate to car details page
  };

  return (
    <div className="container">
      {cars.length === 0 ? (
        <>
          <div>No cars available at the moment</div>
        </>
      ) : (
        <>
          <h1 className="my-4">Available Cars</h1>
          {error && <p>{error}</p>}
          <div className="row">
            {cars.map((car) => (
              <div
                className="col-md-4"
                key={car.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleCarClick(car.id)} // Pass click handler
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCars;
