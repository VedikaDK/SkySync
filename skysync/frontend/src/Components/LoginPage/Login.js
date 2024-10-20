
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import PhoneSignUp from "./PhoneSignUp";
import { useUserAuth } from "../../context/UserAuthContext";
import './Login.css';  // Import the CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();
  const [phoneSignup, setPhoneSignup] = useState(false);// functionlity check

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
        // Firebase Email/Password Authentication
        const userCredential = await logIn(email, password);
  
        // Check MongoDB for the user after Firebase Authentication
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email , password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // User exists in MongoDB, proceed to home page
          navigate("/");
        } else {
          setError(data.message || "Login failed. User not found in MongoDB.");
        }
      } catch (err) {
        setError(err.message);
      }
    };
const handleGoogleSignIn = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await googleSignIn();

    // After Google Sign-In, check MongoDB for user existence
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userCredential.user.email }),
    });

    const data = await response.json();

    if (response.ok) {
      navigate("/");
    } else {
      setError(data.message || "Google Sign-In failed. User not found in MongoDB.");
    }
  } catch (error) {
    setError(error.message);
  }
};



  const handlePhoneSignupClick = () => {
    setPhoneSignup(!phoneSignup);
    // Optionally, reset phone/OTP state variables in PhoneSignUp
  };

  return (

    <div className="loginpage">
      <div id= "tag">
     <div id="tagline">
      "TURN MILES
      <br></br>
      INTO SMILES"
    </div>
    </div>
    <div className="login-container">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

         {/* You need to add functionlity for login here */}
        <Button variant="primary" type="submit" className="login-btn">
          Log In
        </Button>
      </Form>



      <hr />
        <div id="Google-button">
          <GoogleButton
            className="g-btn"
            type="dark"
            onClick={handleGoogleSignIn}
          />
        </div>
      


       <Button
        variant="success"
        className="phone-btn"
        onClick={handlePhoneSignupClick}
      >
        {phoneSignup ? "Cancel Phone Signup" : "Sign in with Phone"}
      </Button>
      {phoneSignup && <PhoneSignUp />}




      <div className="signup-link">
        Don't have an account? <Link to="/Main/signup">Sign up</Link>
      </div>
    </div>

    </div>
  );
};

export default Login;

