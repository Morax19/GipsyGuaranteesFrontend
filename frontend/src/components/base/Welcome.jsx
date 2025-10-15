import React from 'react';
import '../../styles/base/welcome.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logoHome from '../../assets/IMG/Gipsy_imagotipo_color.png';

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
      {/* Logo */}
      <img src={logoHome} alt="Logo" className="logoHome" />
      <h2>Bienvenido a Control de Garantías</h2>

      {/* Link a Términos y Condiciones (también abre modal al entrar) */}
      <p>
        Conoce los
          <span>&nbsp;</span>
          <a
            href="https://gipsymx-my.sharepoint.com/:b:/g/personal/desarrollo_grupogipsy_com/EdoiV6RFGuZGt8ahISYXjEwBXBlRLGO8t_1fxi2-WhVIqw?e=cxHwpY"
            target="_blank"
            rel="noopener noreferrer"
            className="conditions-link"
          >
            Términos y Condiciones
          </a>
          <span>&nbsp;</span>
        de nuestras garantías.
      </p>

      {/* Botón para ingresar */}
      <input className="inputHome" type="submit" value="Ingresar" onClick={() => navigate('/user/login')}></input>
      <br /><br />

      {/* Link a Servicio Técnico */}
      <div className="welcome-footer">
        <Link to="/technical-service" className="service-link"> 
          Servicio Técnico
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;