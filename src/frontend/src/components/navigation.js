import React from "react";
import { useNavigate } from "react-router-dom";

import '../styles/style_home.css';
export const Navigation = (props) => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/register");
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      
     
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          
          <a className="navbar-brand page-scroll" href="#page-top">
            IIT Dharwad
          </a>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            
            <li>
              <a href="#about" className="page-scroll">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Services
              </a>
            </li>
            
            <li>
              <a href="#testimonials" className="page-scroll">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#team" className="page-scroll">
                Team
              </a>
            </li>
            <li>
              <a href="#Map" className="page-scroll">
                Map
              </a>
            </li>
            <li>
            <button className="login-button" onClick={handleLoginClick}>
            Login
            </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
