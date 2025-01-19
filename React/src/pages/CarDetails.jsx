import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Modal } from "antd";
import CarOrderForm from "./CarOrderForm";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [carImage, setCarImage] = useState(null);
  const [error, setError] = useState(null);
  const [rentedDates, setRentedDates] = useState([]);
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!authData.token) {
      // If user is not authenticated, do not fetch car details
      return;
    }

    const fetchCarDetails = async () => {
      try {
        const carEndpoint =
          authData.role === "Agency" ? `/agency/cars/${id}` : `/view/cars/${id}`;
        const carResponse = await axiosInstance.get(carEndpoint);
        setCar(carResponse.data);
        console.log(carResponse.data);
        const imageResponse = await axiosInstance.get(`/view/cars/${id}/image`, {
          responseType: "blob",
        });
        setCarImage(URL.createObjectURL(imageResponse.data));
      } catch (err) {
        console.error("Error fetching car details or image:", err);
        setError("Failed to fetch car details. Please try again later.");
      }
    };

    const fetchRentedDates = async () => {
      try {
        // Uncomment the line below to fetch rented dates from the server
        // const response = await axiosInstance.get(`/rent/cars/${id}/rented-dates`);
        // setRentedDates(response.data);
        setRentedDates([
          {
            startDate: "2025-01-10",
            endDate: "2025-01-15",
          },
          {
            startDate: "2025-01-20",
            endDate: "2025-01-25",
          },
        ]);
      } catch (err) {
        console.error("Error fetching rented dates:", err);
        setError("Failed to fetch rented dates. Please try again later.");
      }
    };

    fetchCarDetails();
    fetchRentedDates();
  }, [id, authData.token, authData.role]);

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!car && authData.token) {
    return <p>Loading car details...</p>;
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/agency/cars/${id}`);
      alert("Car deleted successfully.");
      navigate("/agency/cars");
    } catch (err) {
      alert("Failed to delete car. Please try again.");
    }
  };

  const handleUpdate = () => {
    navigate(`/agency/cars/${id}/edit`);
  };

  const handleOrder = () => {
    navigate(`/agency/cars/${id}/orders`);
  };

  const handleRents = () => {
    navigate(`/agency/cars/${id}/rents`);
  };

  const handleRent = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container my-4">
      {authData.token ? (
        <>
          <h1 className="mb-4">
            {car?.brand} {car?.model}
          </h1>
          <div className="row">
            <div className="col-md-6">
              <img
                src={carImage || "https://via.placeholder.com/400"}
                alt={`${car?.brand} ${car?.model}`}
                className="img-fluid rounded"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-6">
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Price per Day:</strong> ${car?.pricePerDay}
                </li>
                <li className="list-group-item">
                  <strong>License Plate:</strong> {car?.licensePlate}
                </li>
                <li className="list-group-item">
                  <strong>Color:</strong> {car?.color}
                </li>
                <li className="list-group-item">
                  <strong>Year:</strong> {car?.year}
                </li>
              </ul>
              <div className="mt-4">
                {authData.role === "Agency" && (
                  <>
                    <button onClick={handleUpdate} className="btn btn-primary me-2">
                      Edit
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger">
                      Delete
                    </button>
                    <button onClick={handleOrder} className="btn btn-primary me-2">
                      Orders
                    </button>
                    <button onClick={handleRents} className="btn btn-primary me-2">
                      Rents
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    navigate(authData.role === "Agency" ? "/agency/cars" : "/browse")
                  }
                  className="btn btn-secondary ms-2"
                >
                  Back
                </button>
              </div>
              {authData.role === "Customer" && (
                <button onClick={handleRent} className="btn btn-success mt-4">
                  Rent This Car
                </button>
              )}
            </div>
          </div>
          <Modal
            title="Rent This Car"
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            centered
          >
            <CarOrderForm car={car} rentedDates={rentedDates} onClose={handleModalClose} />
          </Modal>
        </>
      ) : (
        <p>Please log in to view car details.</p>
      )}
    </div>
  );
};

export default CarDetails;