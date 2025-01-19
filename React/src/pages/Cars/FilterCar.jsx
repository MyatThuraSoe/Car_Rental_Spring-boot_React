import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FilterCar.css";


const FilterCar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [minYear, setMinYear] = useState("Min Year");
  const [maxYear, setMaxYear] = useState("Max Year");
  const [priceRange, setPriceRange] = useState({ min: 10000, max: 500000 });

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);

  useEffect(() => {
    // Fetch car data from the new API endpoint
    axios
      .get("https://www.freetestapi.com/api/v1/cars")
      .then((response) => {
        const cars = response.data; 
        const uniqueMakes = [...new Set(cars.map((car) => car.make))];
        const uniqueModels = [...new Set(cars.map((car) => car.model))];
        const uniqueBodyTypes = [...new Set(cars.map((car) => car.bodyType))];

        setMakes(uniqueMakes);
        setModels(uniqueModels);
        setBodyTypes(uniqueBodyTypes);
      })
      .catch((error) => console.error("Error fetching car data:", error));
    
  }, []);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    if (name === "min") {
      setPriceRange((prev) => ({
        ...prev,
        min: Math.min(numericValue, prev.max),
      }));
    } else if (name === "max") {
      setPriceRange((prev) => ({
        ...prev,
        max: Math.max(numericValue, prev.min),
      }));
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search Cars"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="filter-bar">
        <select value={make} onChange={(e) => setMake(e.target.value)} className="dropdown">
          <option value="">All Makes</option>
          {makes.map((make, index) => (
            <option key={index} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select value={model} onChange={(e) => setModel(e.target.value)} className="dropdown">
          <option value="">All Models</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="dropdown">
          <option value="">All Body Types</option>
          {bodyTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="year-dropdown">
          <label>Year:</label>
          <select value={minYear} onChange={(e) => setMinYear(e.target.value)} className="dropdown">
            <option value="">Min Year</option>
            {[...Array(24).keys()].map((i) => (
              <option key={2000 + i} value={2000 + i}>
                {2000 + i}
              </option>
            ))}
          </select>

          <select value={maxYear} onChange={(e) => setMaxYear(e.target.value)} className="dropdown">
            <option value="">Max Year</option>
            {[...Array(24).keys()].map((i) => (
              <option key={2000 + i} value={2000 + i}>
                {2000 + i}
              </option>
            ))}
          </select>
        </div>

        <div className="price-range">
          <label>Price Range:</label>
          <div className="range-inputs">
            <input
              type="number"
              name="min"
              placeholder="Min"
              value={priceRange.min}
              onChange={handlePriceChange}
              className="price-input"
            />
            <input
              type="number"
              name="max"
              placeholder="Max"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="price-input"
            />
          </div>
          <div className="range-slider">
            <input
              type="range"
              min="0"
              max="500000"
              step="1000"
              value={priceRange.min}
              name="min"
              onChange={handlePriceChange}
              className="slider"
            />
            <input
              type="range"
              min="0"
              max="500000"
              step="1000"
              value={priceRange.max}
              name="max"
              onChange={handlePriceChange}
              className="slider"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterCar;
