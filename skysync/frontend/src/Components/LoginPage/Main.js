import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "../../App.css";
import Login from "./Login";
import Signup from "./Signup";
import PhoneSignUp from "./PhoneSignUp"
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import { UserAuthContextProvider } from "../../context/UserAuthContext";


function Main() {
  return (
    <Container style={{ width: "400px" }}>
      
          <UserAuthContextProvider>
            <Routes>
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />   
              <Route path="/phonesignup" element={<PhoneSignUp />} />
            </Routes>
          </UserAuthContextProvider>
        
    </Container>
  );
}

export default Main;
