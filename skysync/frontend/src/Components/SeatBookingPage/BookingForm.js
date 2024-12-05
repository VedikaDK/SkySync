import React, { useState, useEffect } from 'react';
import './BookingFrom.css';

const BookingForm = ({ SelectedSeatData, onDetailsChange }) => {
    const [seatInfo, setSeatInfo] = useState([]);
    console.log("Data in Booking form ", SelectedSeatData);

    // Logging the initial data received
    useEffect(() => {
        console.log('SelectedSeatData:', SelectedSeatData);
        if (SelectedSeatData && SelectedSeatData.length > 0){
            const initialSeats = SelectedSeatData.map((seat) => ({
                seatNumber: seat,
                name: '',
                age: '',
                gender: '',
            }));
            setSeatInfo(initialSeats);
            console.log('Initial seatInfo:', initialSeats);
        }
    }, [SelectedSeatData]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSeats = [...seatInfo];
        updatedSeats[index][name] = value;
        setSeatInfo(updatedSeats);
        console.log(`Updated seatInfo[${index}]:`, updatedSeats[index]); // Log each change
    };

    const handleGenderChange = (e, index) => {
        const { value } = e.target;
        const updatedSeats = [...seatInfo];
        updatedSeats[index].gender = value;
        setSeatInfo(updatedSeats);
        console.log(`Updated gender for seat ${index}:`, updatedSeats[index].gender);
    }

     // Function to handle submitting the data and passing it to the parent
     const handleNextStep = () => {
        console.log('Submitting seat info to parent:', seatInfo);
        // Call the onDetailsChange callback to pass data back to the parent
        onDetailsChange(seatInfo);
    };

    // Function to log seatInfo to the console
    const handlePrintToConsole = () => {
        console.log('Passenger Details:', seatInfo);
        onDetailsChange(seatInfo);
    };

     // Log seatInfo when it changes
     useEffect(() => {
        console.log('Updated seatInfo:', seatInfo);
    }, [seatInfo]);

    return (
        <div className="booking-form-container">
            <h2>Passenger Details</h2>
            {seatInfo.length === 0 ? (
                <p>No additional passengers to book for.</p>
            ) : (
                <div className="scrollable-container">
                    {seatInfo.map((seat, index) => (
                        <div key={index} className="seat-card">
                            <h3>Seat {seat.seatNumber}</h3>
                            <div className="form-group">
                                <label htmlFor={`name-${index}`}>Name</label>
                                <input
                                    id={`name-${index}`}
                                    type="text"
                                    name="name"
                                    value={seat.name}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`age-${index}`}>Age</label>
                                <input
                                    id={`age-${index}`}
                                    type="number"
                                    name="age"
                                    value={seat.age}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="form-group2">
                                <label>Gender</label>
                                <div className="radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`gender-${index}`}
                                            value="male"
                                            checked={seatInfo[index]?.gender === 'male'}
                                            onChange={(e) => handleChange({ target: { name: 'gender', value: e.target.value } }, index)}
                                        />
                                        Male
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`gender-${index}`}
                                            value="female"
                                            checked={seatInfo[index]?.gender === 'female'}
                                            onChange={(e) => handleChange({ target: { name: 'gender', value: e.target.value } }, index)}
                                        />
                                        Female
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`gender-${index}`}
                                            value="other"
                                            checked={seatInfo[index]?.gender === 'other'}
                                            onChange={(e) => handleChange({ target: { name: 'gender', value: e.target.value } }, index)}
                                        />
                                        Other
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
        </div>
    );
};

export default BookingForm;
