import React, { useEffect } from 'react';
import '../../styles/base/welcome.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logoHome from '../../assets/IMG/Gipsy_imagotipo_color.png';
import imagenLateral from '../../assets/IMG/normasGarantias.png'; 

function WelcomePage() {
  useEffect(() => {
    document.body.classList.add('barraCurvaHome');

    return () => {
      document.body.classList.remove('barraCurvaHome');
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="containerHome">
      
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