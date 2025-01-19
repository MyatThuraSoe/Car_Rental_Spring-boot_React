import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./CarList.css";
import FilterCar from "./FilterCar";


const CarList = () => {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get("https://www.freetestapi.com/api/v1/cars")
      .then((response) => setCars(response.data))
      .catch((error) => console.error("Error fetching car data:", error));
  }, []);

  const totalPages = Math.ceil(cars.length / itemsPerPage);
  const currentCars = cars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <FilterCar />
      <div className="car-list">
        <h1>Car List</h1>
        <div className="car-cards">
          {currentCars.map((car) => (
            <div
              key={car.id}
              className="car-card"
              onClick={() => navigate(`/cars/${car.id}`)}
              style={{ cursor: "pointer" }} 
            >
              <img
                src="../types-of-cars/sedan2-image.avif"
                alt={`${car.make || "Unknown"} ${car.model || "Unknown"}`}
                className="car-image"
              />
              <div className="car-info">
                <h3>
                  {car.make || "Unknown Make"} {car.model || "Unknown Model"}
                </h3>
                <p>Year: {car.year || "N/A"}</p>
                <p>Price: ${car.price || "Contact for price"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

    </>
  );
};

export default CarList;
