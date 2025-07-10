import React, { useState } from 'react';
import '../styles/welcome.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/IMG/Gipsy_imagotipo_color.png';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <a className="back" href="/">
      </a>
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Bienvenido(a), GipsyGuarantees</h2>
      </div>
      <input type="submit" value="Ingresar" onClick={() => navigate('/login')}></input>
      <br /><br /> 
    </div>
  );
};

export default WelcomePage;