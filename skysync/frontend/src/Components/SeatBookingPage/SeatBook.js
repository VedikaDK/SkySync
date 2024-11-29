//Section 1 for FORM
import React from 'react';
import  { useState, useEffect } from 'react'; // Import useEffect
import { useLocation } from 'react-router-dom';




const SeatBook = ({ onDetailsChange }) => {
  const location = useLocation();
  const { from, to } = location.state || {};// Default to empty object if no state is passed
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    gender: '',
    dob: ''
  })


 

// Fetch login details from local storage (or your state management)
useEffect(() => {
    const loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
    if (loginDetails) {
      setFormData((prevData) => ({
        ...prevData,
        firstnamename: loginDetails.firstname || '',
        email: loginDetails.email || '',
        lastname:loginDetails.lastname||'',
        phone:loginDetails.phone||''
      }));
    }
  }, []);


 // Handle input changes
 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };







  //Add function to map the details of loged in customer and get details
  const getDetails = async () => {
    console.log('Fetching login details from localStorage...');
    const email = localStorage.getItem('email'); // Fetch the logged-in user's email from localStorage
    if (!email) {
        console.error('No email found in localStorage.');
        alert('No login details found!');
      
      return;
    }
    console.log(`Email retrieved from localStorage: ${email}`);
    try {
      const response = await fetch(`http://localhost:5000/userdetails?email=${email}`);
       // Adjust your API endpoint
       console.log('Fetching data from backend...');
      console.log(`Request URL: http://localhost:5000/userdetails?email=${email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user details. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data retrieved from backend:', data);
      setFormData((prevData) => ({
        ...prevData,
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        email: data.email || '',
        phone: data.phone || '',
      }));
      
      onDetailsChange(data);
      console.log("Data of user send succesfully ",data);
      alert('Login details imported successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to fetch login details.');
    }
  };



 
    return (
        
             <div>
                    <div className='FlightRoute'>
                    <p> {from} --- {to}</p>
                            
                    </div>
                    <div className='InformationForm'>
                        <h2 className='Title'>Enter Passenger Details</h2>
                        <button  className='import-btn'  onClick={getDetails} >Import Login Details</button>
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
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label>Phone Number:</label>
                                <input
                                    type="tel"
                                    name="phoneNo"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
