import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "antd";
import CarOrderForm from "./CarOrderForm";
import RateCar from "../../components/RateCar";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [carImage, setCarImage] = useState(null);
  const [error, setError] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
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
        console.log("Car Details:", carResponse.data);
        const imageResponse = await axiosInstance.get(`/view/cars/${id}/image`, {
          responseType: "blob",
        });
        console.log(imageResponse.data);
        setCarImage(URL.createObjectURL(imageResponse.data));
      } catch (err) {
        console.error("Error fetching car details or image:", err);
        setError("Failed to fetch car details. Please try again later.");
      }
    };

    const fetchUnavailableDates = async () => {
      try {
        const response = await axiosInstance.get(`/api/rents/${id}/unavailable-dates`);
        setUnavailableDates(response.data.map(date => new Date(date)));
        console.log("Unavailable Dates:", response.data);
      } catch (err) {
        console.error("Error fetching unavailable dates:", err);
        setError("Failed to fetch unavailable dates. Please try again later.");
      }
    };

    fetchCarDetails();
    fetchUnavailableDates();
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
            <div className="col-md-6 img-container">
              <img
                src={carImage || "https://dummyimage.com/400x300/000/fff"} // Use a different placeholder
                alt={`${car?.brand} ${car?.model}`}
                className="img-fluid rounded"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-6">
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Average Rating:</strong>{" "}
                  {car?.avgRating !== null && car?.avgRating !== undefined && car?.ratingCount != 0
                    ? car.avgRating.toFixed(1)
                    : "No ratings yet"}
                </li>
                <li className="list-group-item">
                  <strong>Brand:</strong> {car?.brand}
                </li>
                <li className="list-group-item">
                  <strong>Model:</strong> {car?.model}
                </li>
                <li className="list-group-item">
                  <strong>Year:</strong> {car?.year}
                </li>
                <li className="list-group-item">
                  <strong>Category:</strong> {car?.category}
                </li>
                <li className="list-group-item">
                  <strong>Transmission:</strong> {car?.transmission}
                </li>
                <li className="list-group-item">
                  <strong>Fuel Type:</strong> {car?.fuelType}
                </li>
                <li className="list-group-item">
                  <strong>Color:</strong> {car?.color}
                </li>
                <li className="list-group-item">
                  <strong>Seats:</strong> {car?.seats}
                </li>
                <li className="list-group-item">
                  <strong>VIN:</strong> {car?.vin}
                </li>
                <li className="list-group-item">
                  <strong>Mileage:</strong> {car?.mileage} km
                </li>
                <li className="list-group-item">
                  <strong>License Plate:</strong> {car?.licensePlate}
                </li>
                <li className="list-group-item">
                  <strong>Features:</strong> {car?.features}
                </li>
                <li className="list-group-item">
                  <strong>Description:</strong> {car?.description}
                </li>
                <li className="list-group-item">
                  <strong>Price per Day:</strong> ${car?.pricePerDay}
                </li>
                <li className="list-group-item">
                  <strong>Driver Fee per Day:</strong> ${car?.driverFeePerDay}
                </li>
              </ul>

                <p>
                  <strong>Owned By:</strong> {car.agencyName || "Unknown"}
                </p>

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
            <CarOrderForm car={car} unavailableDates={unavailableDates} onClose={handleModalClose} />
          </Modal>

          <RateCar id={id}/>
        </>
      ) : (
        <p>Please log in to view car details.</p>
      )}


<style>
        {`
          /* General Styles */
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            color: #333;
          }

          h1 {
            font-weight: bold;
            color: #2c3e50;
            text-align: center;
            margin-bottom: 2rem;
          }

          .container {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          img {
            border-radius: 10px;
            transition: transform 0.3s ease-in-out;
          }

          img:hover {
            transform: scale(1.05);
          }
          .img-container{
              display: flex;     
              align-items: center;
              justify-content: center;
          }

          .list-group-item {
            background-color: #f8f9fa;
            border: none;
            border-radius: 5px;
            margin-bottom: 10px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }

          .list-group-item strong {
            color: #2c3e50;
          }

          .btn {
            margin-right: 10px;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease-in-out;
          }

          .btn-primary {
            background-color:rgb(219, 208, 52);
            border: none;
          }

          .btn-primary:hover {
            background-color: #2980b9;
          }

          .btn-danger {
            background-color: #e74c3c;
            border: none;
          }

          .btn-danger:hover {
            background-color: #c0392b;
          }

          .btn-success {
            background-color: #2ecc71;
            border: none;
          }

          .btn-success:hover {
            background-color: #27ae60;
          }

          .btn-secondary {
            background-color: #95a5a6;
            border: none;
          }

          .btn-secondary:hover {
            background-color: #7f8c8d;
          }

          /* Modal Styles */
          .ant-modal-content {
            border-radius: 10px;
          }

          .ant-modal-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #2c3e50;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .row {
              flex-direction: column;
            }

            .col-md-6 {
              width: 100%;
            }

            .btn {
              width: 100%;
              margin-bottom: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CarDetails;