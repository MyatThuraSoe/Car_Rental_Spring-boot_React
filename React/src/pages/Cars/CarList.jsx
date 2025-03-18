import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import "./CarList.css";

const fetchAllCars = async () => {
  try {
    const response = await axiosInstance.get("/view/cars");
    return response.data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};

// Helper function to get stored values from localStorage
const getStoredValue = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [carImages, setCarImages] = useState({});
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    return getStoredValue("currentPage", 1);
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return getStoredValue("searchTerm", "");
  });
  const [make, setMake] = useState(() => {
    return getStoredValue("make", "");
  });
  const [model, setModel] = useState(() => {
    return getStoredValue("model", "");
  });
  const [category, setCategory] = useState(() => {
    return getStoredValue("category", "");
  });
  const [minYear, setMinYear] = useState(() => {
    return getStoredValue("minYear", "");
  });
  const [maxYear, setMaxYear] = useState(() => {
    return getStoredValue("maxYear", "");
  });
  const [priceRange, setPriceRange] = useState(() => {
    return getStoredValue("priceRange", { min: 0, max: 1000 });
  });

  const itemsPerPage = 3;
  const navigate = useNavigate();

  // Fetch cars and images when the component mounts
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

  // Fetch car images
  const fetchCarImages = async (carsList) => {
    const images = {};
    await Promise.all(
      carsList.map(async (car) => {
        try {
          const response = await axiosInstance.get(
            `/view/cars/${car.id}/image`,
            {
              responseType: "blob",
            }
          );
          images[car.id] = URL.createObjectURL(response.data);
        } catch (error) {
          images[car.id] = "https://dummyimage.com/400x300/000/fff"; // Fallback placeholder
        }
      })
    );
    setCarImages(images);
  };

  // Memoize the filtered cars to avoid unnecessary recalculations
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const trimmedSearch = searchTerm.trim().toLowerCase();
      return (
        (trimmedSearch === "" ||
          `${car.brand} ${car.model}`.toLowerCase().includes(trimmedSearch) ||
          (car.category &&
            car.category.toLowerCase().includes(trimmedSearch))) &&
        (make === "" || car.brand === make) &&
        (model === "" || car.model === model) &&
        (category === "" ||
          (car.category &&
            car.category.toLowerCase() === category.toLowerCase())) &&
        (minYear === "" || car.year >= parseInt(minYear)) &&
        (maxYear === "" || car.year <= parseInt(maxYear)) &&
        car.pricePerDay >= priceRange.min &&
        car.pricePerDay <= priceRange.max
      );
    });
  }, [cars, searchTerm, make, model, category, minYear, maxYear, priceRange]);

  // Calculate total pages and current cars to display
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const currentCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem("currentPage", pageNumber);
  };

  // Save filter values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("searchTerm", JSON.stringify(searchTerm));
    localStorage.setItem("make", JSON.stringify(make));
    localStorage.setItem("model", JSON.stringify(model));
    localStorage.setItem("category", JSON.stringify(category));
    localStorage.setItem("minYear", JSON.stringify(minYear));
    localStorage.setItem("maxYear", JSON.stringify(maxYear));
    localStorage.setItem("priceRange", JSON.stringify(priceRange));
  }, [searchTerm, make, model, category, minYear, maxYear, priceRange]);

  // Hardcoded dropdown options
  const hardcodedMakes = [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet ",
    "Tesla",
    "BMW",
    "Mercedes-Benz",
    "Nissan",
    "Audi",
    "Hyundai",
    "Mazda",
    "Subaru",
    "Lexus",
    "Kia",
    "Volkswagen",
    "Jeep",
    "Chrysler",
    "GMC",
  ];
  const hardcodedModels = [
    "Malibu",
    "Vitz",
    "Corolla",
    "Civic",
    "Mustang",
    "Tahoe",
    "Model S",
    "X5",
    "C-Class",
    "Altima",
    "Q7",
    "Elantra",
    "Camry",
    "F-150",
    "Impala",
    "CX-5",
    "Accord",
    "Optima",
    "Outback",
    "RX",
    "Malibu",
    "3 Series",
    "Golf",
    "Model 3",
    "Escape",
    "Wrangler",
    "A4",
    "Santa Fe",
    "Rogue",
    "Highlander",
    "Mazda3",
    "Pacifica",
    "Sierra",
  ];
  const hardcodedCategories = [
    "Sedan",
    "Coupe",
    "SUV",
    "Truck",
    "Hatchback",
    "Minivan",
  ];

  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange.max) {
      setPriceRange((prev) => ({ ...prev, min: value }));
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange.min) {
      setPriceRange((prev) => ({ ...prev, max: value }));
    }
  };

  return (
    <>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search Cars"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-bar">
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="dropdown"
          >
            <option value="">All Makes</option>
            {hardcodedMakes.map((make, index) => (
              <option key={index} value={make}>
                {make}
              </option>
            ))}
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="dropdown"
          >
            <option value="">All Models</option>
            {hardcodedModels.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="dropdown"
          >
            <option value="">All Categories</option>
            {hardcodedCategories.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div className="year-dropdown">
            <label>Year:</label>
            <select
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              className="dropdown"
            >
              <option value="">Min Year</option>
              {[...Array(24).keys()].map((i) => (
                <option key={2000 + i} value={2000 + i}>
                  {2000 + i}
                </option>
              ))}
            </select>

            <select
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              className="dropdown"
            >
              <option value="">Max Year</option>
              {[...Array(24).keys()].map((i) => (
                <option key={2000 + i} value={2000 + i}>
                  {2000 + i}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range with Input Boxes and Slider */}
          <div className="price-range">
            <label>
              Price Range: ${priceRange.min} - ${priceRange.max}
            </label>

            <div className="range-inputs">
              <input
                type="number"
                name="min"
                placeholder="Min"
                value={priceRange.min}
                onChange={handleMinPriceChange}
                className="price-input"
              />
              <input
                type="number"
                name="max"
                placeholder="Max"
                value={priceRange.max}
                onChange={handleMaxPriceChange}
                className="price-input"
              />
            </div>

            <div className="range-slider">
              <input
                type="range"
                name="min"
                min="0"
                max="1000"
                step="1"
                value={priceRange.min}
                onChange={handleMinPriceChange}
                className="slider"
              />
              <input
                type="range"
                name="max"
                min="0"
                max="1000"
                step="1"
                value={priceRange.max}
                onChange={handleMaxPriceChange}
                className="slider"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="car-list">
        <h1>Car List</h1>
        {error && <p className="error-message">{error}</p>}
        {cars.length === 0 ? (
          <p>No cars available at the moment</p>
        ) : filteredCars.length === 0 ? (
          <p>No cars match your filter criteria.</p>
        ) : (
          <>
            <div className="car-cards">
              {currentCars.map((car) => (
                <Link
                  to={`/cars/${car.id}`}
                  key={car.id}
                  className="car-card-link"
                >
                  <div className="car-card">
                    <img
                      src={
                        carImages[car.id] ||
                        "https://dummyimage.com/400x300/000/fff"
                      }
                      alt={`${car.brand || "Unknown"} ${
                        car.model || "Unknown"
                      }`}
                      className="car-image"
                    />
                    <div className="car-info">
                      <h3>
                        {car.brand} {car.model}
                      </h3>
                      <p>Year: {car.year}</p>
                      <p>Price: ${car.pricePerDay}</p>
                    </div>
                  </div>
                </Link>
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
