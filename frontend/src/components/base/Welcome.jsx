/* Este componente está listo NO TOCAR*/
import React, { useEffect } from 'react';
import '../../styles/base/welcome.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logoHome from '../../assets/IMG/Gipsy_imagotipo_color.png';

function WelcomePage() {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaHome');

    return () => {
      document.body.classList.remove('barraCurvaHome');
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="containerHome">
      <img src={logoHome} alt="Logo" className="logoHome" />
      <h2>Bienvenido a Control de Garantías Gipsy</h2>
      <input className="inputHome" type="submit" value="Ingresar" onClick={() => navigate('/user/login')}></input>
      <br /><br />

      <div className="welcome-footer">
        <Link to="/technical-service" className="service-link"> 
          Servicio Técnico
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;