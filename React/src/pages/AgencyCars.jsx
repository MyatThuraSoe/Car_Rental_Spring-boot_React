import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

const fetchAgencyCars = async () => {
    try {
        const response = await axiosInstance.get("/agency/cars");
        return response.data;
    } catch (error) {
        console.error("Error fetching agency cars", error);
        throw error;
    }
};

const AgencyCars = () => {
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    

    useEffect(() => {
        const loadCars = async () => {
            try {
                const data = await fetchAgencyCars();
                setCars(data);
                cars.map((car)=> console.log(`Car id ${car.id}`));
            } catch (err) {
                setError("Failed to load cars");
            }
        };
        loadCars();
    }, []);

    const handleCarClick = (id) => {
        navigate(`/cars/${id}`);
    };

    return (
        <div>
            <h1>My Cars</h1>
            {error && <p>{error}</p>}
            <ul>
                {cars.map((car) => (
                    <li
                        key={car.id}
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleCarClick(car.id)}
                    >
                        {car.brand} {car.model} - ${car.pricePerDay} per day
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AgencyCars;
