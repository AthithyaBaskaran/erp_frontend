import React from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
const AuthForm: React.FC = () => {
    const navigate = useNavigate(); 

    const socialIcons = [
      { icon: <FaFacebookF />, link: "https://www.facebook.com/login" },
      { icon: <FaTwitter />, link: "https://twitter.com/login" },
      { icon: <FaGoogle />, link: "https://accounts.google.com/signin" },
      { icon: <FaLinkedinIn />, link: "https://www.linkedin.com/login" },
    ];
    
    function handleLogin(e: React.FormEvent) {
      e.preventDefault(); // Prevent default form submission
      console.log("1234567890");
      navigate("/dashboard");
    }
    
      
  return (
    <div className="signin-signup">
      {/* Sign In Form */}
      <form className="sign-in-form" onSubmit={handleLogin}>
        <h2 className="title">Change Password</h2>
        <div className="input-field">
          {/* <i className="fas fa-lock"></i> */}
          <VisibilityIcon className="password_icon"/>
          <input type="password" placeholder="Old Password" />
        </div>
        <div className="input-field">
          {/* <i className="fas fa-lock"></i> */}
          <VisibilityIcon className="password_icon"/>
          <input type="password" placeholder="New Password" />
        </div>
        <input type="submit" value="Change Password" className="btn solid" onClick={handleLogin}/>
        <p className="social-text">Or Sign in with social platforms</p>
        <div className="social-media">
            {socialIcons.map((item, idx) => (
            <a key={idx} href={item.link} className="social-icon">
                {item.icon}
            </a>
            ))}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
