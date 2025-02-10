import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import "./CarList.css";
import FilterCar from "./FilterCar";
 
const fetchAllCars = async () => {
  try {
    const response = await axiosInstance.get("/view/cars");
    return response.data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};
 
const CarList = () => {
  const [cars, setCars] = useState([]);
  const [carImages, setCarImages] = useState({});
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 12;
  const navigate = useNavigate();
 
  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchAllCars();
        setCars(data);
        fetchCarImages(data);
      } catch (err) {
        setError("Failed to load cars.");
      }
    };
 
    loadCars();
  }, []);
 
  const fetchCarImages = async (carsList) => {
    const images = {};
    await Promise.all(
      carsList.map(async (car) => {
        try {
          const response = await axiosInstance.get(`/view/cars/${car.id}/image`, {
            responseType: "blob",
          });
          images[car.id] = URL.createObjectURL(response.data);
        } catch (error) {
          images[car.id] = "https://dummyimage.com/400x300/000/fff"; // Fallback placeholder
        }
      })
    );
    setCarImages(images);
  };
 
  const filteredCars = cars.filter((car) =>
  `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
);
 
 
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const currentCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page when searching
  };
 
  return (
    <>
      <FilterCar onSearchChange={handleSearchChange} />
      <div className="car-list">
        <h1>Car List</h1>
        {error && <p className="error-message">{error}</p>}
        {filteredCars.length === 0 ? (
          <p>No cars available at the moment</p>
        ) : (
          <>
            <div className="car-cards">
              {currentCars.map((car) => (
                <div
                  key={car.id}
                  className="car-card"
                  onClick={() => navigate(`/cars/${car.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={carImages[car.id] || "https://dummyimage.com/400x300/000/fff"}
                    alt={`${car.make || "Unknown"} ${car.model || "Unknown"}`}
                    className="car-image"
                  />
                  <div className="car-info">
                    <h3>
                      {car.brand || "Unknown brand"} {car.model || "Unknown Model"}
                    </h3>
                    <p>Year: {car.year || "N/A"}</p>
                    <p>Price: ${car.pricePerDay || "Contact for price"} /day</p>
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
          </>
        )}
      </div>
    </>
  );
};
 
export default CarList;
