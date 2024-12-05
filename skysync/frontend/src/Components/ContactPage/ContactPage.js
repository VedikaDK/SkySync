import React, { useState } from "react";
import "./ContactPage.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFax } from 'react-icons/fa';
import Footer from '../Footer/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [responseMessage, setResponseMessage] = useState("");

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        // Set the success message
        setResponseMessage("Message received, we will contact you at the earliest.");
        setFormData({ name: "", email: "", message: "" }); // Reset form

        // Clear the response message after 5 seconds
        setTimeout(() => {
          setResponseMessage("");
        }, 5000);
      } else {
        setResponseMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className='contact-page'>
      <div className='Navbar'>
        <img
          src='./airplane-logo.png'
          alt="SkySync Logo"
          className="navbar-logo"
        />
        <nav>
          <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/About">About</a></li>
          <li><a href="/ContactPage">Contact</a></li>
          </ul>
        </nav>
      </div>
      <div className="contact-container">
        <div className="contact-details">
          <div className="contact-box">
            <FaMapMarkerAlt size="2rem" color="#69bcd9" />
            <h3>OUR MAIN OFFICE</h3>
            <p>Shivaji Nagar<br />Pune, 411003</p>
          </div>
          <div className="contact-box">
            <FaPhoneAlt size="2rem" color="#69bcd9" />
            <h3>PHONE NUMBER</h3>
            <p>+91 8766653870<br /></p>
          </div>
          <div className="contact-box">
            <FaFax size="2rem" color="#69bcd9" />
            <h3>FAX</h3>
            <p>1-234-567-8900</p>
          </div>
          <div className="contact-box">
            <FaEnvelope size="2rem" color="#69bcd9" />
            <h3>EMAIL</h3>
            <p>skysync@gmail.com</p>
          </div>
        </div>
        <div className="contact-form">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter a valid email address"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your Message"
              required
            />
            <button type="submit">SUBMIT</button>
          </form>

          {/* Display the response message */}
          {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
      </div>
    
    </div>
      

  );
};

export default ContactPage;