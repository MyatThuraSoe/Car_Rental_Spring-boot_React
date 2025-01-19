import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const BookingCalendar = ({ rentedDates, onDateSelect }) => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // Determine the CSS class for each calendar tile
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isRented = rentedDates.some((range) =>
        moment(date).isBetween(moment(range.startDate), moment(range.endDate), 'day', '[]')
      );
      return isRented ? 'rented' : 'available';
    }
    return null;
  };

  // Disable dates that are within rented ranges
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return rentedDates.some((range) =>
        moment(date).isBetween(moment(range.startDate), moment(range.endDate), 'day', '[]')
      );
    }
    return false;
  };

  // Handle date range selection
  const handleChange = (selectedDates) => {
    setSelectedDateRange(selectedDates);

    if (Array.isArray(selectedDates)) {
      onDateSelect({
        startDate: moment(selectedDates[0]).format('YYYY-MM-DD'),
        endDate: moment(selectedDates[1]).format('YYYY-MM-DD'),
      });
    }
  };

  // Set the minimum selectable date to today and a maximum limit (e.g., 2 months from today)
  const minDate = new Date();
  const maxDate = moment().add(2, 'months').toDate();

  return (
    <div className="booking-calendar">
      <Calendar
        onChange={handleChange}
        value={selectedDateRange}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
        minDate={minDate}
        maxDate={maxDate}
        selectRange={true}
      />
      {selectedDateRange && (
        <p>
          Selected Date Range: {moment(selectedDateRange[0]).format('YYYY-MM-DD')} -{' '}
          {moment(selectedDateRange[1]).format('YYYY-MM-DD')}
        </p>
      )}

      {/* Custom styles */}
      <style>
        {`
          .booking-calendar {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
          }

          .rented {
            background-color: #ffe6e6 !important;
            color: red !important;
          }

          .available {
            background-color: #e6ffe6 !important;
            color: green !important;
          }

          .react-calendar__tile--now {
            background: #aaffaa !important;
          }

          .react-calendar__tile--active {
            background: #007bff !important;
            color: white;
          }

          .react-calendar__navigation button {
            color: #007bff;
          }
        `}
      </style>

    </div>
  );
};

export default BookingCalendar;
