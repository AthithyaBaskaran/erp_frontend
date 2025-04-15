import React, { useState } from "react";
import "../styles/style.css";
import AuthForm from "./ChangePasswordForm";
import Panel from "./Panel";
import logImg from "../assets/images/log.svg";
import registerImg from "../assets/images/register.svg";

const App: React.FC = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

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