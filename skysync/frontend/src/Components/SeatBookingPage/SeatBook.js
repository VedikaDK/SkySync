//Section 1 for FORM



import React from 'react';
import  { useState, useEffect } from 'react'; // Import useEffect
import { useLocation } from 'react-router-dom';



const SeatBook = () => {

  const location = useLocation();
  const { from, to } = location.state || {};// Default to empty object if no state is passed
 
    return (
        
             <div>
                    <div className='FlightRoute'>
                    <p> {from} --- {to}</p>
                            
                    </div>
                    <div className='InformationForm'>
                        <h2 className='Title'>Enter Passenger Details</h2>
                        <button  className='import-btn'>Import Login Details</button>
                        <form className='RegForm'>
                        <div className='GenderSel'>
                                <label>Gender:</label>
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        
                                    />
                                    Male
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        
                                    />
                                    Female
                                </label>
                              
                        </div>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    
                                    required
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                   
                                    required
                                />
                            </div>
                            
                            <div>
                                <label>Phone Number:</label>
                                <input
                                    type="tel"
                                    name="phoneNo"
                                  
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    
                                    required
                                />
                            </div>
                            <div>
                                <label>Date of Birth:</label>
                                <input
                                    type="date"
                                    name="dob"
                                    
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    </div>
              

             

    
           

           
    );
};

export default SeatBook;
