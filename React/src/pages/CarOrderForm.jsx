import React, { useState, useEffect } from 'react';
import BookingCalendar from '../components/BookingCalendar'; // Assume this component exists
import moment from 'moment';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CarOrderForm = ({ car, rentedDates }) => {
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    includeDriver: false,
    pickUpLocation: '',
    dropOffLocation: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const { authData } = useAuth();
  const Navigate = useNavigate();

  const driverFeePerDay = car.driverFeePerDay; // Fee per day for a driver
  const rentalPricePerDay = car.pricePerDay; // Car's daily rental price

  // Calculate the total price whenever inputs change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = moment(formData.startDate);
      const end = moment(formData.endDate);
      const days = end.diff(start, 'days') + 1;

      if (days > 0) {
        setNumberOfDays(days);
        const driverCost = formData.includeDriver ? days * driverFeePerDay : 0;
        setTotalPrice(days * rentalPricePerDay + driverCost);
      } else {
        setNumberOfDays(0);
        setTotalPrice(0);
      }
    } else {
      setNumberOfDays(0);
      setTotalPrice(0);
    }

    console.log(car);
  }, [formData, driverFeePerDay, rentalPricePerDay]);

  const handleDateSelect = ({ startDate, endDate }) => {
    setFormData((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) =>  {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || !formData.pickUpLocation || !formData.dropOffLocation) {
      alert('Please fill out all required fields.');
      return;
    }
    const postData = {
      carId: car.id,
      customerId: authData.user.id, // Assuming this is provided
      startDate: formData.startDate,
      endDate: formData.endDate,
      includeDriver: formData.includeDriver,
      pickUpLocation: formData.pickUpLocation,
      dropOffLocation: formData.dropOffLocation,
      totalPrice: totalPrice,
    };
    console.log("auth data user id is ", authData.user.id)
    console.log(postData);
    try{
      const response = await axiosInstance.post('/rent/orders',  {
        carId: car.id,
        customerId: authData.user.id, // Assuming this is provided
        startDate: formData.startDate,
        endDate: formData.endDate,
        includeDriver: formData.includeDriver,
        pickUpLocation: formData.pickUpLocation,
        dropOffLocation: formData.dropOffLocation,
        totalPrice: totalPrice,
      });
      Navigate('/browse');
    }catch(err){
      console.log(err);
    }
    
  };

  return (
    <div className="car-order-form">
      <h2>Car Rental Order Form</h2>
      <p><strong>Car Name:</strong> {car.brand} {car.model}</p>
      <p><strong>Car ID:</strong> {car.id}</p>

      <form onSubmit={handleSubmit}>
        {/* Booking Calendar */}
        <div className="form-group">
          <label>Select Rental Dates:</label>
          <BookingCalendar rentedDates={rentedDates} onDateSelect={handleDateSelect} />
        </div>

        {/* Number of Days */}
        {numberOfDays > 0 && <p>Number of Days: {numberOfDays}</p>}

        {/* Include Driver */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="includeDriver"
              checked={formData.includeDriver}
              onChange={handleChange}
            />
            Include Driver (${driverFeePerDay}/day)
          </label>
        </div>

        {/* Pickup Location */}
        <div className="form-group">
          <label>Pick-Up Location:</label>
          <input
            type="text"
            name="pickUpLocation"
            value={formData.pickUpLocation}
            onChange={handleChange}
            required
          />
        </div>

        {/* Drop-Off Location */}
        <div className="form-group">
          <label>Drop-Off Location:</label>
          <input
            type="text"
            name="dropOffLocation"
            value={formData.dropOffLocation}
            onChange={handleChange}
            required
          />
        </div>

        {/* Total Price */}
        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>

        {/* Submit Button */}
        <button type="submit">Submit Order</button>
      </form>

      <style jsx>{`
        .car-order-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #f9f9f9;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          font-weight: bold;
          margin-bottom: 5px;
          display: block;
        }
        input[type="text"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          display: block;
          width: 100%;
          padding: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }
        button:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default CarOrderForm;
