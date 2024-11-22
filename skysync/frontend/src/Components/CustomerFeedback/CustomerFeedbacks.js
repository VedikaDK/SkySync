import React, { useEffect, useState } from 'react';
import styles from './CustomerFeedbacks.module.css';
import Navbar from '../Navbar/Navbar'; 
import Footer from '../Footer/Footer';

// StarRating component to render stars based on rating
const StarRating = ({ rating }) => {
    return (
        <div className={styles['star-rating']}>
            {[...Array(5)].map((_, index) => (
                <span
                    key={index}
                    className={index < rating ? `${styles.star} ${styles.filled}` : styles.star}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const CustomerFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/feedback');
            const data = await response.json();
            setFeedbacks(data); // Set all feedbacks from the database
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    useEffect(() => {
        fetchFeedbacks(); // Fetch feedbacks on component load
    }, []);








    
    return (
        <div className={styles['CustomerFeedback']} >

            <div className={styles['navbar-container']}>
              <Navbar />
            </div>

        <h1 className={styles.h1}>Customer Feedbacks</h1>

        
        {feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => 
            (
                    <div key={index} className={styles['feedback-entry']}>
                        <h3 className={styles.h3}>{feedback.contactName}</h3>
                        <p className={styles.p}>Voice of Customer: {feedback.voiceOfCustomer}</p>
                        <p className={styles.p}>{feedback.description}</p>
                        <div className={styles['rating-container']}>
                            <StarRating rating={feedback.rating} />
                            <span className={styles['rating-text']}>{feedback.rating}</span>
                        </div>
                    </div>
            ))
                ) : (
                    <p className={styles.p}>No feedbacks available.</p>
                )}


  
                </div>
                
               
            );
        };

export default CustomerFeedbacks;
