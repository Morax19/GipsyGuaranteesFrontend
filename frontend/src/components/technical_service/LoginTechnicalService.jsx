/* Este componente esta listo NO TOCAR */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/technical_service/loginTechnicalService.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

function LoginTechnicalService() {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaLoginTechnicalService');

    return () => {
      document.body.classList.remove('barraCurvaLoginTechnicalService');
    };
  }, []);

  const [EmailAddress, setEmailAddress] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/technicalServiceLogin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ EmailAddress, Password }),
      });
      
      const data = await response.json();
      if (response.ok){
        const { access_token } = data;
        sessionStorage.setItem('session_token', access_token);
        navigate('/technical-service/home');
      } else {
        alert(data.error || data.detail || data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="cardContainerLoginTechnicalService">
      <img src={logo} alt="Logo" className="logoLoginTechnicalService" />
      <h2>Iniciar sesión como <br/> Servicio Técnico</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="EmailAddress"
          placeholder="Correo Electrónico"
          required
          value={EmailAddress}
          onChange={e => setEmailAddress(e.target.value)}
        />
        <br />
        <input
          type="password"
          name="Password"
          placeholder="Contraseña"
          required
          value={Password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        <a href="#" onClick={e => { e.preventDefault(); navigate('/technical-service/forgot-password/'); }}>¿Olvidaste tu contraseña?</a>
      </p>

      <div className="login-footer">
        <Link to="/user/login" className="login-link"> 
          Soy Cliente
        </Link>
        <br />
        <Link to="/admin/login" className="login-link"> 
          Soy Administrador
        </Link>
      </div>
    </div>
  );
}

export default LoginTechnicalService;