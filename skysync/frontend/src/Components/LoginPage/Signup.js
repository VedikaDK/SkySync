import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";
import './Signup.css'; 


const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState(""); 
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Step 1: Sign up using Firebase
    const userCredential = await signUp(email, password); // Firebase Authentication
    const firebaseUser = userCredential.user;

    const newUser = {
      firebaseUid: firebaseUser.uid, // Save Firebase UID to MongoDB
      firstname: firstName, // Change to match backend
      lastname: lastName,   // Change to match backend
      email,
      password,
      contact,
      gender // Add this if you have a contact input in your form
  };

    try {
      // Send POST request to backend
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });
  
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to home page or login after successful signup
        navigate("/");
      } else {
        // Handle errors
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Error: Unable to sign up");
    }


  };

  return (
    <>
    <div className="signuppage">
   <div className='signupc'> 
      <div className="signupcontainer">
        
        <h2 className="mb-3">Signup</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
               {/* FirstName ,LastName , Etc information to be added */}
           

               <Form.Group className="mb-3">
            
            <div className="radio-group">
              <Form.Check
                type="radio"
                label="Male"
                name="gender"
                value="Male"
                onChange={(e) => setGender(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Female"
                name="gender"
                value="Female"
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
          </Form.Group>


          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Control
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Control
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicContact">
          <Form.Control
              type="text"
              placeholder="Contact Number"
              onChange={(e) => setContact(e.target.value)} // Add this state
              required
          />
         </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Sign up
            </Button>
          </div>
        </Form>
      </div>


      <div className="infocontainer">
          <h2 className="Welcome"> " Welcome "</h2>
         
      </div>
      </div>

        <div className="AlreadyAccount">
        Already have an account? <Link to="/">Log In</Link>
      </div>
      </div>

     

    </>
  );
};

export default Signup;
