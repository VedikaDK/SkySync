import React, { useState, useEffect } from 'react';
import './BookingFrom.css';

const BookingForm = ({ SelectedSeatData }) => {
    const [seatInfo, setSeatInfo] = useState([]);
console.log("Data in Booking form ", SelectedSeatData)
    // Logging the initial data received
    useEffect(() => {
        console.log('SelectedSeatData:', SelectedSeatData);
        if (SelectedSeatData && SelectedSeatData.selectedSeats && SelectedSeatData.selectedSeats.length > 0) {
            const initialSeats = SelectedSeatData.selectedSeats.map((seat) => ({
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

    return (
        <div className="booking-form-container">
            <h2>Passenger Details</h2>
            {seatInfo.length === 0 ? (
                <p>No additional passengers to book for.</p>
            ) : (
                seatInfo.map((seat, index) => (
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
                                        checked={seat.gender === 'male'}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                    Male
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`gender-${index}`}
                                        value="female"
                                        checked={seat.gender === 'female'}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                    Female
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`gender-${index}`}
                                        value="other"
                                        checked={seat.gender === 'other'}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                    Other
                                </label>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default BookingForm;
