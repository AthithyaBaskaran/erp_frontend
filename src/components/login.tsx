import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import AuthForm from "./AuthForm";
import Panel from "./Panel";
import logImg from "../assets/images/log.svg";
import registerImg from "../assets/images/register.svg";

const App: React.FC = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("roles");
    
    if (token) {
      console.log("User already logged in with role:", role);
      
      // Redirect based on role
      if (role && typeof role === 'string') {
        const userRole = role.toLowerCase();
        if (userRole === 'supplier') {
          navigate("/supplier-dashboard");
        } else if (userRole === 'salesman') {
          navigate("/salesman-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const toggleMode = () => setIsSignUpMode(!isSignUpMode);

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <AuthForm />
      </div>
      <div className="panels-container">
        <Panel
          side="left"
          heading="TechLoom"
          text="Simplifying Life, One Innovation at a Time!"
          buttonText="Sign up"
          onClick={toggleMode}
          imgSrc={logImg}
        />
        <Panel
          side="right"
          heading="Light Up Your Lifestyle"
          text="Every Product Has a Story — Let Yours Begin Here."
          buttonText="Sign in"
          onClick={toggleMode}
          imgSrc={registerImg}
        />
      </div>
    </div>
  );
};

export default App;


