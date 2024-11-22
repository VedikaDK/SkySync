import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './FeedbackForm.module.css'; // CSS module

const StarRating = ({ rating, setRating }) => {
    return (
        <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`${styles.star} ${star <= rating ? styles.selectedStar : ''}`}
                >
                    ★
                </span>
            ))}
        </div>
    );
};



const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        contactName: '',
        phone: '',
        countryCode: '+91',
        email: '',
        pnr: '',
        origin: '',
        destination: '',
        voiceOfCustomer: '',
        touchPoint: '',
        reason: '',
        description: '',
    });
    const [rating, setRating] = useState(0); // Rating state
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = { ...formData, rating };
        if (formData.voiceOfCustomer === 'appreciation' || formData.voiceOfCustomer === 'suggestion') {
            delete dataToSubmit.touchPoint;
            delete dataToSubmit.reason;
        }

        try {
            const response = await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Feedback submitted successfully!');
            } else {
                alert('Error submitting feedback: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting the feedback.');
        }
    };

    const navigateToFeedbacks = () => {
        navigate('/CustomerFeedbacks');
    };

    const showAdditionalFields = formData.voiceOfCustomer !== 'appreciation' && formData.voiceOfCustomer !== 'suggestion';

    return (
        <div className={styles.feedbackPage}>
            <div className={styles.overlay}>

           <div className={styles.navbar}>    
            {/* Navbar */}
            <Navbar />
            </div> 



            {/* Heading */}
            <div className={styles.headingContainer}>
                <h2>Feedback Form</h2>
            </div>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.lineContainer}>
                <div className={styles.formGroup}>
                    <label>Contact Name*</label>
                    <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Phone*</label>
                    <input
                        type="text"
                        name="phone"
                        value={`${formData.countryCode} ${formData.phone}`}
                        onChange={(e) => {
                            const [code, ...number] = e.target.value.split(" ");
                            setFormData({
                                ...formData,
                                countryCode: code,
                                phone: number.join(" "),
                            });
                        }}
                        required
                    />
                </div>
            </div>


            <div  className={styles.lineContainer}>
                <div className={styles.formGroup}>
                    <label>Email*</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>PNR No</label>
                    <input
                        type="text"
                        name="pnr"
                        value={formData.pnr}
                        onChange={handleChange}
                    />
                </div>
          </div>

            
            <div className={styles.lineContainer}>
                 <div className={styles.formGroup}>
                    <label>Origin Airport Code*</label>
                    <select
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Origin Airport</option>
                        <option value="BLR">BLR</option>
                        <option value="DEL">DEL</option>
                        <option value="BOM">BOM</option>
                        <option value="HYD">HYD</option>
                        <option value="CCU">CCU</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Destination Airport Code*</label>
                    <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Destination Airport</option>
                        <option value="BLR">BLR</option>
                        <option value="DEL">DEL</option>
                        <option value="BOM">BOM</option>
                        <option value="HYD">HYD</option>
                        <option value="CCU">CCU</option>
                    </select>
                </div>
            </div>

            
                <div className={styles.formGroup}>
                    <label>Voice of Customer*</label>
                    <select
                        name="voiceOfCustomer"
                        value={formData.voiceOfCustomer}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select an option</option>
                        <option value="appreciation">Appreciation</option>
                        <option value="complaint">Complaint</option>
                        <option value="feedback">Feedback</option>
                        <option value="suggestion">Suggestion</option>
                    </select>
                </div>
                
                {showAdditionalFields && (
                    <>
                        <div className={styles.formGroup}>
                            <label>Customer Touch Point*</label>
                            <select
                                name="touchPoint"
                                value={formData.touchPoint}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a touch point</option>
                                <option value="airport">Airport</option>
                                <option value="website">Website</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Reason*</label>
                            <select
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a reason</option>
                                <option value="delay">Flight Delay</option>
                                <option value="cancellation">Flight Cancellation</option>
                                <option value="other">Other</option>
                            </select>
                        </div>



                    </>
                )}




                <div className={styles.formGroup}>
                    <label>Description*</label>
                    <textarea
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>




                <div className={styles.formGroup}>
                    <label>Rate Your Experience*</label>
                    <StarRating rating={rating} setRating={setRating} />
                
                    <p>Rating is: {rating}/5</p>
                  

                </div>





                <div className={styles.buttonContainer}>


                    <button type="submit" className={styles.submitButton}>
                        Submit
                    </button>

                    <button
                        type="button"
                        className={styles.viewFeedbackButton}
                        onClick={navigateToFeedbacks}
                    >
                        View Customer Feedbacks
                    </button>


                </div>





            </form>
        </div>
        </div>
        
        
    );
};

export default FeedbackForm;