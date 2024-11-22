import React from 'react';
import './Footer.css'; // Import the CSS file


const Footer = () => {
    return (
        <footer className="footer-container">
            <h2 className="footer-logo">SkySync.com</h2>
            
            <ul className="footer-nav">
                <li><a href="#">Home</a></li>
                <li><a href="/About">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="Feedback">Feedback</a></li>
            </ul>

            <div className="footer-social">
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-linkedin"></i></a>
                <a href="#"><i className="fa fa-google"></i></a>
            </div>

            <p className="footer-copyright">
                &copy; 2024 All rights reserved | <a href="#">SkySync.com</a>
            </p>
        </footer>
    );
}

export default Footer;
