import React, { useEffect } from 'react';
import '../../styles/base/welcome.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logoHome from '../../assets/IMG/Gipsy_imagotipo_color.png';
import imagenLateral from '../../assets/IMG/NormasGarantiasGipsy.png'; 

function WelcomePage() {

  const navigate = useNavigate();

  return ( 
    <div className="containerHome">

      {/* Curva inferior */}
      <svg
        className="wave-footer"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
      >
      <path d="M 0 20 C 80 110 160 80 240 80 C 320 40 420 80 500 60 L 500 150 L 0 150 Z" fill="#619990" />
      <path d="M 0 60 C 150 160 330 -30 500 60 L 500 150 L 0 150 Z" fill="#a2c0bb" />
      </svg>

      {/* Imagen lateral */}
      <div className="left-panel">
        <img src={imagenLateral} alt="Imagen de Bienvenida" className="imagenLateral" />
      </div>
      
      {/* Login */}
      <div className="right-panel">
        <img src={logoHome} alt="Logo" className="logoHome" />
        <h2>Bienvenido a Control de Garantías Gipsy</h2>
        <input 
            className="inputHome" 
            type="submit" 
            value="Ingresar" 
            onClick={() => navigate('/user/login')}
        />
        <a 
          className='conditions-link'
          onClick={() => navigate('/')}
        >
          Términos y condiciones
        </a>
        <br /><br />
      </div>

      <div className="welcome-footer"> 
        <a
          className="service-link"
          onClick={() => navigate('/technical-service')}
        > 
          Servicio Técnico
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;