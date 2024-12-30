import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const ViewCars = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axiosInstance.get("/view/cars")
            .then(response => setCars(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>Available Cars</h2>
            <div>
                {cars.map((car) => (
                    <div key={car.id}>
                        <h4>{car.brand} {car.model}</h4>
                        <p>Price per day: ${car.pricePerDay}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewCars;
