
import React, { useState, useEffect } from 'react';
import './AboutPage.css';

const AboutPage = () => {
    const [currentImage, setCurrentImage] = useState(0);

    // Array of image URLs
    const images = [
        './img6.jpg',
        './img2.jpg',
        './img7.jpg',
        './img9.jpg'
        
    ];

    // Slide effect logic: Change image every 3 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(intervalId); // Clean up on component unmount
    }, [images.length]);

    return (
        <div className='about-page'>
            <div className='upperpart'>
                <div className='Navbar'>
                <img 
                src='./airplane-logo.png' 
                alt="SkySync Logo" 
                className="navbar-logo"
               />
                    <nav>
                        <ul>
                            <li>Home</li>
                            <li>About</li>
                            <li>Contact</li>
                        </ul>
                    </nav>
                </div>
                <div className='SlidePhoto'>
                    <img 
                        src={images[currentImage]} 
                        alt="Slideshow" 
                        className="slide-img" 
                    />
                     <div className="about-text">
                        <h1>About Us</h1>
                    </div>


                </div>
                
            </div>

            <div className="Info">
            <h2 className="mission-title">We reimagine the way the world moves for the better</h2>
                <p className='Para1'>
                Movement is what we power. It’s our lifeblood. It runs through our veins. It’s what gets us out of bed each morning.
                 It pushes us to constantly reimagine how we can move better. 
                 For you. For all the places you want to go. For all the things you want to get.
                  For all the ways you want to earn. Across the entire world. In real time. 
                  At the incredible speed of now.
                </p>
                <h3 className='Mission'>Our Mission</h3>
                <p className='MissionStatement'>
                     We are SkySync. The go-getters.We envision a world where booking flights is as easy as a few clicks.
                      Our goal is to empower travelers by providing them with all the tools they need to manage their journeys efficiently. 
                     Whether it's booking a flight, managing reservations, or accessing customer support, 
                     SkySync is here to make your travel experience smooth and enjoyable.
                </p>


                {/* <h3 className='Commitment'></h3>
                <p className='CommitStatement'>
                
                </p>
                 */}

                 <h2 className='Commitment'>We Commit You</h2>
                 <p className='CommitmentStatement'>
                 At SkySync, we are dedicated to promoting sustainability and responsible travel within the aviation industry. 
                 We collaborate with airlines that share our commitment to eco-friendly practices, focusing on initiatives that reduce carbon footprints and enhance operational efficiency.
                  By leveraging innovative technology and data-driven solutions, we empower both airlines and travelers to make informed choices that benefit the planet.
                  Join us in our mission to reshape air travel for a greener tomorrow—because at SkySync, every journey contributes to a sustainable future!
                  <h5>"SkySync: Where Sustainable Travel Takes Flight!"</h5>
                 </p>

              
              <h2 className='Join'>Join Us on This Journey !</h2>
              <p className='JoinStatement'>
              We invite you to explore the future of air travel with SkySync. Sign up today and experience the convenience of our airline
               registration system—where every journey begins with simplicity!
              </p>
              
              <div className='Foot'>
                 
 
              </div>


            </div>
        </div>
    );
};

export default AboutPage;
