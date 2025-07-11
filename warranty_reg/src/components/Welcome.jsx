/* Este componente está listo NO TOCAR*/
import React, { useEffect } from 'react';
import '../styles/welcome.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/IMG/Gipsy_imagotipo_color.png';

function WelcomePage() {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurva');

    return () => {
      document.body.classList.remove('barraCurva');
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="container">
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