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
        <a
          href="https://gipsymx-my.sharepoint.com/:w:/g/personal/desarrollo_grupogipsy_com/EUb4GDoCEIFMtbQOoYi264MBsmMGd8auSJfj_hQ1bqN7yQ?e=lrP8vX"
          className="service-link"
          target='_blank'
        > 
          Servicio Técnico
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;