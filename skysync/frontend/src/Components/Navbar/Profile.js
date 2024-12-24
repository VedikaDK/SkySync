import React, { useState, useEffect } from "react";
import "./Profile.css";
import Footer from "../Footer/Footer";
const Profile = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
    if (!loginDetails || !loginDetails.email) {
      setError("No login details found");
      setLoading(false);
      return;
    }

    const email = loginDetails.email;

    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile?email=${email}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="profile-container">
        {user ? (
          <div className="profile-details">
            <button className="gender"></button>
            <h1 className="profile-name">{user.firstname}</h1>
            <h1 className="profile-name">{user.lastname}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        ) : (
          <div>No user found</div>
        )}
      </div>

      <div className="booking-history">
        <h2>Booking History</h2>
        {user.history && user.history.length > 0 ? (
          <div className="flight-cards">
            {user.history.map((flight, index) => (
              <div key={index} className="boarding-pass">
                <div className="pass-section left">
                  <div className="image-placeholder">
                  🎫
                  </div>
                </div>
                <div className="pass-section middle">
                  <div className="flight-info">
                    <p id="to">{flight.from}</p>
                    <p id="date">{new Date(flight.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flight-icon">✈</div>
                  <div className="flight-info">
                    <p id="to">{flight.to}</p>
                    
                  </div>
                </div>
                <div className="pass-section right">
                  <div>
                    <p id="flight-id">
                      <strong> </strong> {flight.flightID}
                    </p>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No booking history available.</p>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Profile;
